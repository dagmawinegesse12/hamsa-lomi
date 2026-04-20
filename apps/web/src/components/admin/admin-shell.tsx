"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard, Users, CreditCard, FileText, Bell,
  Calendar, BarChart2, Megaphone, ClipboardList, Receipt,
  Menu, X, LogOut
} from "lucide-react";
import { NavLink } from "@/components/ui/nav-link";

const links = [
  { label: "Dashboard",     href: "/admin/dashboard",             icon: LayoutDashboard },
  { label: "Members",       href: "/admin/members",               icon: Users },
  { label: "Payments",      href: "/admin/payments",              icon: CreditCard },
  { label: "Claims",        href: "/admin/claims",                icon: FileText },
  { label: "Notifications", href: "/admin/notifications/compose", icon: Bell },
  { label: "Meetings",      href: "/admin/meetings",              icon: Calendar },
  { label: "Reports",       href: "/admin/reports",               icon: BarChart2 },
  { label: "Announcements", href: "/admin/announcements",         icon: Megaphone },
  { label: "Audit Log",     href: "/admin/audit-log",             icon: ClipboardList },
  { label: "Expenses",      href: "/admin/expenses",              icon: Receipt },
];

const navBase    = "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-cream-400 hover:bg-green-700/60 hover:text-white transition-colors";
const navActive  = "bg-green-600/80 text-white font-semibold shadow-warm";

function SidebarContent({ onClose }: { onClose?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      {/* Flag stripe */}
      <div className="flag-stripe h-1 w-full shrink-0" aria-hidden="true" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-green-700/50 px-5 py-4 shrink-0">
        <Link href="/admin/dashboard" onClick={onClose} className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-500/20 border border-gold-500/40">
            <span className="font-display text-sm font-bold text-gold-400">HL</span>
          </div>
          <div>
            <p className="font-display text-sm font-bold text-white leading-tight">Hamsa Lomi</p>
            <p className="text-[10px] font-medium uppercase tracking-widest text-green-300">Admin portal</p>
          </div>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-8 w-8 items-center justify-center rounded-md text-green-300 hover:bg-green-700/50 hover:text-white transition-colors lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {links.map(({ label, href, icon: Icon }) => (
          <NavLink
            key={href}
            href={href}
            className={navBase}
            activeClassName={navActive}
            onClick={onClose}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="shrink-0 border-t border-green-700/50 px-3 py-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-green-300 hover:bg-green-700/60 hover:text-white transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Public site
        </Link>
      </div>
    </div>
  );
}

export function AdminShell({
  children,
  organizationName = "Hamsa Lomi Ethiopian Association",
  title,
}: {
  children: React.ReactNode;
  organizationName?: string;
  title: string;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  return (
    <div className="min-h-screen bg-cream-100">
      {/* ── Desktop sidebar ── */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-green-900 lg:flex">
        <SidebarContent />
      </aside>

      {/* ── Mobile overlay ── */}
      {drawerOpen && (
        <div
          className="drawer-overlay lg:hidden"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile drawer ── */}
      <aside
        className={`drawer-enter fixed inset-y-0 left-0 z-50 w-72 flex-col bg-green-900 lg:hidden ${drawerOpen ? "flex" : "hidden"}`}
        role="dialog"
        aria-modal="true"
        aria-label="Admin navigation"
      >
        <SidebarContent onClose={() => setDrawerOpen(false)} />
      </aside>

      {/* ── Main content ── */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/95 backdrop-blur-sm shadow-warm">
          <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-6">
            {/* Mobile hamburger */}
            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation"
              aria-expanded={drawerOpen}
              className="flex h-9 w-9 items-center justify-center rounded-md text-ink-muted hover:bg-gray-100 transition-colors lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex-1 min-w-0">
              <h1 className="font-display truncate text-lg font-bold text-ink">{title}</h1>
              <p className="hidden text-xs text-ink-muted sm:block">{organizationName}</p>
            </div>

            <Link
              href="/"
              className="hidden sm:flex items-center gap-1.5 rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-ink-muted hover:border-green-300 hover:text-green-700 transition-colors"
            >
              Public site →
            </Link>
          </div>
        </header>

        {/* Page body */}
        <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
