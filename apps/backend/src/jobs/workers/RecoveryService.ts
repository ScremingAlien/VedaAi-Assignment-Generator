import { AssignmentRepository } from '../../services/assignment/repository/assignment.repository.js';
import { generationQueue } from '../queues/generation.queue.js';

export class AssessmentRecoveryService {
  constructor(private readonly assignmentRepository: AssignmentRepository) {}

  async recover() {
    const assignments = await this.assignmentRepository.findRecoverableAssignments();

    for (const assignment of assignments) {
      const job = await generationQueue.getJob(assignment._id.toString());

      if (job) {
        continue;
      }

      console.log(`[Recovery] Requeueing assignment ${assignment._id}`);

      await generationQueue.add(
        'assessment-generation',
        {
          assignmentId: assignment._id.toString(),
        },
        {
          jobId: assignment._id.toString(),
        },
      );
    }
  }
}
