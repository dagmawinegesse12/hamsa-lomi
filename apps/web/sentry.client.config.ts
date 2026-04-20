import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV ?? "development",

  // Capture 10% of transactions for performance monitoring
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 0,

  // Don't send errors in development unless explicitly overridden
  enabled: process.env.NODE_ENV === "production",

  // Scrub PII from breadcrumbs and event bodies
  beforeSend(event) {
    if (event.request?.data) {
      const data = event.request.data as Record<string, unknown>;
      for (const key of ["password", "hashedPassword", "token", "secret", "apiKey"]) {
        if (key in data) data[key] = "[Filtered]";
      }
    }
    return event;
  },

  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true
    })
  ],

  // Capture 1% of sessions for session replay
  replaysSessionSampleRate: 0.01,
  replaysOnErrorSampleRate: 1.0
});
