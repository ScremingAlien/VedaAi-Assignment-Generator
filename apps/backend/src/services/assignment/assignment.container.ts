import { AssessmentModel } from '../assessment/model/assessment.model.js';
import { AssessmentRepository } from '../assessment/repository/assessment.repository.js';
import { AssignmentController } from './controller/assignment.controller.js';
import { AssignmentModel } from './model/assignment.model.js';
import { AssignmentRepository } from './repository/assignment.repository.js';
import createAssignmentRoutes from './routes/assignment.routes.js';
import { AssignmentService } from './service/assignment.service.js';

export class AssignmentContainer {
  static init() {
    const repositories = {
      assignmentRepository: new AssignmentRepository(AssignmentModel),
      assessmentRepository: new AssessmentRepository(AssessmentModel),
    };

    const services = {
      assignmentService: new AssignmentService({
        assignmentRepository: repositories.assignmentRepository,
        assesmentRepository: repositories.assessmentRepository,
      }),
    };

    const controllers = {
      assignmentController: new AssignmentController({
        assignmentService: services.assignmentService,
      }),
    };

    const routes = {
      assignmentRoutes: createAssignmentRoutes({
        assignmentController: controllers.assignmentController,
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
