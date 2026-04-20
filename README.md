# Hamsa Lomi Edir Platform

A production-oriented Turborepo scaffold for Hamsa Lomi Ethiopian Association, combining a public community website with an Edir mutual aid operations platform. The app includes member and admin portals, Prisma/PostgreSQL data modeling, typed REST APIs, RBAC, audit logging, notification delivery architecture, background jobs, tests, CI, and operational documentation.

## Architecture

- `apps/web`: Next.js 14 App Router application with member/admin portals and API routes.
- `apps/jobs`: background job definitions for monthly dues and notification dispatch.
- `packages/db`: Prisma schema and seed data.
- `packages/config`: shared TypeScript, ESLint, and Tailwind presets.
- `packages/types`: shared domain types.

The API uses a consistent envelope:

```json
{ "success": true, "data": {} }
```

Errors use:

```json
{ "success": false, "error": { "code": "ERROR_CODE", "message": "Readable message" } }
```

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Copy environment variables:

```bash
cp apps/web/.env.example apps/web/.env.local
```

3. Start PostgreSQL and run Prisma:

```bash
pnpm --filter @edir/db prisma:generate
pnpm --filter @edir/db prisma:migrate -- --name init
pnpm --filter @edir/db prisma:seed
```

The supplemental database checks in `packages/db/prisma/constraints.sql` should be folded into the generated initial migration or applied after the first migration has created the tables.

4. Start development:

```bash
pnpm dev
```

## Environment

Required variables are declared in `apps/web/src/lib/env.ts` with `@t3-oss/env-nextjs`.

- `DATABASE_URL`, `DIRECT_URL`
- `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- `RESEND_API_KEY`
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`
- `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`
- `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`
- `S3_BUCKET_NAME`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`
- `INNGEST_EVENT_KEY`, `INNGEST_SIGNING_KEY`

## Quality Gates

GitHub Actions runs type-checking, linting, tests, Prisma generation, and build on pull requests and `main`.

## OpenAPI

The baseline OpenAPI contract lives at `apps/web/openapi.yaml`.
