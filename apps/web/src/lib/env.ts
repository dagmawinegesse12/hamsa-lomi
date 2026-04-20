import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const optionalUrl = z.string().url().optional();
const optionalSecret = z.string().min(1).optional();

export const env = createEnv({
  skipValidation: process.env.SKIP_ENV_VALIDATION === "true",
  server: {
    DATABASE_URL: z.string().url(),
    DIRECT_URL: z.string().url(),
    AUTH_SECRET: z.string().min(32),
    NEXTAUTH_URL: optionalUrl,
    RESEND_API_KEY: optionalSecret,
    TWILIO_ACCOUNT_SID: optionalSecret,
    TWILIO_AUTH_TOKEN: optionalSecret,
    TWILIO_PHONE_NUMBER: optionalSecret,
    VAPID_PUBLIC_KEY: optionalSecret,
    VAPID_PRIVATE_KEY: optionalSecret,
    SENTRY_DSN: optionalUrl,
    SUPABASE_SERVICE_ROLE_KEY: optionalSecret,
    S3_BUCKET_NAME: optionalSecret,
    S3_REGION: optionalSecret,
    S3_ACCESS_KEY_ID: optionalSecret,
    S3_SECRET_ACCESS_KEY: optionalSecret,
    INNGEST_EVENT_KEY: optionalSecret,
    INNGEST_SIGNING_KEY: optionalSecret
  },
  client: {
    NEXT_PUBLIC_SENTRY_DSN: optionalUrl,
    NEXT_PUBLIC_SUPABASE_URL: optionalUrl,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: optionalSecret
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: process.env.DIRECT_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
    VAPID_PUBLIC_KEY: process.env.VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY: process.env.VAPID_PRIVATE_KEY,
    SENTRY_DSN: process.env.SENTRY_DSN,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
    S3_REGION: process.env.S3_REGION,
    S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
    S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
    INNGEST_EVENT_KEY: process.env.INNGEST_EVENT_KEY,
    INNGEST_SIGNING_KEY: process.env.INNGEST_SIGNING_KEY
  }
});
