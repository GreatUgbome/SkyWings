const nodemailer = require('nodemailer');

/**
 * Email configuration for SkyWings
 * Uses environment variables for secure credential management
 */
const createEmailTransporter = () => {
  const { EMAIL_USER, EMAIL_PASSWORD } = process.env;

  if (!EMAIL_USER || !EMAIL_PASSWORD) {
    console.warn(
      'Warning: Email credentials not configured. Email notifications will be disabled.'
    );
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD
    }
  });
};

const emailTemplates = {
  bookingConfirmation: (booking) => ({
    subject: `Booking Confirmed: ${booking.ref}`,
    html: getBookingConfirmationHTML(booking)
  })
};

const getBookingConfirmationHTML = (booking) => {
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
        <p>Dear ${booking.paxName || 'Traveler'},</p>
        <p>Thank you for choosing SkyWings. Your flight has been successfully booked.</p>
        
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Reference:</strong> ${booking.ref}</p>
          <p><strong>Flight:</strong> ${flightNum}</p>
          <p><strong>Date:</strong> ${flightDate}</p>
          <p><strong>Seats:</strong> ${seats}</p>
        </div>
        
        <p>Please arrive at the airport at least 2 hours before departure.</p>
        <p style="margin-top: 30px; color: #64748b; font-size: 12px;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    </div>
  `;
};

module.exports = {
  createEmailTransporter,
  emailTemplates,
  getBookingConfirmationHTML
};
