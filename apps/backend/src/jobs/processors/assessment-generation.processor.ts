import type { Job } from 'bullmq';

import {
  generateAssessment,
  GenerateAssessmentInput,
} from '../../infra/ai/assessment-generator.js';
import type { SocketService } from '../../infra/socketio/socket.service.js';
import type { AssessmentRepository } from '../../services/assessment/repository/assessment.repository.js';
import type { AssignmentRepository } from '../../services/assignment/repository/assignment.repository.js';
import {
  AssessmentGenerationError,
  classifyGenerationError,
} from '../../utils/error-handling/classifyGenerationError.js';

interface Dependencies {
  assignmentRepository: AssignmentRepository;
  assessmentRepository: AssessmentRepository;
  socketService: SocketService;
}

export class AssessmentGenerationProcessor {
  constructor(private readonly deps: Dependencies) {}

  async process(assignmentId: string, job: Job) {
    /**
     * Update assignment status initally
     */
    const currentAttempt = job.attemptsMade + 1;
    const maxAttempts = job.opts.attempts ?? 1;

    await this.deps.assignmentRepository.update(assignmentId, {
      currentAttempt,
      maxAttempts,
      retrying: false,
    });

    try {
      await this.updateProgress(assignmentId, job, 10, 'Loading Assignment');

      /**
       * Find assignment and check if it exists or not,
       * - if not, throw error
       */
      const assignment = await this.deps.assignmentRepository.findById(assignmentId);
      if (!assignment) {
        throw new Error('Assignment not found');
      }

      /**
       * Update assignment status to PROCESSING
       */
      await this.updateProgress(assignmentId, job, 20, 'Updating Status');
      await this.deps.assignmentRepository.update(assignmentId, {
        generationStatus: 'PROCESSING',
        lastGenerationStartedAt: new Date(),
      });
      this.deps.socketService.emitStatus(assignmentId, 'PROCESSING');

      /**
       * Updating progress after the StatusUpdation
       */
      await this.updateProgress(assignmentId, job, 30, 'Generating Questions');

      /**
       * Main Assessment Generation step
       * - LLM will generate the assessment
       */
      const assessment = await this.generateAssessmentSafely({
        title: assignment.title,
        className: assignment.className ?? '',
        subject: assignment.subject ?? '',
        timeAllowedMinutes: assignment.timeAllowedMinutes ?? 0,
        additionalInstructions: assignment.additionalInstructions ?? '',
        sourceContent: assignment.sourceContent ?? '',
        questionRequirements: assignment.questionRequirements,
      });

      /**
       * Update progress after assessment generation
       */
      await this.updateProgress(assignmentId, job, 80, 'Saving Assessment');
      const totalMarks = assessment.sections.reduce(
        (sectionTotal, section) =>
          sectionTotal + section.questions.reduce((questionTotal, q) => questionTotal + q.marks, 0),
        0,
      );

      /**
       * Save assessment with no conflict in versions
       */
      const latest = await this.deps.assessmentRepository.findLatestByAssignmentId(assignmentId);
      const version = latest ? latest.version + 1 : 1;
      const savedAssessment = await this.deps.assessmentRepository.create({
        assignmentId,
        title: assessment.title,
        totalMarks,
        version: version,
        sections: assessment.sections.map((sec) => ({
          ...sec,
          totalMarks: sec.questions.reduce((acc, q) => acc + q.marks, 0),
        })),
      });

      /**
       * Update progress after saving assessment
       */
      await this.deps.assignmentRepository.update(assignmentId, {
        generationStatus: 'COMPLETED',
        retrying: false,
        progress: 100,
        currentStep: 'Completed',
      });
      await this.updateProgress(assignmentId, job, 100, 'Completed');

      /**
       * Emit assessment:completed
       */
      this.deps.socketService.emitCompleted(assignmentId, savedAssessment._id.toString());
      return savedAssessment;
    } catch (error) {
      console.error('===============', error);
      /**
       * Error handling
       */
      const failure = classifyGenerationError(error);
      /**
       * Machenism to retry failed jobs.
       */
      const message = error instanceof Error ? error.message : 'Unknown Error';
      const currentAttempt = job.attemptsMade + 1;
      const maxAttempts = job.opts.attempts ?? 1;
      const hasRetryLeft = currentAttempt < maxAttempts;
      if (failure.retryable && hasRetryLeft) {
        /**
         * Update assignment status to RETRYING
         */
        await this.deps.assignmentRepository.update(assignmentId, {
          retrying: true,
          currentAttempt,
          maxAttempts,
          currentStep: `Retrying (${currentAttempt}/${maxAttempts})`,
          errorMessage: message,
        });
        this.deps.socketService.emitProgress(assignmentId, {
          percent: 0,
          step: `Retrying (${currentAttempt}/${maxAttempts})`,
        });

        throw error;
      }

      /**
       * Update assignment status to FAILED
       */
      await this.deps.assignmentRepository.update(assignmentId, {
        generationStatus: 'FAILED',
        retrying: false,
        errorMessage: message,
        currentStep: 'Failed',
      });

      this.deps.socketService.emitFailed(assignmentId, message);

      throw error;
    }
  }

  private async updateProgress(assignmentId: string, job: Job, progress: number, step: string) {
    await Promise.all([
      job.updateProgress({
        progress,
        step,
      }),

      this.deps.assignmentRepository.updateGenerationProgress(assignmentId, progress, step),
    ]);

    this.deps.socketService.emitProgress(assignmentId, {
      percent: progress,
      step,
    });
  }

  async generateAssessmentSafely(payload: GenerateAssessmentInput) {
    try {
      return await generateAssessment(payload);
    } catch (error) {
      console.error('===============', error);
      const classified = classifyGenerationError(error);

      throw new AssessmentGenerationError(classified.type, classified.retryable, error);
    }
  }
}
