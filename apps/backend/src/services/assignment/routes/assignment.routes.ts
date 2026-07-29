import { Router } from 'express';

import { pdfUpload } from '../../../middlewares/pdfUpload.middleware.js';
import type { AssignmentController } from '../controller/assignment.controller.js';

interface RouteDeps {
  assignmentController: AssignmentController;
}

export default function createAssignmentRoutes({ assignmentController }: RouteDeps) {
  const router = Router();

  /*  
   router.post("/", assignmentController.createAssignmentHandler);
 
   router.get("/", assignmentController.getAllAssignments);
 
   router.get("/:id", assignmentController.getAssignmentById);
 
   router.get("/:id/status", assignmentController.getStatus);
 
   // router.post("/:id/generate", assignmentController);
   router.post("/:id/retry", assignmentController.retryGeneration);
   router.patch(
     "/:id",
     assignmentController.updateAssignment
   );

  */

  ///
  router.post('/draft', assignmentController.createDraft);

  router.patch('/:id/basic-details', assignmentController.updateBasicDetails);

  router.patch('/:id/configuration', assignmentController.updateConfiguration);

  router.post('/:id/upload-pdf', pdfUpload.single('pdf'), assignmentController.uploadPdf);

  router.post('/:id/submit', assignmentController.submitAssignment);

  router.post('/:id/retry', assignmentController.retryGeneration);

  router.get('/:id/status', assignmentController.getStatus);

  router.get('/:id', assignmentController.getAssignmentById);

  router.get('/', assignmentController.getAllAssignments);

  router.delete('/:id', assignmentController.deleteAssignment);

  return router;
}
