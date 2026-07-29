import { Router } from 'express';

import type { AssessmentController } from '../controller/assessment.controller.js';

interface RouteDeps {
  assessmentController: AssessmentController;
}

export default function createAssessmentRoutes({ assessmentController }: RouteDeps) {
  const router = Router();

  router.get('/', assessmentController.getAll);

  router.get('/:id', assessmentController.getById);
  router.delete('/:id', assessmentController.delete);
  router.get('/assignment/:assignmentId', assessmentController.getByAssignmentId);
  return router;
}
