import type { Request, Response } from 'express';

import { asyncHandler } from '../../../middlewares/system/asyncHandler.js';
import type { AssessmentService } from '../service/assessment.service.js';

interface AssessmentControllerDeps {
  assessmentService: AssessmentService;
}

export class AssessmentController {
  private service: AssessmentService;

  constructor({ assessmentService }: AssessmentControllerDeps) {
    this.service = assessmentService;
  }

  getAll = asyncHandler(async (_req: Request, res: Response) => {
    const data = await this.service.getAll();

    res.success({
      data,
      message: 'Assessments fetched successfully',
    });
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getById(req.params.id as string);

    res.success({
      data,
      message: 'Assessment fetched successfully',
    });
  });

  getByAssignmentId = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getByAssignmentId(req.params.assignmentId as string);

    res.success({
      data,
      message: 'Assessment fetched successfully',
    });
  });

  delete = asyncHandler(async (req, res) => {
    const data = await this.service.delete(req.params.id as string);

    res.success({
      data,
      message: 'Assessment deleted',
    });
  });
}
