import type { Request, Response } from 'express';

import { asyncHandler } from '../../../middlewares/system/asyncHandler.js';
import type { UploadService } from '../service/upload.service.js';

interface UploadControllerDeps {
  uploadService: UploadService;
}

export class UploadController {
  private service: UploadService;

  constructor({ uploadService }: UploadControllerDeps) {
    this.service = uploadService;
  }

  uploadPdf = asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      throw new Error('PDF file is required');
    }

    const data = await this.service.uploadPdf(req.file);

    res.success({
      data,
      message: 'PDF uploaded successfully',
    });
  });
}
