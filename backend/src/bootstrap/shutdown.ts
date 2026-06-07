/**
 * ShutdownManager
 * ----------------
 * Centralized lifecycle manager for graceful shutdown of the application.
 *
 * Responsibilities:
 * - Listen to system signals (SIGINT, SIGTERM)
 * - Execute registered cleanup tasks in order
 * - Ensure graceful shutdown with timeout fallback
 * - Handle uncaught exceptions and unhandled rejections
 *
 * Usage:
 * @example
 * const shutdownManager = new ShutdownManager(logger);
 * shutdownManager.register("mongodb", () => mongodb.disconnect());
 * shutdownManager.init(server);
 */
import type { Server } from 'http';

import type { Logger } from '../infra/logger/logger.interface.js';

type ShutdownTask = {
  name: string;
  handler: () => Promise<void> | void;
  priority?: number;
};

type ShutdownOptions = {
  timeout?: number;
};

export default class ShutdownManager {
  private logger: Logger;
  private tasks: ShutdownTask[] = [];
  private timeout: number;
  private isShuttingDown = false;

  constructor(logger: Logger, options: ShutdownOptions = {}) {
    this.logger = logger;
    this.timeout = options.timeout ?? 10000;
  }

  /**
   * Register a cleanup task
   */
  register(name: string, handler: ShutdownTask['handler'], priority: number = 0): void {
    this.tasks.push({ name, handler, priority });
  }

  /**
   * Execute all cleanup tasks (priority-based + parallel)
   */
  private async executeTasks(): Promise<void> {
    this.logger.info('Executing shutdown tasks...');

    // sort by priority (higher runs first)
    const sortedTasks = [...this.tasks].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));

    const results = await Promise.allSettled(
      sortedTasks.map(async (task) => {
        this.logger.info(`Closing: ${task.name}`);
        await task.handler();
        this.logger.info(`${task.name} closed successfully`);
      }),
    );

    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        this.logger.error(`Error closing ${sortedTasks[index].name}`, result.reason);
      }
    });
  }

  /**
   * Graceful shutdown handler
   */
  async shutdown(signal: string, server?: Server): Promise<void> {
    if (this.isShuttingDown) return;
    this.isShuttingDown = true;

    this.logger.info(`${signal} received. Starting graceful shutdown...`);

    const forceTimeout = setTimeout(() => {
      this.logger.error('Forced shutdown triggered');
      process.exit(1);
    }, this.timeout);

    try {
      // Stop accepting new connections
      if (server) {
        await new Promise<void>((resolve) => {
          server.close(() => {
            this.logger.info('HTTP server closed');
            resolve();
          });
        });
      }

      // Run cleanup tasks
      await this.executeTasks();

      clearTimeout(forceTimeout);
      this.logger.info('Shutdown completed successfully');

      process.exit(0);
    } catch (error) {
      this.logger.error('Shutdown failed', error);
      process.exit(1);
    }
  }

  /**
   * Initialize listeners
   */
  init(server?: Server): void {
    const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];

    signals.forEach((signal) => {
      process.once(signal, () => {
        void this.shutdown(signal, server);
      });
    });

    process.on('uncaughtException', (error: Error) => {
      this.logger.error('Uncaught Exception', error);
      void this.shutdown('uncaughtException', server);
    });

    process.on('unhandledRejection', (reason: unknown) => {
      this.logger.error('Unhandled Rejection', reason);
      void this.shutdown('unhandledRejection', server);
    });
  }
}
