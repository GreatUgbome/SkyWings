/**
 * Firebase Cloud Functions for SkyWings
 * Handles booking confirmation emails and other operations
 */

const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

// Initialize Firebase Admin
admin.initializeApp();

// Configure email transporter
const createEmailTransporter = () => {
  const {EMAIL_USER, EMAIL_PASSWORD} = process.env;

  if (!EMAIL_USER || !EMAIL_PASSWORD) {
    // eslint-disable-next-line no-console
    console.warn(
      "Warning: Email credentials not configured. Email notifications will be disabled."
    );
    return null;
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD
    }
  });
};

const emailTransporter = createEmailTransporter();

// Validation helpers
const validateEmail = email => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validateBooking = booking => {
  const errors = [];

  if (!booking.email || typeof booking.email !== "string") {
    errors.push("Valid email is required");
  } else if (!validateEmail(booking.email)) {
    errors.push("Invalid email format");
  }

  if (!booking.ref || typeof booking.ref !== "string") {
    errors.push("Booking reference is required");
  }

  if (!booking.paxName || typeof booking.paxName !== "string") {
    errors.push("Passenger name is required");
  }

  if (!booking.flight) {
    errors.push("Flight information is required");
  } else {
    if (!booking.flight.number && !booking.flight.flightNumber) {
      errors.push("Flight number is required");
    }
    if (!booking.flight.date) {
      errors.push("Flight date is required");
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const sanitizeBookingData = booking => {
  return {
    email: booking.email?.trim().toLowerCase() || "",
    ref: booking.ref?.trim() || "",
    paxName: booking.paxName?.trim() || "",
    flight: {
      number:
        booking.flight?.number?.trim() ||
        booking.flight?.flightNumber?.trim() ||
        "",
      date: booking.flight?.date || "",
      flightNumber: booking.flight?.flightNumber?.trim() || ""
    },
    seats: Array.isArray(booking.seats) ?
      booking.seats.map(s => s.toString().trim()) :
      []
  };
};

// Email template
const generateBookingConfirmationHTML = booking => {
  const flightNum =
    booking.flight?.number || booking.flight?.flightNumber || "N/A";
  const flightDate = booking.flight?.date || "Upcoming";
  const seats = booking.seats?.length ?
    booking.seats.join(", ") :
    "Unassigned";

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0;">
      <div style="background-color: #0f172a; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">SkyWings</h1>
      </div>
      <div style="padding: 30px;">
        <h2 style="color: #0ea5e9;">Booking Confirmed</h2>
        <p>Dear ${booking.paxName},</p>
        <p>Thank you for choosing SkyWings. Your flight has been successfully booked.</p>
        
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Reference:</strong> ${booking.ref}</p>
          <p><strong>Flight:</strong> ${flightNum}</p>
          <p><strong>Date:</strong> ${flightDate}</p>
          <p><strong>Seats:</strong> ${seats}</p>
        </div>
        
        <p>Please arrive at the airport at least 2 hours before departure.</p>
        <p style="margin-top: 30px; color: #64748b; font-size: 12px;">
          For any inquiries, contact us at support@skywings.app
        </p>
      </div>
    </div>
  `;
};

/**
 * sendBookingConfirmation - Triggered when a new booking is created
 * Path: artifacts/{appId}/users/{userId}/bookings/{bookingId}
 */
// eslint-disable-next-line no-unused-vars
exports.sendBookingConfirmation = functions.firestore
  .document("artifacts/{appId}/users/{userId}/bookings/{bookingId}")
  .onCreate(async (snap, context) => {
    const bookingId = context.params.bookingId;
    let booking = snap.data();

    try {
      // Validate booking data
      const validation = validateBooking(booking);
      if (!validation.isValid) {
        // eslint-disable-next-line no-console
        console.warn("Invalid booking data received", {
          bookingId,
          errors: validation.errors
        });
        await snap.ref.set(
          {
            emailError: `Validation failed: ${validation.errors.join(", ")}`,
            emailTimestamp: admin.firestore.FieldValue.serverTimestamp(),
            processed: true
          },
          {merge: true}
        );
        return;
      }

      // Sanitize booking data
      booking = sanitizeBookingData(booking);

      // Check if email service is available
      if (!emailTransporter) {
        // eslint-disable-next-line no-console
        console.warn("Email service not configured", {bookingId});
        await snap.ref.set(
          {
            emailStatus: "skipped_no_config",
            emailTimestamp: admin.firestore.FieldValue.serverTimestamp(),
            processed: true
          },
          {merge: true}
        );
        return;
      }

      // Send confirmation email
      const mailOptions = {
        from: "\"SkyWings Reservations\" <noreply@skywings.app>",
        to: booking.email,
        subject: `Booking Confirmed: ${booking.ref}`,
        html: generateBookingConfirmationHTML(booking),
        replyTo: "support@skywings.app"
      };

      await emailTransporter.sendMail(mailOptions);

      // Update booking with success status
      await snap.ref.set(
        {
          emailSent: true,
          emailTimestamp: admin.firestore.FieldValue.serverTimestamp(),
          processed: true
        },
        {merge: true}
      );

      // eslint-disable-next-line no-console
      console.log("Booking confirmation email sent successfully", {
        bookingId,
        email: booking.email
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to process booking confirmation", error, {
        bookingId,
        bookingRef: booking?.ref
      });

      try {
        // Update booking with error status
        await snap.ref.set(
          {
            emailError: error.message,
            emailErrorCode: error.code,
            emailTimestamp: admin.firestore.FieldValue.serverTimestamp(),
            processed: true
          },
          {merge: true}
        );
      } catch (updateError) {
        // eslint-disable-next-line no-console
        console.error(
          "Failed to update booking error status",
          updateError,
          {bookingId}
        );
      }
    }
  });
