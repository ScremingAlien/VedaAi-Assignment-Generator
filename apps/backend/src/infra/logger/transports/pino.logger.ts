import pino, { type Logger as PinoInstance } from 'pino';

import { config } from '../../../core/config/index.js';
import envManager from '../../../core/env/env.js';
import getRequestId from '../../request-context/index.js';
import type { Logger } from '../logger.interface.js';

export default class PinoLogger implements Logger {
  private logger: PinoInstance;

  constructor() {
    this.logger = pino({
      level: config.logger.level,
      base: { env: config.nodeEnv },

      timestamp: pino.stdTimeFunctions.isoTime,

      mixin() {
        const requestId = getRequestId();
        return requestId ? { requestId } : {};
      },

      transport: !envManager.isProduction()
        ? {
            target: 'pino-pretty',
            options: { colorize: true },
          }
        : undefined,
    });
  }

  info(message: string, meta: unknown = {}): void {
    this.logger.info(meta as object, message);
  }

  error(message: string, meta: unknown = {}): void {
    this.logger.error(meta as object, message);
  }

  warn(message: string, meta: unknown = {}): void {
    this.logger.warn(meta as object, message);
  }

  debug(message: string, meta: unknown = {}): void {
    this.logger.debug(meta as object, message);
  }
}
