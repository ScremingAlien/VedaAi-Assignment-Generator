import type { CreateAssessmentDTOType } from '../dto/create-assessment.dto.js';
import type { AssessmentModel } from '../model/assessment.model.js';

export class AssessmentRepository {
  constructor(private readonly model: typeof AssessmentModel) {}

  async create(payload: CreateAssessmentDTOType) {
    return this.model.create(payload);
  }

  async update(id: string, payload: any) {
    return this.model.findByIdAndUpdate(id, payload, {
      new: true,
    });
  }

  async findById(id: string) {
    return this.model.findById(id).populate('assignmentId');
  }
  async findLatestByAssignmentId(assignmentId: string) {
    return this.model
      .findOne({
        assignmentId,
      })
      .sort({
        createdAt: -1,
      })
      .select('assignmentId version');
  }
  async findByAssignmentId(assignmentId: string) {
    return this.model
      .findOne({
        assignmentId,
      })
      .populate('assignmentId');
  }

  async findAll(page = 1, limit = 10) {
    return this.model
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({
        createdAt: -1,
      });
  }

  async deleteByAssignmentId(id: string) {
    return this.model.deleteOne({
      assignmentId: id,
    });
  }
}
