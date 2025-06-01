import mongoose from "mongoose";
import logger from "../utils/logger.js";  

const mongodbConnect = async () => {
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

export default mongodbConnect;
