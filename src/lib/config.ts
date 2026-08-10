// Validate required environment variables
const requiredEnvVars = [
  "DATABASE_URL",
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL",
] as const;

for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const APP_URL = process.env.APP_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";
export const DATABASE_URL = process.env.DATABASE_URL!;
export const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET!;
export const NEXTAUTH_URL = process.env.NEXTAUTH_URL!;

// Optional services
export const REDIS_URL = process.env.REDIS_URL ?? "redis://localhost:6379";
export const MEILISEARCH_HOST = process.env.MEILISEARCH_HOST ?? "http://localhost:7700";
export const MEILISEARCH_MASTER_KEY = process.env.MEILISEARCH_MASTER_KEY ?? "";

// Payment providers
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY ?? "";
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? "";
export const CMI_CLIENT_ID = process.env.CMI_CLIENT_ID ?? "";
export const CMI_STORE_KEY = process.env.CMI_STORE_KEY ?? "";

// Cloudinary
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME ?? "";
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY ?? "";
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET ?? "";

// Feature flags
export const FEATURES = {
  STRIPE_ENABLED: Boolean(STRIPE_SECRET_KEY),
  CMI_ENABLED: Boolean(CMI_CLIENT_ID && CMI_STORE_KEY),
  CLOUDINARY_ENABLED: Boolean(CLOUDINARY_CLOUD_NAME),
  MEILISEARCH_ENABLED: Boolean(MEILISEARCH_MASTER_KEY),
} as const;
