/**
 * Logger Interface
 * -------------------------------------------------------
 * Defines a standard logging contract for the application.
 *
 * This interface ensures that all logging implementations
 * (e.g., Pino, Winston, Console, or external services)
 * follow a consistent API.
 *
 * Why this matters:
 * - Enables easy swapping of logging providers
 * - Keeps application code decoupled from logging library
 * - Ensures structured logging across the system
 *
 * All custom logger implementations MUST implement this interface.
 *
 * @example
 * class PinoLogger implements Logger { ... }
 *
 * @example
 * logger.info("User created", { userId: "123" });
 */
export interface Logger {
  /**
   * Log informational messages
   * -------------------------------------------------------
   * Used for normal application flow events such as:
   * - Successful operations
   * - Service start/stop
   * - Request lifecycle logs
   *
   * @param message - Human-readable log message
   * @param meta - Optional structured metadata (JSON object)
   *
   * @example
   * logger.info("User created", { userId: "123" });
   */
  info(message: string, meta?: unknown): void;

  /**
   * Log error messages
   * -------------------------------------------------------
   * Used for unexpected failures and critical issues.
   *
   * Should include:
   * - Error message
   * - Stack trace (if available)
   * - Relevant context
   *
   * @param message - Error message
   * @param meta - Optional error details or context
   *
   * @example
   * logger.error("Database connection failed", { error });
   */
  error(message: string, meta?: unknown): void;

  /**
   * Log warning messages
   * -------------------------------------------------------
   * Used for non-critical issues that may need attention:
   * - Deprecated usage
   * - Retry attempts
   * - Suspicious activity
   *
   * @param message - Warning message
   * @param meta - Optional context
   *
   * @example
   * logger.warn("Rate limit nearing threshold", { ip });
   */
  warn(message: string, meta?: unknown): void;

  /**
   * Log debug messages
   * -------------------------------------------------------
   * Used for detailed debugging information.
   *
   * Typically enabled only in development environments.
   *
   * @param message - Debug message
   * @param meta - Optional debug data
   *
   * @example
   * logger.debug("Payload received", { body });
   */
  debug(message: string, meta?: unknown): void;
}
