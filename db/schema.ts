/**
 * MongoDB Schema Definitions for SkyWings
 * Collections and their structure
 */

export interface Flight {
  _id?: string;
  airlineId: string;
  flightNumber: string;
  from: string;
  to: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
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
  _id?: string;
  userId: string;
  bookingReference: string;
  email: string;
  paxName: string;
  bookingDate: Date;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalPrice: number;
  paymentMethod?: string;
  flight: {
    number?: string;
    flightNumber?: string;
    date: string;
  };
  seats?: string[];
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  _id?: string;
  email: string;
  passwordHash: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Airport {
  _id?: string;
  iataCode: string;
  name: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
  createdAt: Date;
}

export interface Airline {
  _id?: string;
  iataCode: string;
  name: string;
  website?: string;
  createdAt: Date;
}

export const COLLECTIONS = {
  FLIGHTS: 'flights',
  BOOKINGS: 'bookings',
  USERS: 'users',
  AIRPORTS: 'airports',
  AIRLINES: 'airlines'
} as const;
