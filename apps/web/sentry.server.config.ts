import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV ?? "development",
  enabled: process.env.NODE_ENV === "production",

  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 0,

  beforeSend(event) {
    // Strip database connection strings from error messages
    if (event.exception?.values) {
      for (const ex of event.exception.values) {
        if (ex.value) {
          ex.value = ex.value.replace(/postgresql:\/\/[^@]+@[^\s"]+/gi, "postgresql://[redacted]");
        }
      }
    }
    return event;
  }
});
