import dotenv from 'dotenv';
import { z } from 'zod';
import logger from '../utils/logger.js';

dotenv.config();

// Schema for environment variables
const envSchema = z.object({
  PORT: z.string().optional().default('8000'),
  mongodbURI: z.string().optional(), // preferred key in this project
  MONGODB_URI: z.string().optional(), // fallback for common naming
  SKIP_DB: z.enum(['true','false']).optional().default('false'),
  OPENROUTER_API_KEY: z.string().optional(),
  OPENROUTER_MODEL: z.string().optional().default('deepseek/deepseek-r1-0528:free'),
  CORS_ORIGIN: z.string().optional(),
  NODE_ENV: z.string().optional().default('development'),
  DB_MAX_RETRIES: z.string().optional().default('5'),
  DB_RETRY_DELAY_MS: z.string().optional().default('3000'),
  DB_EXIT_ON_FAIL: z.enum(['true','false']).optional().default('true'),
  EMAIL_USER: z.string().optional(),
  EMAIL_PASS: z.string().optional(),
  JWT_SECRET: z.string().optional()
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  logger.error('Environment validation failed');
  parsed.error.issues.forEach(i => logger.error(`${i.path.join('.')}: ${i.message}`));
  if (process.env.NODE_ENV === 'production') process.exit(1);
}

const rawEnv = parsed.success ? parsed.data : process.env;
const env = {
  ...rawEnv,
  mongodbURI: rawEnv.mongodbURI || rawEnv.MONGODB_URI
};

// Enforce mongodbURI only in production if DB not skipped
if (env.NODE_ENV === 'production') {
  if (!env.mongodbURI && env.SKIP_DB !== 'true') {
    logger.error('mongodbURI is required in production unless SKIP_DB=true');
    process.exit(1);
  }
  if (!env.JWT_SECRET) {
    logger.error('JWT_SECRET is required in production');
    process.exit(1);
  }
  // Email credentials only required if email feature enabled (heuristic: EMAIL_USER set but missing pass OR pass set but missing user)
  if ((env.EMAIL_USER && !env.EMAIL_PASS) || (env.EMAIL_PASS && !env.EMAIL_USER)) {
    logger.error('Both EMAIL_USER and EMAIL_PASS must be set together for email sending in production');
    process.exit(1);
  }
  if (!env.EMAIL_USER || !env.EMAIL_PASS) {
    logger.warn('Email credentials not fully provided; email features may fail');
  }
}

export default env;
