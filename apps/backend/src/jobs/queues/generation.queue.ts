import { Queue, QueueEvents } from 'bullmq';

import { redis } from '../../infra/redis/redis.js';

export const generationQueue = new Queue('assessment-generation', {
  connection: redis,
});

export interface GenerationJobData {
  assignmentId: string;
}

export const generationEvents = new QueueEvents('assessment-generation', {
  connection: redis,
});
