"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard, User, CreditCard, FileText, Bell,
  Menu, X, Home
} from "lucide-react";
import { NavLink } from "@/components/ui/nav-link";

const links = [
  { label: "Dashboard",     href: "/dashboard",     icon: LayoutDashboard },
  { label: "Profile",       href: "/profile",       icon: User },
  { label: "Payments",      href: "/payments",      icon: CreditCard },
  { label: "Claims",        href: "/claims",        icon: FileText },
  { label: "Notifications", href: "/notifications", icon: Bell },
];

const navBase   = "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-soft hover:bg-green-50 hover:text-green-700 transition-colors";
const navActive = "bg-green-50 text-green-700 font-semibold";

export function MemberShell({ children, title }: { children: React.ReactNode; title: string }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  return (
    <div className="min-h-screen bg-cream-100">

      {/* ── Topbar ── */}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur-sm shadow-warm">
        <div className="flag-stripe h-0.5 w-full" aria-hidden="true" />
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">

          {/* Left: hamburger + title */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              aria-expanded={drawerOpen}
              className="flex h-9 w-9 items-center justify-center rounded-md text-ink-muted hover:bg-gray-100 transition-colors md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link href="/dashboard" className="flex items-center gap-2.5 group shrink-0">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-700">
                <span className="font-display text-[10px] font-bold text-gold-400">HL</span>
              </div>
              <span className="font-display text-base font-bold text-ink group-hover:text-green-700 transition-colors hidden sm:block">
                {title}
              </span>
            </Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5" aria-label="Member navigation">
            {links.map(({ label, href, icon: Icon }) => (
              <NavLink
                key={href}
                href={href}
                exact
                className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-ink-soft hover:bg-green-50 hover:text-green-700 transition-colors"
                activeClassName="bg-green-50 text-green-700 font-semibold"
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </NavLink>
            ))}
          </nav>

          <Link href="/" className="hidden sm:flex items-center gap-1 text-xs text-ink-muted hover:text-green-700 transition-colors">
            <Home className="h-3.5 w-3.5" />
            <span>Home</span>
          </Link>
        </div>
      </header>

      {/* ── Mobile overlay ── */}
      {drawerOpen && (
        <div
          className="drawer-overlay md:hidden"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile drawer ── */}
      {drawerOpen && (
        <aside
          className="drawer-enter fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white shadow-warm-lg md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Member navigation"
        >
          <div className="flag-stripe h-1 w-full shrink-0" />
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-700">
                <span className="font-display text-xs font-bold text-gold-400">HL</span>
              </div>
              <div>
                <p className="font-display text-sm font-bold text-ink">Member Portal</p>
                <p className="text-[10px] font-medium uppercase tracking-widest text-ink-muted">Hamsa Lomi</p>
              </div>
            </div>
            <button
              onClick={() => setDrawerOpen(false)}
              aria-label="Close menu"
              className="flex h-9 w-9 items-center justify-center rounded-md text-ink-muted hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
            {links.map(({ label, href, icon: Icon }) => (
              <NavLink
                key={href}
                href={href}
                exact
                className={navBase}
                activeClassName={navActive}
                onClick={() => setDrawerOpen(false)}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="border-t border-gray-100 p-4">
            <Link
              href="/"
              onClick={() => setDrawerOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-muted hover:bg-gray-50 transition-colors"
            >
              <Home className="h-4 w-4" />
              Back to home
            </Link>
          </div>
        </aside>
      )}

      {/* Page body */}
      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}
