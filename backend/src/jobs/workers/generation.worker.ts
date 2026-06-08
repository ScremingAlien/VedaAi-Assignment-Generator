// jobs/workers/generation.worker.ts

import { Worker } from 'bullmq';

import { redis } from '../../infra/redis/redis.js';
import { SocketService } from '../../infra/socketio/socket.service.js';
import { AssessmentModel } from '../../services/assessment/model/assessment.model.js';
import { AssessmentRepository } from '../../services/assessment/repository/assessment.repository.js';
import { AssignmentModel } from '../../services/assignment/model/assignment.model.js';
import { AssignmentRepository } from '../../services/assignment/repository/assignment.repository.js';
import { AssessmentGenerationProcessor } from '../processors/assessment-generation.processor.js';

const processor = new AssessmentGenerationProcessor({
  assignmentRepository: new AssignmentRepository(AssignmentModel),
  assessmentRepository: new AssessmentRepository(AssessmentModel),
  socketService: new SocketService(),
});

const worker = new Worker(
  'assessment-generation',

  async (job) => {
    console.log('Processing Job:', job.id);
    await processor.process(job.data.assignmentId, job);
  },

  {
    connection: redis,
  },
);

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});

worker.on('error', (err) => {
  console.error('Worker error:', err);
});
