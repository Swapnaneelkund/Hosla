import mongoose from "mongoose";
import logger from "../utils/logger.js";  

const mongodbConnect = async () => {
  if (process.env.SKIP_DB === 'true') {
    logger.info('Skipping MongoDB connection (SKIP_DB=true)');
    return;
  }
  try {
    await mongoose.connect(process.env.mongodbURI);
    logger.info("MongoDB connected successfully");
  } catch (error) {
    logger.error(`MongoDB connection failed: ${error.message}`, { stack: error.stack });
    
    setTimeout(() => {
      process.exit(1);
    }, 100);
  }
};

export const disconnectDb = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
};

export default mongodbConnect;
