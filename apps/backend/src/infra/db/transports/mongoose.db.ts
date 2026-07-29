import mongoose, { type Mongoose } from 'mongoose';

import type { Logger } from '../../logger/logger.interface.js';
import { DatabaseInterface } from '../database.interface.js';

type MongooseConfig = {
  logger: Logger;
  uri: string;
  dbName: string;
};

class MongooseDatabase extends DatabaseInterface<Mongoose> {
  #connection: Mongoose | null = null;

  private logger: Logger;
  private uri: string;
  private dbName: string;

  constructor({ logger, uri, dbName }: MongooseConfig) {
    super();
    this.logger = logger;
    this.uri = uri;
    this.dbName = dbName;
  }

  async connect(): Promise<Mongoose> {
    try {
      if (this.#connection) {
        this.logger.info(`[Mongo:${this.dbName}] already connected`);
        return this.#connection;
      }

      this.#connection = await mongoose.connect(this.uri, {
        dbName: this.dbName,
      });

      this.logger.info(`✅ [Mongo:${this.dbName}] connected`);
      return this.#connection;
    } catch (error) {
      this.logger.error(`[Mongo:${this.dbName}] connection failed`, error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.#connection) {
      await mongoose.disconnect();
      this.#connection = null;
      this.logger.info(`[Mongo:${this.dbName}] disconnected`);
    }
  }

  getConnection(): Mongoose {
    if (!this.#connection) {
      throw new Error(`[Mongo:${this.dbName}] not connected`);
    }
    return this.#connection;
  }

  isConnected(): boolean {
    return !!this.#connection;
  }
}

/**
 * Creates an instance of MongooseDatabase.
 *
 *
 * @export
 * @param {MongooseConfig} config - {@link MongooseConfig} is configuration object for the MongooseDatabase.
 * @returns {MongooseDatabase}
 */
export function createMongooseDB(config: MongooseConfig): MongooseDatabase {
  return new MongooseDatabase(config);
}
