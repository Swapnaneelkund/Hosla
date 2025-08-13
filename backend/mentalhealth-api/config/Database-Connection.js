import mongoose from "mongoose";
import logger from "../utils/logger.js";  
import env from './env.js';

const mongodbConnect = async () => {
  if (env.SKIP_DB === 'true') {
    logger.info('Skipping MongoDB connection (SKIP_DB=true)');
    return;
  }
  const maxRetries = parseInt(env.DB_MAX_RETRIES, 10) || 5;
  const delayMs = parseInt(env.DB_RETRY_DELAY_MS, 10) || 3000;
  let attempt = 0;
  while (attempt <= maxRetries) {
    try {
      attempt++;
      await mongoose.connect(env.mongodbURI);
      logger.info("MongoDB connected successfully");
      return;
    } catch (error) {
      logger.error(`MongoDB connection attempt ${attempt} failed: ${error.message}`);
      if (attempt > maxRetries) {
        logger.error(`Exceeded max MongoDB retries (${maxRetries}).`);
        if (env.DB_EXIT_ON_FAIL === 'true') {
          logger.error('Exiting process due to DB connection failure.');
          process.exit(1);
        } else {
          logger.warn('Continuing without DB (DB_EXIT_ON_FAIL=false).');
          return;
        }
      }
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
};

export const disconnectDb = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
};

export default mongodbConnect;
