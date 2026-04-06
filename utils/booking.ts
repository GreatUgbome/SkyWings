/**
 * Common utility functions for booking and flight operations
 */

/**
 * Generate a unique booking reference
 * Format: SKYW-XXXXXX (6 random alphanumeric chars)
 */
export const generateBookingReference = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let reference = 'SKYW-';
  for (let i = 0; i < 6; i++) {
    reference += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return reference;
};

/**
 * Calculate flight duration in hours
 */
export const calculateFlightDuration = (departureTime: Date, arrivalTime: Date): number => {
  const diffMs = new Date(arrivalTime).getTime() - new Date(departureTime).getTime();
  return diffMs / (1000 * 60 * 60); // Convert to hours
};

/**
 * Format flight duration as human-readable string
 */
export const formatFlightDuration = (hours: number): string => {
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  return `${wholeHours}h ${minutes}m`;
};

/**
 * Check if flight is available (has available seats)
 */
export const isFlightAvailable = (availableSeats: number, requiredSeats: number = 1): boolean => {
  return availableSeats >= requiredSeats;
};

/**
 * Calculate total booking price
 */
export const calculateBookingPrice = (
  flightPrice: number,
  passengerCount: number,
  taxRate: number = 0.1
): number => {
  const subtotal = flightPrice * passengerCount;
  const tax = subtotal * taxRate;
  return Math.round((subtotal + tax) * 100) / 100; // Round to 2 decimal places
};

/**
 * Format price with currency
 */
export const formatPrice = (price: number, currency: string = 'USD'): string => {
  return `${currency} ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

/**
 * Validate seat number format (e.g., "12A", "1B")
 */
export const isValidSeatNumber = (seat: string): boolean => {
  return /^[0-9]+[A-Z]$/.test(seat);
};

/**
 * Generate seat recommendations based on aircraft type
 */
export const getRecommendedSeats = (aircraftType: string, count: number): string[] => {
  const seatsPerRow: Record<string, number> = {
    'Boeing 737': 6,
    'Boeing 777': 10,
    'Airbus A320': 6,
    'Airbus A380': 11
  };

  const cols = seatsPerRow[aircraftType] || 6;
  const seats: string[] = [];

  // Recommend front rows (lower numbers)
  for (let row = 1; row <= Math.ceil(count / cols); row++) {
    for (let col = 0; col < cols && seats.length < count; col++) {
      const colLetter = String.fromCharCode(65 + col); // A, B, C...
      seats.push(`${row}${colLetter}`);
    }
  }

  return seats;
};

export default {
  generateBookingReference,
  calculateFlightDuration,
  formatFlightDuration,
  isFlightAvailable,
  calculateBookingPrice,
  formatPrice,
  isValidSeatNumber,
  getRecommendedSeats
};
