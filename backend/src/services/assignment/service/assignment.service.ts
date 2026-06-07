import { randomUUID } from 'crypto';
import { AppError } from '../../../core/errors/AppError.js';
import { generationQueue } from '../../../jobs/queues/generation.queue.js';
import type { AssessmentRepository } from '../../assessment/repository/assessment.repository.js';
import { UploadRepository } from '../../upload/repository/upload.repository.js';
import { UploadService } from '../../upload/service/upload.service.js';
import type { CreateAssignmentDTO } from '../dto/create-assignment.dto.js';
import type { AssignmentRepository } from '../repository/assignment.repository.js';

interface AssignmentServiceDeps {
  assignmentRepository: AssignmentRepository;
  assesmentRepository: AssessmentRepository;
}

export class AssignmentService {
  private repo: AssignmentRepository;
  private assesmentRepo: AssessmentRepository;

  constructor({ assignmentRepository, assesmentRepository }: AssignmentServiceDeps) {
    this.repo = assignmentRepository;
    this.assesmentRepo = assesmentRepository;
  }

  async createAssignment(payload: CreateAssignmentDTO) {
    const assignment = await this.repo.create(payload);
    await generationQueue.add(
      'assessment-generation',
      {
        assignmentId: assignment._id.toString(),
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

    return assignment;
  }

  async getAllAssignments(page: number, limit: number) {
    return this.repo.findAll(page, limit);
  }

  async getAssignmentById(id: string) {
    const assignment = await this.repo.findById(id);

    if (!assignment) {
      throw new AppError('Assignment not found', 404);
    }

    return assignment;
  }

  async getStatus(id: string) {
    const assignment = await this.repo.findById(id);

    if (!assignment) {
      throw new AppError('Assignment not found', 404);
    }

    return {
      id: assignment._id,

      generationStatus: assignment.generationStatus,

      errorMessage: assignment.errorMessage,
    };
  }
  async retryGeneration(id: string) {
    const assignment = await this.repo.findById(id);

    if (!assignment) {
      throw new AppError('Assignment not found', 404);
    }

    if (assignment.generationStatus !== 'FAILED') {
      throw new AppError('Only failed assessments can be retried', 400);
    }

    assignment.generationStatus = 'RETRYING';

    assignment.errorMessage = undefined;
    assignment.progress = 0;
    assignment.currentStep = 'Retry Queued';

    assignment.retrying = true;

    await assignment.save();

    await this.queueGeneration(id);

    return {
      success: true,
      message: 'Retry started',
    };
  }

  /* 
  async retryGeneration(id: string) {
    const assignment = await this.repo.findById(id);

    if (!assignment) {
      throw new AppError('Assignment not found', 404);
    }
    if (!assignment.questionRequirements?.length) {
      throw new AppError('Question requirements missing', 400);
    }
    assignment.generationStatus = 'PENDING';
    assignment.errorMessage = undefined;
    assignment.maxAttempts = 3;
    assignment.retrying = false;
    assignment.generationAttempts = 0;
    assignment.progress = 0;

    await assignment.save();

    await generationQueue.add(
      'assessment-generation',
      {
        assignmentId: String(assignment._id),
      },
      {
        jobId: randomUUID(),
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
        removeOnComplete: 100,
        removeOnFail: 50,
      },
    );

    return assignment;
  }
 */
  async submitAssignment(id: string) {
    const assignment = await this.repo.findById(id);

    if (!assignment) {
      throw new AppError('Assignment not found', 404);
    }

    if (!assignment.questionRequirements?.length) {
      throw new AppError('Question requirements missing', 400);
    }

    if (!assignment.sourceContent?.trim()) {
      throw new AppError('Source content missing', 400);
    }

    if (assignment.generationStatus === 'PROCESSING' || assignment.generationStatus === 'PENDING') {
      throw new AppError('Generation already in progress', 409);
    }

    assignment.generationStatus = 'PENDING';
    assignment.errorMessage = undefined;
    assignment.progress = 0;
    assignment.currentStep = 'Queued';

    assignment.generationAttempts = 0;
    assignment.maxAttempts = 3;
    assignment.retrying = false;

    await assignment.save();

    await this.queueGeneration(id);

    return {
      success: true,
      message: 'Assessment generation started',
    };
  }
  /*  async submitAssignment(id: string) {
    const assignment = await this.repo.findById(id);

    if (!assignment) {
      throw new AppError('Assignment not found', 404);
    }

    if (!assignment.questionRequirements?.length) {
      throw new AppError('Question requirements missing', 400);
    }
    assignment.generationStatus = 'PENDING';
    assignment.errorMessage = undefined;
    assignment.maxAttempts = 3;
    assignment.retrying = false;
    assignment.generationAttempts = 0;
    assignment.progress = 0;
    assignment.currentStep = '';

    await assignment.save();
    // await this.repo.updateGenerationStatus(id, 'PENDING');

    await generationQueue.add(
      'assessment-generation',
      { assignmentId: id },
      {
        jobId: randomUUID(),
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
        removeOnComplete: 100,
        removeOnFail: 50,
      },
    );

    return {
      message: 'Assessment generation started',
      assignment,
    };
  } */
  async generateAssessment(id: string) {
    const assignment = await this.repo.findById(id);

    if (!assignment) {
      throw new AppError('Assignment not found', 404);
    }

    await this.repo.updateGenerationStatus(id, 'PROCESSING');

    await generationQueue.add('assessment-generation', {
      assignmentId: id,
    });

    return {
      message: 'Generation started',
    };
  }

  async createDraft(payload: {
    title: string;
    className: string;
    subject: string;
    timeAllowedMinutes: number;
  }) {
    return this.repo.create({
      ...payload,
      generationStatus: 'DRAFT',
    });
  }
  async updateAssignment(id: string, payload: Partial<CreateAssignmentDTO>) {
    const assignment = await this.repo.update(id, payload);

    if (!assignment) {
      throw new AppError('Assignment not found', 404);
    }

    return assignment;
  }
  async updateBasicDetails(
    id: string,
    payload: {
      title?: string;
      className?: string;
      subject?: string;
      timeAllowedMinutes?: number;
    },
  ) {
    const assignment = await this.repo.update(id, payload);

    if (!assignment) {
      throw new AppError('Assignment not found', 404);
    }

    return assignment;
  }

  async updateConfiguration(
    id: string,
    payload: {
      sourceContent?: string;
      assignmentDate: Date;
      dueDate: Date;
      additionalInstructions?: string;
      questionRequirements: any[];
    },
  ) {
    const updateData: any = {
      assignmentDate: payload.assignmentDate,
      dueDate: payload.dueDate,
      additionalInstructions: payload.additionalInstructions,
      questionRequirements: payload.questionRequirements,
    };

    if (payload.sourceContent !== undefined && payload.sourceContent.trim() !== '') {
      updateData.sourceContent = payload.sourceContent;
    }

    const assignment = await this.repo.update(id, updateData);

    if (!assignment) {
      throw new AppError('Assignment not found', 404);
    }

    return assignment;
  }

  async uploadPdf(assignmentId: string, file: Express.Multer.File) {
    const assignment = await this.repo.findById(assignmentId);

    if (!assignment) {
      throw new AppError('Assignment not found', 404);
    }

    const uploadService = new UploadService({
      uploadRepository: new UploadRepository(),
    });

    const extracted = await uploadService.uploadPdf(file);

    if (!extracted.extractedText || extracted.extractedText.text.length === 0) {
      throw new AppError('No readable content found in PDF', 400);
    }

    let sourceContent = '';

    if (typeof extracted.extractedText.text === 'string') {
      sourceContent = extracted.extractedText.text;
    } else if (extracted.extractedText && Array.isArray(extracted.extractedText.pages)) {
      sourceContent = extracted.extractedText.pages
        .map((page) => page.text?.trim())
        .filter(Boolean)
        .join('\n\n');
    } else {
      throw new AppError('Unable to extract PDF content', 400);
    }

    if (!sourceContent) {
      throw new AppError('Unable to extract PDF content', 400);
    }
    let data = await this.repo.update(assignmentId, {
      uploadedPdf: {
        fileName: extracted.fileName,
        fileUrl: extracted.fileUrl,
        fileSize: extracted.fileSize,
      },
      sourceContent: sourceContent,
    });
    return data;
  }

  async deleteAssignMentnAssesment(id: string) {
    const result = await this.repo.delete(id);
    const result2 = await this.assesmentRepo.deleteByAssignmentId(id);

    return {
      message: 'Assignment deleted',
    };
  }

  private async queueGeneration(assignmentId: string, attempts = 3) {
    await generationQueue.add(
      'assessment-generation',
      {
        assignmentId,
      },
      {
        jobId: randomUUID(),
        attempts,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
        removeOnComplete: 100,
        removeOnFail: 50,
      },
    );
  }
}
