import { Router } from 'express';

import { pdfUpload } from '../../../middlewares/pdfUpload.middleware.js';
import type { UploadController } from '../controller/upload.controller.js';

interface RouteDeps {
  uploadController: UploadController;
}

export default function createUploadRoutes({ uploadController }: RouteDeps) {
  const router = Router();

  router.post('/pdf', pdfUpload.single('pdf'), uploadController.uploadPdf);
  return router;
}
