import { randomUUID } from 'crypto';

import type { NextFunction, Request, Response } from 'express';

import { APP_SETTING } from '../../core/constants/app.constants.js';
import { requestContext } from '../../infra/request-context/index.js';

/**
 * Request ID Middleware
 * -------------------------------------------------------
 * - Attaches a unique requestId to AsyncLocalStorage
 * - Reuses incoming requestId if provided (validated)
 * - Sets requestId in response headers
 *
 * Ensures traceability across logs and services
 */
export function requestIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  const incomingId = req.header(APP_SETTING.REQUEST_ID_HEADER);

  const isValidId = typeof incomingId === 'string' && incomingId.length < 100;

  const requestId = isValidId ? incomingId : randomUUID();

  requestContext.run({ requestId }, () => {
    res.setHeader(APP_SETTING.REQUEST_ID_HEADER, requestId);
    next();
  });
}
