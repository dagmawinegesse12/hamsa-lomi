"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function GlobalError({
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
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#f6f7f4] px-6">
      <div className="w-full max-w-md rounded-md border border-red-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-red-600">Something went wrong</p>
        <h1 className="mt-3 text-2xl font-bold text-gray-950">An unexpected error occurred</h1>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          We encountered an unexpected problem. The error has been logged. Please try again or contact the office if the issue persists.
        </p>
        {error.digest && (
          <p className="mt-3 font-mono text-xs text-gray-400">Error ID: {error.digest}</p>
        )}
        <button
          onClick={reset}
          className="mt-6 rounded-md bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-800"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
