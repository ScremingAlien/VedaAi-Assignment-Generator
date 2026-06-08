import { config } from '../../core/config/index.js';
import type { Logger } from './logger.interface.js';
import ConsoleLogger from './transports/console.logger.js';
import PinoLogger from './transports/pino.logger.js';

/**
 * Create logger instance based on config
 * @default {ConsoleLogger} - ConsoleLogger
 */

function resolveLogger(type: string): Logger {
  switch (type) {
    case 'pino':
      return new PinoLogger();

    case 'console':
      return new ConsoleLogger();

    default:
      console.warn(`Unknown logger: ${type}, using console`);
      return new ConsoleLogger();
  }
}

export const logger: Logger = resolveLogger(config.logger.provider);
