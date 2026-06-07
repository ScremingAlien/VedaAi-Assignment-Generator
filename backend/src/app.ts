import compression from 'compression';
import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';

import { requestIdMiddleware } from './middlewares/response-formater/requestId.middleware.js';
import { requestLogger } from './middlewares/response-formater/requestLogger.js';
import { responseFormatter } from './middlewares/response-formater/responseFormater.js';
import { globalErrorHandler } from './middlewares/system/errorHandler.js';
import assessmentContainer from './services/assessment/index.js';
import assignmentContainer from './services/assignment/index.js';
import uploadContainer from './services/upload/index.js';
import { NotFoundError } from './utils/error-handling/CustomError.js';
const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || [];

export function createApp() {
  const app: Express = express();

  app.use(helmet());
  app.use(
    cors({
      origin: (origin, callback) => {
        // allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
      },
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(compression());
  app.use(morgan('dev'));

  app.use(requestIdMiddleware);
  app.use(requestLogger);
  app.use(responseFormatter);
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
  
  // custom routes
  
  // Main Route Mapping
  app.get('/', (req, res) => res.status(200).send('Welcome to the main route of Assessment API'));
  app.use('/assessment', assessmentContainer.init().routes.assessmentRoutes);
  app.use('/assignment', assignmentContainer.init().routes.assignmentRoutes);
  app.use('/upload', uploadContainer.init().routes.uploadRoutes);

  app.use((req, res, next) => {
    next(NotFoundError(`Route ${req.originalUrl} not found`));
  });

  app.use(globalErrorHandler);

  return app;
}
