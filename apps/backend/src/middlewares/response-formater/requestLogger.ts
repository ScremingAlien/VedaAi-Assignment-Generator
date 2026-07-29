import type { NextFunction, Request, Response } from 'express';

import { logger } from '../../infra/logger/index.js';

/**
 * Request Logger Middleware
 * -------------------------------------------------------
 * Logs:
 * - HTTP method
 * - URL
 * - status code
 * - response time
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  res.on('finish', () => {
    const duration: number = Date.now() - start;

    logger.info('HTTP Request', {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${String(duration)}ms`,
    });
  });

  next();
}
