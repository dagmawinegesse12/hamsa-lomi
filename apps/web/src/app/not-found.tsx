import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-cream-100 px-4">
      <div className="flag-stripe h-1 w-full fixed top-0" aria-hidden="true" />
      <div className="w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-700">
            <span className="font-display text-xl font-bold text-gold-400">HL</span>
          </div>
        </div>
        <p className="text-xs font-bold uppercase tracking-widest text-gold-600">404</p>
        <h1 className="font-display mt-2 text-4xl font-bold text-ink">Page not found</h1>
        <p className="mt-4 text-base leading-relaxed text-ink-muted">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-md bg-green-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-800 transition-colors shadow-warm"
          >
            Go home
          </Link>
          <Link
            href="/contact"
            className="rounded-md border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-ink hover:bg-gray-50 transition-colors"
          >
            Contact office
          </Link>
        </div>
      </div>
    </main>
  );
}
