/**
 * Application constants and configuration values
 */

// Flight status values
export const FLIGHT_STATUS = {
  SCHEDULED: 'scheduled',
  ON_TIME: 'on_time',
  DELAYED: 'delayed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed'
} as const;

// Booking status values
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed'
} as const;

// Meal preferences
export const MEAL_PREFERENCES = {
  VEGETARIAN: 'vegetarian',
  VEGAN: 'vegan',
  HALAL: 'halal',
  KOSHER: 'kosher',
  GLUTEN_FREE: 'gluten_free',
  NO_PREFERENCE: 'no_preference'
} as const;

// Airport check-in times (in hours)
export const CHECK_IN_TIME = {
  DOMESTIC: 1.5,
  INTERNATIONAL: 2,
  REGIONAL: 1
} as const;

// Tax rates
export const TAX_RATE = 0.1; // 10%

// Pagination defaults
export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  DEFAULT_OFFSET: 0
} as const;

// Email templates
export const EMAIL_SUBJECTS = {
  BOOKING_CONFIRMATION: 'Booking Confirmed',
  BOOKING_CANCELLATION: 'Booking Cancelled',
  FLIGHT_DELAY: 'Flight Delay Notification',
  FLIGHT_CANCELLATION: 'Flight Cancelled'
} as const;

// Error messages
export const ERROR_MESSAGES = {
  INVALID_EMAIL: 'Please provide a valid email address',
  INVALID_BOOKING_DATA: 'Booking data is invalid',
  FLIGHT_NOT_FOUND: 'Flight not found',
  BOOKING_NOT_FOUND: 'Booking not found',
  INSUFFICIENT_SEATS: 'Insufficient seats available',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  EMAIL_SEND_FAILED: 'Failed to send email notification'
} as const;

// Firebase paths
export const FIRESTORE_PATHS = {
  ARTIFACTS: 'artifacts',
  USERS: 'users',
  BOOKINGS: 'bookings',
  PUBLIC: 'public',
  FLIGHTS: 'flights',
  DATA: 'data'
} as const;

// Timeouts (in milliseconds)
export const TIMEOUTS = {
  EMAIL_SEND: 30000,
  DATABASE_QUERY: 10000,
  FIRESTORE_READ: 5000
} as const;

export default {
  FLIGHT_STATUS,
  BOOKING_STATUS,
  MEAL_PREFERENCES,
  CHECK_IN_TIME,
  TAX_RATE,
  PAGINATION,
  EMAIL_SUBJECTS,
  ERROR_MESSAGES,
  FIRESTORE_PATHS,
  TIMEOUTS
};
