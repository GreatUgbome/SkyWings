// LEGACY FILE - Actual Cloud Functions are in /functions/index.js
// This file is kept for reference only

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { createEmailTransporter } = require('./config/email.config');
const { validateBooking, sanitizeBookingData } = require('./utils/validation');
const logger = require('./utils/logger');

// Initialize Firebase Admin
admin.initializeApp();

// Initialize email transporter (can be null if credentials not configured)
const emailTransporter = createEmailTransporter();

/**
 * Trigger: When a new booking is created in a user's collection.
 * Path matches: artifacts/{appId}/users/{userId}/bookings/{bookingId}
 *
 * Security:
 * - Validates booking data structure
 * - Sanitizes email and other inputs
 * - Handles gracefully when email service unavailable
 * - Logs all operations for audit trail
 */
exports.sendBookingConfirmation = functions.firestore
  .document('artifacts/{appId}/users/{userId}/bookings/{bookingId}')
  .onCreate(async (snap, context) => {
    const bookingId = context.params.bookingId;
    let booking = snap.data();

    try {
      // Validate booking data
      const validation = validateBooking(booking);
      if (!validation.isValid) {
        logger.warn('Invalid booking data received', {
          bookingId,
          errors: validation.errors,
          bookingData: booking
        });
        await snap.ref.set(
          {
            emailError: `Validation failed: ${validation.errors.join(', ')}`,
            emailTimestamp: admin.firestore.FieldValue.serverTimestamp(),
            processed: true
          },
          { merge: true }
        );
        return;
      }

      // Sanitize booking data
      booking = sanitizeBookingData(booking);

      // Check if email service is available
      if (!emailTransporter) {
        logger.warn('Email service not configured', { bookingId });
        await snap.ref.set(
          {
            emailStatus: 'skipped_no_config',
            emailTimestamp: admin.firestore.FieldValue.serverTimestamp(),
            processed: true
          },
          { merge: true }
        );
        return;
      }

      // Send confirmation email
      const mailOptions = {
        from: '"SkyWings Reservations" <noreply@skywings.app>',
        to: booking.email,
        subject: `Booking Confirmed: ${booking.ref}`,
        html: generateBookingConfirmationHTML(booking),
        replyTo: 'support@skywings.app'
      };

      await emailTransporter.sendMail(mailOptions);

      // Update booking with success status
      await snap.ref.set(
        {
          emailSent: true,
          emailTimestamp: admin.firestore.FieldValue.serverTimestamp(),
          processed: true
        },
        { merge: true }
      );

      logger.info('Booking confirmation email sent successfully', {
        bookingId,
        email: booking.email
      });
    } catch (error) {
      logger.error('Failed to process booking confirmation', error, {
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
          { merge: true }
        );
      } catch (updateError) {
        logger.error('Failed to update booking error status', updateError, { bookingId });
      }
    }
  });

/**
 * Generate HTML for booking confirmation email
 */
const generateBookingConfirmationHTML = (booking) => {
  const flightNum = booking.flight?.number || booking.flight?.flightNumber || 'N/A';
  const flightDate = booking.flight?.date || 'Upcoming';
  const seats = booking.seats?.length ? booking.seats.join(', ') : 'Unassigned';

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
