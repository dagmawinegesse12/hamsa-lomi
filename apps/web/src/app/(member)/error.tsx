"use client";

import { useEffect } from "react";
import Link from "next/link";
import * as Sentry from "@sentry/nextjs";

export default function MemberError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6">
      <div className="w-full max-w-md rounded-md border border-red-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-red-600">Error</p>
        <h2 className="mt-3 text-xl font-bold text-gray-950">Something went wrong</h2>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          We could not load this page. Please try again or contact the office.
        </p>
        {error.digest && (
          <p className="mt-2 font-mono text-xs text-gray-400">Error ID: {error.digest}</p>
        )}
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
          >
            Try again
          </button>
          <Link
            href="/dashboard"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
