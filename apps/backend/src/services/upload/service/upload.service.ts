import path from 'path';

import { extractPdfText } from '../../../utils/pdf-extractor.js';
import type { UploadRepository } from '../repository/upload.repository.js';

interface UploadServiceDeps {
  uploadRepository: UploadRepository;
}

export class UploadService {
  private repo: UploadRepository;

  constructor({ uploadRepository }: UploadServiceDeps) {
    this.repo = uploadRepository;
  }

  async uploadPdf(file: Express.Multer.File) {
    const extracted = await extractPdfText(file.path);

    return {
      fileName: file.originalname,

      storedFileName: path.basename(file.path),

      fileUrl: `/uploads/pdfs/${path.basename(file.path)}`,

      fileSize: file.size,

      extractedText: extracted.text,

      pages: extracted.pages,
    };
  }
}
