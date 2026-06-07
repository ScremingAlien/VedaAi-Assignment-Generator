import { generationQueue } from '../queues/generation.queue.js';

export async function enqueueGeneration(assignmentId: string) {
  await generationQueue.add(
    'assessment-generation',

    {
      assignmentId,
    },

    {
      attempts: 3,

      backoff: {
        type: 'exponential',
        delay: 5000,
      },

      removeOnComplete: 100,

      removeOnFail: 50,
    },
  );
}
