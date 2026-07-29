import rateLimit, { type Options as RateLimitOptions } from 'express-rate-limit';

/**
 * Rate Limiter Factory
 * -------------------------------------------------------
 * Creates a configurable Express rate limiter middleware.
 *
 * Features:
 * - Customizable request limits
 * - Standard rate limit headers support
 * - Structured JSON error response
 * - Safe defaults for production use
 *
 * @example
 * // Basic usage
 * app.use(rateLimiter());
 *
 * @example
 * // Custom config
 * app.use(
 *   rateLimiter({
 *     windowMs: 10 * 60 * 1000,
 *     max: 50,
 *     message: "Too many login attempts",
 *   })
 * );
 */

export type RateLimiterConfig = {
  /**
   * Time window in milliseconds
   * @default 15 minutes
   */
  windowMs?: number;

  /**
   * Max number of requests per window per IP
   * @default 100
   */
  max?: number;

  /**
   * Custom error message
   */
  message?: string;

  /**
   * Optional override for advanced use cases
   */
  keyGenerator?: RateLimitOptions['keyGenerator'];
};

const rateLimiter = ({
  windowMs = 15 * 60 * 1000,
  max = 100,
  message = 'Too many requests, please try again later.',
  keyGenerator,
}: RateLimiterConfig = {}) => {
  return rateLimit({
    windowMs,
    max,

    standardHeaders: true,
    legacyHeaders: false,

    keyGenerator,

    handler: (req, res) => {
      res.status(429).json({
        success: false,
        message,
      });
    },
  });
};

export default rateLimiter;
