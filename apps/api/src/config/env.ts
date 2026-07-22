import { z } from 'zod';

const envSchema = z.object({
  // App
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3001),
  FRONTEND_URL: z.url().default('http://localhost:5173'),

  // Database
  DATABASE_URL: z.url(),

  // Redis
  REDIS_URL: z.url(),

  // JWT
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  // Google OAuth (optional)
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CALLBACK_URL: z.string().optional(),

  // Judge0
  JUDGE0_API_URL: z.url().optional(),
  JUDGE0_API_KEY: z.string().optional(),

  // Anthropic
  ANTHROPIC_API_KEY: z.string().startsWith('sk-ant-').optional(),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): Env {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    const formatted = z.treeifyError(result.error);
    console.error('❌ Invalid environment variables:\n', JSON.stringify(formatted, null, 2));
    process.exit(1);
  }

  return result.data;
}
