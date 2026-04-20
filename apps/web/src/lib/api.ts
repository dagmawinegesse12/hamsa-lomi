import { NextResponse, type NextRequest } from "next/server";
import { ZodError, type ZodSchema } from "zod";
import type { ApiEnvelope, Role } from "@edir/types";
import { auth } from "@/lib/auth";
import { AppError, AuthorizationError, ValidationError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { assertRole } from "@/lib/rbac";

type HandlerContext = {
  params?: Record<string, string>;
  user?: {
    id: string;
    role: Role;
  };
};

type ApiHandler<T> = (request: NextRequest, context: HandlerContext) => Promise<T>;

export function ok<T>(data: T, status = 200) {
  return NextResponse.json<ApiEnvelope<T>>({ success: true, data }, { status });
}

export async function parseJson<T>(request: NextRequest, schema: ZodSchema<T>) {
  try {
    return schema.parse(await request.json());
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ValidationError(error.issues.map((issue) => issue.message).join("; "));
    }
    throw error;
  }
}

export function apiHandler<T>(handler: ApiHandler<T>) {
  return async (request: NextRequest, context: HandlerContext = {}) => {
    const startedAt = performance.now();
    try {
      const data = await handler(request, context);
      logger.info({ method: request.method, path: request.nextUrl.pathname, durationMs: performance.now() - startedAt }, "api_request");
      return ok(data);
    } catch (error) {
      const appError = normalizeError(error);
      logger.error({ error: appError, path: request.nextUrl.pathname }, "api_error");
      return NextResponse.json<ApiEnvelope<never>>(
        { success: false, error: { code: appError.code, message: appError.message } },
        { status: appError.statusCode }
      );
    }
  };
}

export function withRole<T>(roles: readonly Role[], handler: ApiHandler<T>) {
  return apiHandler(async (request, context) => {
    const session = await auth();
    if (!session?.user?.id || !session.user.role) {
      throw new AuthorizationError("Authentication required");
    }
    const role = session.user.role as Role;
    const userId = session.user.id;
    assertRole(role, roles);
    return handler(request, { ...context, user: { id: userId, role } });
  });
}

function normalizeError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }
  if (error instanceof ZodError) {
    return new ValidationError();
  }
  return new AppError("Unexpected server error", "INTERNAL_SERVER_ERROR", 500);
}
