import type { CreateAssignmentDTO } from '../dto/create-assignment.dto.js';
import type { AssignmentModel } from '../model/assignment.model.js';

export class AssignmentRepository {
  constructor(private readonly model: typeof AssignmentModel) {}

  async create(payload: CreateAssignmentDTO) {
    return this.model.create({
      ...payload,
      generationStatus: payload.generationStatus ?? 'PENDING',
    });
  }

  async findById(id: string) {
    return this.model.findById(id);
  }

  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.model.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      this.model.countDocuments(),
    ]);

    return {
      items,
      total,
      page,
      limit,
      hasMore: skip + items.length < total,
    };
  }

  async updateStatus(
    id: string,
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED',

    errorMessage?: string,
  ) {
    return this.model.findByIdAndUpdate(
      id,
      {
        status,
        errorMessage,
      },
      {
        new: true,
      },
    );
  }
  async delete(id: string) {
    return this.model.findByIdAndDelete(id);
  }

  async update(id: string, payload: any) {
    return this.model.findByIdAndUpdate(id, payload, {
      new: true,
    });
  }
  async updateGenerationProgress(id: string, progress: number, currentStep: string) {
    return this.model.findByIdAndUpdate(
      id,
      {
        progress,
        currentStep,
      },
      {
        new: true,
      },
    );
  }

  async findRecoverableAssignments() {
    return this.model.find({
      $or: [
        {
          generationStatus: 'PENDING',
        },
        {
          generationStatus: 'PROCESSING',

          updatedAt: {
            $lt: new Date(Date.now() - 10 * 60 * 1000),
          },
        },
      ],

      generationAttempts: {
        $lt: 5,
      },
    });
  }

  async updateGenerationMeta(
    id: string,
    payload: {
      currentAttempt?: number;
      retrying?: boolean;
      currentStep?: string;
    },
  ) {
    return this.model.findByIdAndUpdate(id, payload, { new: true });
  }

  async incrementGenerationAttempts(id: string) {
    return this.model.findByIdAndUpdate(
      id,
      {
        $inc: {
          generationAttempts: 1,
        },
      },
      {
        new: true,
      },
    );
  }
  async updateGenerationStatus(
    id: string,
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED',
    errorMessage?: string,
  ) {
    return this.model.findByIdAndUpdate(
      id,
      {
        generationStatus: status,
        errorMessage,
      },
      {
        new: true,
      },
    );
  }
}
