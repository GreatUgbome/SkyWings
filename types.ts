/**
 * Global TypeScript type definitions for SkyWings
 */

export interface Flight {
  id: string;
  airlineId: string;
  originAirportId: string;
  destinationAirportId: string;
  flightNumber: string;
  departureTime: Date;
  arrivalTime: Date;
  price: number;
  availableSeats: number;
  totalSeats: number;
  aircraftType?: string;
  status: 'scheduled' | 'on_time' | 'delayed' | 'cancelled' | 'completed';
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id: string;
  userId: string;
  bookingReference: string;
  bookingDate: Date;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalPrice: number;
  paymentMethod?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Airport {
  id: string;
  iataCode: string;
  name: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
  createdAt: Date;
}

export interface Airline {
  id: string;
  iataCode: string;
  name: string;
  website?: string;
  createdAt: Date;
}

export interface FlightSegment {
  id: string;
  bookingId: string;
  flightId: string;
  seatNumber: string;
  passengerName: string;
  mealPreference?: string;
  specialRequests?: string;
  createdAt: Date;
}

export interface BookingConfirmationEmail {
  email: string;
  ref: string;
  paxName: string;
  flight: {
    number?: string;
    flightNumber?: string;
    date: string;
  };
  seats?: string[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface BookingEmailPayload {
  bookingId: string;
  email: string;
  subject: string;
  html: string;
}

export interface ErrorResponse {
  code: string;
  message: string;
  statusCode: number;
  details?: Record<string, any>;
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface SearchFilters {
  from?: string;
  to?: string;
  date?: string;
  minPrice?: number;
  maxPrice?: number;
  airline?: string;
}
