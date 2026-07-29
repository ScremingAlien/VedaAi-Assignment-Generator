import envManager from '../env/env.js';
import { loggerConfig } from './logger.config.js';

const env = envManager.get();

export const config = {
  nodeEnv: env.NODE_ENV,
  port: env.PORT,

  Max_Listners: 20,

  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
  },

  rateLimit: {
    windowMs: 900000, // 15 minutes
    maxRequests: 1000,
  },

  cookie: {
    httpOnly: true,
    secure: envManager.isProduction(),
    maxAge: 24 * 60 * 60 * 1000,
  },
  logger: loggerConfig,
} as const;

export type Config = typeof config;
