import { app } from "./app.js";
import logger from "./utils/logger.js";
import env from './config/env.js';
import { disconnectDb } from './config/Database-Connection.js';

const PORT = env.PORT || 8000;

const server = app.listen(PORT, () => {
  logger.info(`server is running on port ${PORT}`);
});

const shutdown = async (signal) => {
  try {
    logger.info(`Received ${signal}. Shutting down gracefully...`);
    server.close(async () => {
      try {
        await disconnectDb();
        logger.info('Mongo connection closed');
      } catch (e) {
        logger.error('Error closing MongoDB', e);
      } finally {
        logger.info('Shutdown complete');
        process.exit(0);
      }
    });
    setTimeout(() => process.exit(1), 10000).unref();
  } catch (err) {
    logger.error('Error during shutdown', err);
    process.exit(1);
  }
};

['SIGTERM','SIGINT'].forEach(sig => process.on(sig, () => shutdown(sig)));
process.on('uncaughtException', (err) => { logger.error('Uncaught Exception', err); shutdown('uncaughtException'); });
process.on('unhandledRejection', (reason) => { logger.error('Unhandled Rejection', reason); shutdown('unhandledRejection'); });
