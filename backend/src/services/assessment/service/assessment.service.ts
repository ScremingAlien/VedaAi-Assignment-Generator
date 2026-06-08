import { AppError } from '../../../core/errors/AppError.js';
import type { AssessmentRepository } from '../repository/assessment.repository.js';

interface AssessmentServiceDeps {
  assessmentRepository: AssessmentRepository;
}

export class AssessmentService {
  private repo: AssessmentRepository;

  constructor({ assessmentRepository }: AssessmentServiceDeps) {
    this.repo = assessmentRepository;
  }

  async getAll() {
    return this.repo.findAll();
  }

  async getById(id: string) {
    const assessment = await this.repo.findById(id);

    if (!assessment) {
      throw new AppError('Assessment not found', 404);
    }

    return assessment;
  }

  async getByAssignmentId(assignmentId: string) {
    const assessment = await this.repo.findByAssignmentId(assignmentId);

    if (!assessment) {
      throw new AppError('Assessment not found', 404);
    }

    return assessment;
  }

  async delete(id: string) {
    const assessment = await this.repo.deleteByAssignmentId(id);

    if (!assessment) {
      throw new AppError('Assessment not found', 404);
    }

    return assessment;
  }
}
