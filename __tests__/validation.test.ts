/**
 * Unit tests for validation utilities
 */

import { validateBooking, validateFlightData, sanitizeBookingData } from '../utils/validation';

describe('Validation Utilities', () => {
  describe('validateBooking', () => {
    it('should validate a correct booking', () => {
      const booking = {
        email: 'user@example.com',
        ref: 'SKYW-123456',
        paxName: 'John Doe',
        flight: {
          flightNumber: 'SKW101',
          date: '2024-03-15'
        },
        seats: ['12A', '12B']
      };

      const result = validateBooking(booking);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid email', () => {
      const booking = {
        email: 'invalid-email',
        ref: 'SKYW-123456',
        paxName: 'John Doe',
        flight: {
          flightNumber: 'SKW101',
          date: '2024-03-15'
        }
      };

      const result = validateBooking(booking);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid email format');
    });

    it('should require email', () => {
      const booking = {
        ref: 'SKYW-123456',
        paxName: 'John Doe',
        flight: {
          flightNumber: 'SKW101',
          date: '2024-03-15'
        }
      };

      const result = validateBooking(booking as any);
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain('Valid email is required');
    });
  });

  describe('sanitizeBookingData', () => {
    it('should sanitize booking data', () => {
      const booking = {
        email: '  USER@EXAMPLE.COM  ',
        ref: '  SKYW-123456  ',
        paxName: '  John Doe  ',
        flight: {
          flightNumber: '  SKW101  ',
          date: '2024-03-15'
        },
        seats: ['12A', '12B']
      };

      const sanitized = sanitizeBookingData(booking);
      expect(sanitized.email).toBe('user@example.com');
      expect(sanitized.ref).toBe('SKYW-123456');
      expect(sanitized.paxName).toBe('John Doe');
      expect(sanitized.flight.flightNumber).toBe('SKW101');
    });
  });

  describe('validateFlightData', () => {
    it('should validate correct flight data', () => {
      const flight = {
        flightNumber: 'SKW101',
        from: 'New York',
        to: 'London',
        date: '2024-03-15',
        price: 450
      };

      const result = validateFlightData(flight);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject negative price', () => {
      const flight = {
        flightNumber: 'SKW101',
        from: 'New York',
        to: 'London',
        date: '2024-03-15',
        price: -450
      };

      const result = validateFlightData(flight);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Valid price is required');
    });
  });
});
