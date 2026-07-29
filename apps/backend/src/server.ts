import { createServer } from 'http';

import { createApp } from './app.js';
import { bootstrapApp } from './bootstrap/index.js';
import ShutdownManager from './bootstrap/shutdown.js';
import { config } from './core/config/index.js';
import { logger } from './infra/logger/index.js';
import { initSocket } from './infra/socketio/socket.js';

async function startServer() {
  try {
    await bootstrapApp();

    const app = createApp();
    const server = createServer(app);
    await initSocket(server);

    server.listen(config.port, () => {
      logger.info(`Server running on  http://localhost:${String(config.port)}`);
    });

    // Handling gracefull shutdown, of server
    const shutdownManager = new ShutdownManager(logger);
    shutdownManager.init(server);
  } catch (err: unknown) {
    logger.error(err as string, 'Startup failed');
    console.error(err, 'Startup failed');
    process.exit(1);
  }
}

await startServer();
