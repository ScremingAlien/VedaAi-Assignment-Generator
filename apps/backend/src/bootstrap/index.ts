import databases from '../infra/db/index.js';
import { logger } from '../infra/logger/index.js';
import { JobBootstrap } from '../jobs/index.js';
import { startRecoveryWorker } from '../jobs/recovery.bootstrap.js';
import { AssessmentRecoveryService } from '../jobs/workers/RecoveryService.js';
import { AssignmentModel } from '../services/assignment/model/assignment.model.js';
import { AssignmentRepository } from '../services/assignment/repository/assignment.repository.js';
import ShutdownManager from './shutdown.js';

/**
 * Bootstrap the application (dependencies)
 * ------------------------------------------
 * Call your extra services or setup here to be initialized first
 * @implements 1. DB connection.
 * @async
 */
export async function bootstrapApp() {
  logger.info('Bootstrapping service...');

  // Database connection with graceful shutdown

  await databases.mongo.connect();
  const shutdownManager = new ShutdownManager(logger);
  shutdownManager.register('mongodb', () => databases.mongo.disconnect());

  await JobBootstrap();
  const recoveryService = new AssessmentRecoveryService(new AssignmentRepository(AssignmentModel));
  startRecoveryWorker(recoveryService);

  logger.info('All dependencies initialized');
}
