import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import predictRoutes from "./services/mentalhealth-api/routes/predictRoutes.js";
import errorHandler from "./middileware/globalErrorHandler.js";
import logger from "./utils/logger.js";
import questionRoutes from "./services/mentalhealth-api/routes/questionRoutes.js"
import mongodbConnect from "./config/Database-Connection.js";
import signupRoutes from "./services/auth/routes/signUpRoutes.js";
import loginRoutes from "./services/auth/routes/loginRoutes.js"
import forgetPasswordRoutes from "./services/auth/routes/forgotPassword.route.js";
const app = express();
dotenv.config();




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
app.use("/api/mentalhealth/login",loginRoutes);
app.use("/api/mentalhealth/signup",signupRoutes);
app.use("/api/mentalhealth/predict", predictRoutes);
app.use("/api/mentalhealth/question",questionRoutes);
app.use("/api/mentalhealth/forget-password",forgetPasswordRoutes);

app.use(errorHandler);

export { app };