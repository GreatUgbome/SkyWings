/**
 * Error handling utilities for consistent error responses
 */

export class AppError extends Error {
  constructor(
    public message: string,
    public code: string,
    public statusCode: number = 400,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 'VALIDATION_ERROR', 400, details);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    super(`${resource} not found${id ? ` (${id})` : ''}`, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 'UNAUTHORIZED', 401);
    this.name = 'UnauthorizedError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 'CONFLICT', 409, details);
    this.name = 'ConflictError';
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = 'Internal server error', details?: Record<string, any>) {
    super(message, 'INTERNAL_SERVER_ERROR', 500, details);
    this.name = 'InternalServerError';
  }
}

/**
 * Safe error handler that logs and formats errors
 */
export const handleError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    return new InternalServerError(error.message);
  }

  return new InternalServerError('Unknown error occurred');
};

export default {
  AppError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ConflictError,
  InternalServerError,
  handleError
};
