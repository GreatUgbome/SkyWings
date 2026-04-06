/**
 * Validation utilities for booking and flight operations
 */

const validateBooking = (booking) => {
  const errors = [];

  if (!booking.email || typeof booking.email !== 'string') {
    errors.push('Valid email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(booking.email)) {
    errors.push('Invalid email format');
  }

  if (!booking.ref || typeof booking.ref !== 'string') {
    errors.push('Booking reference is required');
  }

  if (!booking.paxName || typeof booking.paxName !== 'string') {
    errors.push('Passenger name is required');
  }

  if (!booking.flight) {
    errors.push('Flight information is required');
  } else {
    if (!booking.flight.number && !booking.flight.flightNumber) {
      errors.push('Flight number is required');
    }
    if (!booking.flight.date) {
      errors.push('Flight date is required');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const validateFlightData = (flight) => {
  const errors = [];

  if (!flight.flightNumber || typeof flight.flightNumber !== 'string') {
    errors.push('Flight number is required');
  }

  if (!flight.from || typeof flight.from !== 'string') {
    errors.push('Departure location is required');
  }

  if (!flight.to || typeof flight.to !== 'string') {
    errors.push('Destination is required');
  }

  if (!flight.date || typeof flight.date !== 'string') {
    errors.push('Flight date is required');
  }

  if (typeof flight.price !== 'number' || flight.price < 0) {
    errors.push('Valid price is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const sanitizeBookingData = (booking) => {
  return {
    email: booking.email?.trim().toLowerCase() || '',
    ref: booking.ref?.trim() || '',
    paxName: booking.paxName?.trim() || '',
    flight: {
      number: booking.flight?.number?.trim() || booking.flight?.flightNumber?.trim() || '',
      date: booking.flight?.date || '',
      flightNumber: booking.flight?.flightNumber?.trim() || ''
    },
    seats: Array.isArray(booking.seats) ? booking.seats.map((s) => s.toString().trim()) : []
  };
};

module.exports = {
  validateBooking,
  validateFlightData,
  sanitizeBookingData
};
