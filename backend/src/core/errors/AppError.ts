/**
 * Custom Application Error Class
 * -------------------------------------------------------
 * Standardized error object used across the application.
 * Extends the native Error class with additional metadata
 * for consistent error handling and API responses.
 *
 * This class should be used to:
 *  - Represent known/expected errors (e.g., validation, auth)
 *  - Provide HTTP status codes
 *  - Attach machine-readable error codes
 *  - Include optional structured error details
 *
 * @export
 * @class AppError
 * @extends {Error} - Native Error class of Node.js
 *
 * @param {string} message - Human-readable error message
 * @param {number} [statusCode=500] - HTTP status code
 * @param {string} [code="INTERNAL_ERROR"] - Machine-readable error code
 * @param {any} [details=null] - Additional structured error details
 * @param {boolean} [isOperational=true] - Flag indicating if the error is operational
 * @example
 * // Throwing a custom error in service/controller
 * throw new AppError("User not found", 404, "USER_NOT_FOUND");
 *
 * @example
 * // With validation details
 * throw new AppError(
 *   "Validation failed",
 *   400,
 *   "VALIDATION_ERROR",
 *   ["some data"]
 * );
 */
export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public details: unknown;
  public isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_ERROR',
    details: unknown = null,
    isOperational: boolean = true,
  ) {
    super(message);

    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}
