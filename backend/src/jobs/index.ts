import { logger } from '../infra/logger/index.js';

export async function JobBootstrap() {
  await import('./workers/generation.worker.js');

  logger.info('Generation worker started');
}
