import type { NextFunction, Request, Response } from 'express';

/**
 * Response Formatter Middleware
 * -------------------------------------------------------
 * Adds `res.success()` helper for consistent API responses
 */
export function responseFormatter(req: Request, res: Response, next: NextFunction): void {
  res.success = ({ message = 'Success', data = null, meta = null, statusCode = 200 } = {}) => {
    res.status(statusCode).json({
      success: true,
      message,
      data,
      meta,
      timestamp: new Date().toISOString(),
    });
  };

  next();
}
