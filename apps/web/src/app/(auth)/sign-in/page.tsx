import Link from "next/link";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { publicSite } from "@/lib/content/public-site";
import { signInWithCredentials } from "./actions";

type SignInPageProps = {
  searchParams?: {
    callbackUrl?: string;
    error?: string;
  };
};

const demoAccounts = [
  { email: "admin@edir.test",     role: "Admin" },
  { email: "treasurer@edir.test", role: "Treasurer" },
  { email: "secretary@edir.test", role: "Secretary" },
];

export default function SignInPage({ searchParams }: SignInPageProps) {
  const callbackUrl    = searchParams?.callbackUrl ?? "/admin/dashboard";
  const isRateLimited  = searchParams?.error === "RateLimit";
  const hasError       = Boolean(searchParams?.error);
  const showDemoAccounts = process.env.NODE_ENV !== "production";

  return (
    <main className="min-h-screen bg-cream-100 flex flex-col">
      {/* Flag stripe */}
      <div className="flag-stripe h-1 w-full" aria-hidden="true" />

      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-4xl overflow-hidden rounded-2xl shadow-warm-lg">
          <div className="grid md:grid-cols-[1fr_420px]">

            {/* Left: brand panel */}
            <div className="relative bg-green-900 p-8 text-white md:p-10 flex flex-col justify-between">
              {/* Decorative vertical flag stripe */}
              <div className="flag-stripe-v absolute left-0 top-0 h-full w-1.5" aria-hidden="true" />

              <div className="pl-3">
                <Link href="/" className="flex items-center gap-3 mb-8">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/20 border border-gold-500/40">
                    <span className="font-display text-sm font-bold text-gold-400">HL</span>
                  </div>
                  <div>
                    <p className="font-display text-base font-bold text-white">Hamsa Lomi</p>
                    <p className="text-[10px] font-medium uppercase tracking-widest text-green-300">Nashville · Est. 2014</p>
                  </div>
                </Link>

                <p className="text-xs font-bold uppercase tracking-widest text-gold-400 mb-3">Secure access</p>
                <h1 className="font-display text-2xl font-bold text-white leading-tight md:text-3xl">
                  Member &amp; board portal
                </h1>
                <p className="mt-4 text-sm leading-relaxed text-green-200">
                  Sign in to view member records, dues, claims, meetings, notifications, and Edir operations.
                </p>

                <div className="mt-8 rounded-xl border border-green-700/60 bg-green-800/60 p-4">
                  <p className="font-display text-sm italic text-cream-300 leading-relaxed">
                    &ldquo;{publicSite.mottoAmharic}&rdquo;
                  </p>
                  <p className="mt-2 text-xs text-green-400 italic">
                    {publicSite.mottoEnglish}
                  </p>
                </div>
              </div>

              <p className="pl-3 mt-8 text-xs text-green-400">
                Board access is protected. Contact the office to request access.
              </p>
            </div>

            {/* Right: form */}
            <div className="bg-white p-8 md:p-10">
              <h2 className="font-display text-2xl font-bold text-ink">Sign in</h2>
              <p className="mt-1.5 text-sm text-ink-muted">
                Use the email associated with your account.
              </p>

              <input name="callbackUrl" type="hidden" value={callbackUrl} />

              {isRateLimited ? (
                <div className="mt-5 rounded-lg border border-gold-200 bg-gold-50 px-4 py-3 text-sm font-medium text-gold-800" role="alert">
                  Too many attempts. Please wait 15 minutes and try again.
                </div>
              ) : hasError ? (
                <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800" role="alert">
                  Email or password was not recognized. Please check your details.
                </div>
              ) : null}

              <form action={signInWithCredentials} className="mt-7 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-ink-muted mb-1.5">
                    Email
                  </label>
                  <Input
                    aria-label="Email"
                    autoComplete="email"
                    name="email"
                    placeholder="you@example.com"
                    required
                    type="email"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-ink-muted mb-1.5">
                    Password
                  </label>
                  <Input
                    aria-label="Password"
                    autoComplete="current-password"
                    name="password"
                    placeholder="Password"
                    required
                    type="password"
                  />
                </div>
                <SubmitButton className="w-full py-3" pendingLabel="Signing in…">
                  Continue →
                </SubmitButton>
              </form>

              <p className="mt-5 text-xs text-center text-ink-muted">
                Not a member?{" "}
                <Link href="/apply" className="font-semibold text-green-700 hover:text-green-800">
                  Apply for membership
                </Link>
              </p>

              {showDemoAccounts && (
                <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-2">Dev accounts</p>
                  <p className="text-xs text-ink-muted mb-3">Password: <code className="font-mono bg-gray-100 px-1 py-0.5 rounded">Password123!</code></p>
                  <div className="space-y-1.5">
                    {demoAccounts.map((account) => (
                      <div key={account.email} className="flex items-center justify-between text-xs">
                        <span className="font-medium text-ink-soft">{account.role}</span>
                        <code className="font-mono text-ink-muted">{account.email}</code>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
