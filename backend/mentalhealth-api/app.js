import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import predictRoutes from "./routes/predictRoutes.js";
import errorHandler from "./middileware/globalErrorHandler.js";
import logger from "./utils/logger.js";
import question from "./routes/questionRoutes.js";
import mongodbConnect from "./config/Database-Connection.js";
import { ApiError } from "./utils/ApiError.js";
import emailRoutes from './routes/emailRoutes.js';

dotenv.config();
const app = express();
// Only connect to MongoDB if a URI is provided
if (process.env.mongodbURI) {
  mongodbConnect();
} else {
  logger.warn("No MongoDB URI found in .env. Skipping database connection.");
}

const allowedOrigin = process.env.CORS_ORIGIN || "http://127.0.0.1:5500";

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
    optionsSuccessStatus: 200, 
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
logger.info("App initializing...");
app.use("/api/mentalhealth", predictRoutes);
app.use("/api/mentalhealth/question",question);
app.use('/api/email', emailRoutes);

app.use(errorHandler);

export { app };