import path from 'path';
import { fileURLToPath } from 'url';

import dotenv from 'dotenv';

type Env = {
  NODE_ENV: string;
  PORT: number;
  SERVICE_NAME: string;
  LOG_LEVEL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  COOKIE: {
    httpOnly: boolean;
    secure: boolean;
    expiresIn: number;
  };
};

/**
 * Env Validator and checker class, which loads env file and validates it
 * @method get - Get full env config
 * @method isDevelopment - Check if env is development
 * @method isProduction - Check if env is production
 */
class EnvManager {
  #env!: Readonly<Env>;
  #loaded: boolean = false;

  constructor() {
    this.#loadEnv();
    this.#validate();
    this.#freeze();
  }

  /**
   * Load env file accroding to the NODE_ENV
   * @returns {boolean}
   */
  #loadEnv() {
    if (this.#loaded) return;

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const ENV_FILE = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';

    dotenv.config({
      path: path.resolve(__dirname, `../../../${ENV_FILE}`),
    });

    this.#loaded = true;
  }

  // Validate & normalize
  #validate() {
    const required = (name: string) => {
      const value = process.env[name];
      if (!value) {
        console.error(`Missing required env: ${name}`);
        process.exit(1);
      }
      return value;
    };

    this.#env = {
      NODE_ENV: required('NODE_ENV'),
      PORT: Number(required('PORT')),

      /**
       * Modfiy according to need
       */

      SERVICE_NAME: process.env.SERVICE_NAME ?? 'app',
      LOG_LEVEL: process.env.LOG_LEVEL ?? 'info',

      JWT_SECRET: process.env.JWT_SECRET ?? 'secretsomthing',
      JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '24h',

      COOKIE: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expiresIn: 24 * 60 * 60 * 1000,
      },
    };
  }

  // Prevent mutation
  #freeze() {
    Object.freeze(this.#env);
  }

  /**
   * Get full env config (ONLY PUBLIC METHOD)
   * @returns {Readonly<object>}
   */
  get() {
    return this.#env;
  }

  /**
   * Check if env is production or not
   * @returns {Boolean}
   */
  isProduction() {
    return this.#env.NODE_ENV === 'production';
  }
  /**
   * Check if env is development or not
   * @returns {Boolean}
   */
  isDevelopment() {
    return this.#env.NODE_ENV === 'development';
  }
}

// singleton instance
const envChecker = new EnvManager();
export default envChecker;
