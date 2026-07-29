import 'express';

declare module 'express-serve-static-core' {
  interface Response {
    success: (options?: {
      message?: string;
      data?: unknown;
      meta?: unknown;
      statusCode?: number;
    }) => void;
  }
}

import 'express';

declare global {
  namespace Express {
    namespace Multer {
      interface File {
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        size: number;
        destination: string;
        filename: string;
        path: string;
      }
    }

    interface Request {
      file?: Multer.File;
      files?: Multer.File[];
    }
  }
}

export {};
