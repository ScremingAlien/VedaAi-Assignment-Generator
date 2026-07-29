import type { Request, Response } from 'express';

import { AppError } from '../../../core/errors/AppError.js';
import { asyncHandler } from '../../../middlewares/system/asyncHandler.js';
import type { AssignmentService } from '../service/assignment.service.js';

interface AssignmentControllerDeps {
  assignmentService: AssignmentService;
}
enum GenerationStatus {
  DRAFT,
  PENDING,
  PROCESSING,
  COMPLETED,
  FAILED,
}
export class AssignmentController {
  private service: AssignmentService;

  constructor({ assignmentService }: AssignmentControllerDeps) {
    this.service = assignmentService;
  }

  // imp route for creating assignment
  createAssignmentHandler = asyncHandler(async (req: Request, res: Response) => {
    const assignment = await this.service.createAssignment(req.body);

    res.success({
      data: {
        assignmentId: assignment._id,

        status: assignment.generationStatus,
      },

      message: 'Assignment created successfully',
    });
  });

  getAllAssignments = asyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);

    const data = await this.service.getAllAssignments(page, limit);

    res.success({
      data,
      message: 'Assignments fetched successfully',
    });
  });

  getAssignmentById = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getAssignmentById(req.params.id as string);

    res.success({
      data,
      message: 'Assignment fetched successfully',
    });
  });

  getStatus = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getStatus(req.params.id as string);

    res.success({
      data,
      message: 'Status fetched successfully',
    });
  });

  retryGeneration = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.retryGeneration(req.params.id as string);

    res.success({
      data,
      message: 'Generation restarted',
    });
  });

  updateAssignment = asyncHandler(async (req, res) => {
    const data = await this.service.updateAssignment(req.params.id as string, req.body);

    res.success({
      data,
      message: 'Assignment updated successfully',
    });
  });

  createDraft = asyncHandler(async (req, res) => {
    const data = await this.service.createDraft(req.body);

    res.success({
      data,
      message: 'Draft created',
    });
  });
  updateBasicDetails = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.updateBasicDetails(req.params.id as string, req.body);

    res.success({
      data,
      message: 'Basic details updated successfully',
    });
  });
  updateConfiguration = asyncHandler(async (req, res) => {
    const data = await this.service.updateConfiguration(req.params.id as string, req.body);

    res.success({
      data,
      message: 'Configuration updated',
    });
  });

  uploadPdf = asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new AppError('PDF required', 400);
    }

    const data = await this.service.uploadPdf(req.params.id as string, req.file);

    res.success({
      data,
      message: 'PDF uploaded successfully',
    });
  });
  submitAssignment = asyncHandler(async (req, res) => {
    const data = await this.service.submitAssignment(req.params.id as string);

    res.success({
      data,
      message: 'Generation started',
    });
  });

  deleteAssignment = asyncHandler(async (req, res) => {
    const data = await this.service.deleteAssignMentnAssesment(req.params.id as string);
    res.success({
      data,
      message: 'Assignment deleted',
    });
  });
}
