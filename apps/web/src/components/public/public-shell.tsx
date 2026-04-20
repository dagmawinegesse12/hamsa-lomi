"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { NavLink } from "@/components/ui/nav-link";
import { publicNavItems, publicSite } from "@/lib/content/public-site";

export function PublicShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  /* Lock body scroll when drawer is open */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div className="min-h-screen bg-cream-100 text-ink">

      {/* ── Ethiopian flag tricolor stripe ── */}
      <div className="flag-stripe h-1 w-full" aria-hidden="true" />

      {/* ══════════════════════════════════
          HEADER
      ══════════════════════════════════ */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-warm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0" onClick={() => setOpen(false)}>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-700 shadow-warm">
              <span className="font-display text-sm font-bold text-gold-500 leading-none">HL</span>
            </div>
            <div className="hidden sm:block">
              <p className="font-display text-base font-bold text-ink leading-tight group-hover:text-green-700 transition-colors">
                Hamsa Lomi
              </p>
              <p className="text-[10px] font-medium uppercase tracking-widest text-ink-muted">
                Nashville · Est. 2014
              </p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {publicNavItems.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                exact
                className="rounded-md px-3 py-2 text-sm font-medium text-ink-soft hover:text-green-700 hover:bg-green-50 transition-colors"
                activeClassName="text-green-700 bg-green-50 font-semibold"
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <Link
              href="/sign-in"
              className="rounded-md px-4 py-2 text-sm font-semibold text-ink-soft border border-gray-300 hover:border-green-600 hover:text-green-700 transition-colors"
            >
              Member login
            </Link>
            <Link
              href="/apply"
              className="rounded-md bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800 transition-colors shadow-warm"
            >
              Apply now
            </Link>
          </div>

          {/* Mobile: login + hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/sign-in"
              className="rounded-md px-3 py-1.5 text-xs font-semibold text-ink-soft border border-gray-300 hover:border-green-600 transition-colors"
            >
              Login
            </Link>
            <button
              onClick={() => setOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={open}
              className="flex h-10 w-10 items-center justify-center rounded-md text-ink-soft hover:bg-gray-100 transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════
          MOBILE DRAWER
      ══════════════════════════════════ */}
      {open && (
        <>
          {/* Overlay */}
          <div
            className="drawer-overlay"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <aside
            className="drawer-enter fixed inset-y-0 left-0 z-50 flex w-[85vw] max-w-xs flex-col bg-white shadow-warm-lg"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {/* Drawer header with flag stripe */}
            <div className="flag-stripe h-1 w-full" aria-hidden="true" />
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-700">
                  <span className="font-display text-xs font-bold text-gold-500">HL</span>
                </div>
                <div>
                  <p className="font-display text-sm font-bold text-ink">Hamsa Lomi</p>
                  <p className="text-[10px] font-medium uppercase tracking-widest text-ink-muted">Nashville · Est. 2014</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded-md text-ink-muted hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Mobile navigation">
              <ul className="space-y-0.5">
                {publicNavItems.map((item) => (
                  <li key={item.href}>
                    <NavLink
                      href={item.href}
                      exact
                      className="flex items-center rounded-md px-4 py-3 text-base font-medium text-ink-soft hover:bg-green-50 hover:text-green-700 transition-colors"
                      activeClassName="bg-green-50 text-green-700 font-semibold"
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Drawer footer CTAs */}
            <div className="border-t border-gray-100 p-4 space-y-2">
              <Link
                href="/apply"
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-center rounded-md bg-green-700 px-4 py-3 text-sm font-semibold text-white hover:bg-green-800 transition-colors"
              >
                Apply for membership
              </Link>
              <Link
                href="/sign-in"
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-center rounded-md border border-gray-300 px-4 py-3 text-sm font-semibold text-ink-soft hover:bg-gray-50 transition-colors"
              >
                Member login
              </Link>
            </div>

            {/* Motto */}
            <div className="px-5 pb-5">
              <p className="text-center text-xs text-ink-muted leading-relaxed font-display italic">
                "{publicSite.mottoEnglish}"
              </p>
            </div>
          </aside>
        </>
      )}

      {/* ══════════════════════════════════
          PAGE CONTENT
      ══════════════════════════════════ */}
      <main>{children}</main>

      {/* ══════════════════════════════════
          FOOTER
      ══════════════════════════════════ */}
      <footer className="bg-ink text-cream-200 mt-16">
        {/* Flag stripe top */}
        <div className="flag-stripe h-1 w-full" aria-hidden="true" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
          <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr_1fr]">

            {/* Brand column */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-700 border border-green-600">
                  <span className="font-display text-sm font-bold text-gold-500">HL</span>
                </div>
                <div>
                  <p className="font-display text-base font-bold text-cream-100">Hamsa Lomi</p>
                  <p className="text-[10px] font-medium uppercase tracking-widest text-cream-400">501(c)(12) · Nashville, TN</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-cream-400 max-w-xs">
                {publicSite.tagline}
              </p>
              <div className="mt-4 rounded-md border border-green-700/40 bg-green-700/20 p-3">
                <p className="font-display text-sm text-cream-200 leading-snug">
                  {publicSite.mottoAmharic}
                </p>
                <p className="mt-1 text-xs italic text-cream-400">
                  {publicSite.mottoEnglish}
                </p>
              </div>
            </div>

            {/* Quick links */}
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gold-500">Organization</p>
              <ul className="space-y-2 text-sm">
                {publicNavItems.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-cream-400 hover:text-gold-400 transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gold-500">Resources</p>
              <ul className="space-y-2">
                {publicSite.helpfulLinks.flatMap((s) =>
                  s.items.map((item) => (
                    <li key={item.url}>
                      <a
                        href={item.url}
                        rel="noreferrer"
                        target="_blank"
                        className="text-sm text-cream-400 hover:text-gold-400 transition-colors"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))
                )}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gold-500">Contact</p>
              <address className="not-italic space-y-2 text-sm text-cream-400">
                <p>{publicSite.contact.addressLine1}</p>
                <p>{publicSite.contact.addressLine2}</p>
                <p className="text-cream-500 text-xs">{publicSite.contact.locationNote}</p>
                <a href={`mailto:${publicSite.contact.email}`} className="block text-gold-400 hover:text-gold-300 transition-colors mt-3">
                  {publicSite.contact.email}
                </a>
                <a href={`tel:${publicSite.contact.phone.replaceAll("-", "")}`} className="block text-cream-400 hover:text-cream-200 transition-colors">
                  {publicSite.contact.phone}
                </a>
              </address>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-ink-soft/30">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-4 text-xs text-cream-500">
            <p>© {new Date().getFullYear()} Hamsa Lomi Ethiopian Association. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/contact" className="hover:text-cream-300 transition-colors">Contact</Link>
              <Link href="/bylaws" className="hover:text-cream-300 transition-colors">Bylaws</Link>
              <Link href="/sign-in" className="hover:text-cream-300 transition-colors">Member portal</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
