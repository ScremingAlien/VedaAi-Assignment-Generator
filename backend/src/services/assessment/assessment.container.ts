import { AssessmentController } from './controller/assessment.controller.js';
import { AssessmentModel } from './model/assessment.model.js';
import { AssessmentRepository } from './repository/assessment.repository.js';
import createAssessmentRoutes from './routes/assessment.routes.js';
import { AssessmentService } from './service/assessment.service.js';

export class AssessmentContainer {
  static init() {
    const repositories = {
      assessmentRepository: new AssessmentRepository(AssessmentModel),
    };

    const services = {
      assessmentService: new AssessmentService({
        assessmentRepository: repositories.assessmentRepository,
      }),
    };

    const controllers = {
      assessmentController: new AssessmentController({
        assessmentService: services.assessmentService,
      }),
    };

    const routes = {
      assessmentRoutes: createAssessmentRoutes({
        assessmentController: controllers.assessmentController,
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
