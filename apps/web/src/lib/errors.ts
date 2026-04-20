export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number
  ) {
    super(message);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed") {
    super(message, "VALIDATION_ERROR", 400);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, "NOT_FOUND", 404);
  }
}

export class AuthorizationError extends AppError {
  constructor(message = "You are not authorized to perform this action") {
    super(message, "AUTHORIZATION_ERROR", 403);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Resource conflict") {
    super(message, "CONFLICT", 409);
  }
}
