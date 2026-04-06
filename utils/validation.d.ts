export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface EmailValidationOptions {
  allowTemplateLiterals?: boolean;
}

export function validateEmail(email: unknown): boolean;

export function validateBooking(booking: unknown): ValidationResult;

export function sanitizeBookingData(booking: any): {
  email: string;
  ref: string;
  paxName: string;
  flight: {
    number: string;
    date: string | undefined;
    flightNumber: string;
  };
  seats: string[];
};

export function validateFlightData(flight: unknown): ValidationResult;
