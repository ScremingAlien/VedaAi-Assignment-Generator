import { UploadController } from './controller/upload.controller.js';
import { UploadRepository } from './repository/upload.repository.js';
import createUploadRoutes from './routes/upload.routes.js';
import { UploadService } from './service/upload.service.js';

export class UploadContainer {
  static init() {
    const repositories = {
      uploadRepository: new UploadRepository(),
    };

    const services = {
      uploadService: new UploadService({
        uploadRepository: repositories.uploadRepository,
      }),
    };

    const controllers = {
      uploadController: new UploadController({
        uploadService: services.uploadService,
      }),
    };

    const routes = {
      uploadRoutes: createUploadRoutes({
        uploadController: controllers.uploadController,
      }),
    };

    return {
      repositories,
      services,
      controllers,
      routes,
    };
  }
}
