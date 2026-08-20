export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 500, code = "INTERNAL_SERVER_ERROR", isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ValidationError extends AppError {
  public readonly errors?: Record<string, string[]>;

  constructor(message: string, errors?: Record<string, string[]>) {
    super(message, 400, "VALIDATION_ERROR");
    this.errors = errors;
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Authentication required or invalid credentials") {
    super(message, 401, "AUTHENTICATION_ERROR");
  }
}

export class AuthorizationError extends AppError {
  constructor(message = "You do not have permission to perform this action") {
    super(message, 403, "AUTHORIZATION_ERROR");
  }
}

export class NotFoundError extends AppError {
  constructor(entity: string, idOrSlug?: string | number) {
    super(`${entity}${idOrSlug ? ` (${idOrSlug})` : ""} not found`, 404, "NOT_FOUND");
  }
}

export class DatabaseError extends AppError {
  constructor(message = "Database operation failed") {
    super(message, 500, "DATABASE_ERROR");
  }
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  validationErrors?: Record<string, string[]>;
}

export function handleActionError(error: unknown): ApiResponse<never> {
  console.error("[Action Error]", error);

  if (error instanceof ValidationError) {
    return {
      success: false,
      error: error.message,
      code: error.code,
      validationErrors: error.errors,
    };
  }

  if (error instanceof AppError) {
    return {
      success: false,
      error: error.message,
      code: error.code,
    };
  }

  if (error instanceof Error) {
    return {
      success: false,
      error: error.message,
      code: "UNKNOWN_ERROR",
    };
  }

  return {
    success: false,
    error: "An unexpected error occurred. Please try again.",
    code: "UNKNOWN_ERROR",
  };
}
