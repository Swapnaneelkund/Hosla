import dotenv from 'dotenv';
import { z } from 'zod';
import logger from '../utils/logger.js';

dotenv.config();

// Schema for environment variables
const envSchema = z.object({
  PORT: z.string().optional().default('8000'),
  mongodbURI: z.string().optional(), // required only in production unless SKIP_DB=true
  SKIP_DB: z.enum(['true','false']).optional().default('false'),
  OPENROUTER_API_KEY: z.string().optional(),
  OPENROUTER_MODEL: z.string().optional().default('deepseek/deepseek-r1-0528:free'),
  CORS_ORIGIN: z.string().optional(),
  NODE_ENV: z.string().optional().default('development')
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  logger.error('Environment validation failed');
  parsed.error.issues.forEach(i => logger.error(`${i.path.join('.')}: ${i.message}`));
  if (process.env.NODE_ENV === 'production') process.exit(1);
}

const env = parsed.success ? parsed.data : process.env;

// Enforce mongodbURI only in production if DB not skipped
if (!env.mongodbURI && env.SKIP_DB !== 'true' && env.NODE_ENV === 'production') {
  logger.error('mongodbURI is required in production unless SKIP_DB=true');
  process.exit(1);
}

export default env;
