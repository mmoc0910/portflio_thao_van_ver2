

import { Link, NavLink, Outlet } from "react-router";
import { useMemo, useState } from "react";
import { cn } from "../utils/helpers";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/photography", label: "Photography" },
  { to: "/resume", label: "Resume" },
  { to: "/social-media-promotion", label: "Social media & promotion" },
  { to: "/media-production", label: "Media production" },
];

const NavItem = ({
  to,
  label,
  onClick,
}: {
  to: string;
  label: string;
  onClick?: () => void;
}) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      cn(
        "rounded-full px-4 py-2 text-sm font-medium transition",
        isActive
          ? "bg-primary text-white shadow-sm"
          : "text-slate-700 hover:bg-slate-100",
      )
    }
  >
    {label}
  </NavLink>
);

export const PortfolioLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <div className="min-h-screen w-full bg-white text-slate-900">
      {/* soft colorful background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-48 -left-48 h-130 w-130 rounded-full bg-sky-300/35 blur-3xl" />
        <div className="absolute top-20 -right-40 h-130 w-130 rounded-full bg-fuchsia-300/30 blur-3xl" />
        <div className="absolute -bottom-56 left-1/4 h-155 w-155 rounded-full bg-emerald-300/25 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(255,255,255,0.9),transparent_55%),radial-gradient(circle_at_70%_0%,rgba(255,255,255,0.9),transparent_55%)]" />
      </div>

      {/* Topbar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/70 bg-white/70 backdrop-blur">
        <div className="flex w-full items-center justify-between px-4 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              className="sm:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <Link to="/" className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-linear-to-br from-sky-400 to-fuchsia-400 shadow-sm" />
              <div className="leading-tight">
                <p className="text-xs text-slate-500">My Portfolio</p>
                <p className="text-base font-semibold tracking-tight">
                  Van Sally
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-2">
            {navItems.map((i) => (
              <NavItem key={i.to} to={i.to} label={i.label} />
            ))}
          </nav>

          <div className="hidden sm:flex items-center gap-2">
            <a
              href="mailto:contact.bettylam@gmail.com"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:opacity-90 transition"
            >
              Contact
            </a>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-[320px] bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-2xl bg-linear-to-br from-sky-400 to-fuchsia-400" />
                <span className="font-semibold">Van Sally</span>
              </Link>
              <button
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              {navItems.map((i) => (
                <NavLink
                  key={i.to}
                  to={i.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "rounded-2xl px-4 py-3 text-sm font-medium transition",
                      isActive
                        ? "bg-slate-900 text-white"
                        : "text-slate-700 hover:bg-slate-100",
                    )
                  }
                >
                  {i.label}
                </NavLink>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold">Work inquiry</p>
              <p className="mt-1 text-sm text-slate-600">
                contact.bettylam@gmail.com
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Full-width content */}
      <main className="w-full px-4 py-10 sm:px-10">
        <Outlet />
      </main>

      <footer className="w-full border-t border-slate-200/70 bg-white/70">
        <div className="flex w-full flex-col gap-2 px-4 py-6 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <p>© {year} Van Sally. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <a className="hover:text-slate-900 transition" href="mailto:contact.bettylam@gmail.com">
              vtv.vansally@gmail.com
            </a>
            <a className="hover:text-slate-900 transition" href="tel:+14052643204">
              (918) 904-0346
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};