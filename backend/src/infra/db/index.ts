import { logger } from '../logger/index.js';
import { createMongooseDB } from './transports/mongoose.db.js';

export const databases = {
  mongo: createMongooseDB({
    logger,
    uri: process.env.MONGODB_URI as string, // adjust based on your config
    dbName: 'ai-assistant',
  }),
};

export type Databases = typeof databases;

export default databases;
