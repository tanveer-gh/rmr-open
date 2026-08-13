"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/bracket", label: "Bracket" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/history", label: "History" },
  { href: "/rules", label: "Rules" },
  { href: "/register", label: "Register" },
] as const;

function linkClasses(active: boolean) {
  return `text-xs font-semibold tracking-[0.2em] uppercase transition-colors ${
    active
      ? "text-steel-bright border-b-2 border-steel pb-1"
      : "text-muted hover:text-steel"
  }`;
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-steel-dark/50 bg-abyss/95 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/"
            aria-label="Return to main page"
            className="shrink-0 transition-opacity hover:opacity-80"
            onClick={() => setOpen(false)}
          >
            <Image
              src="/images/scythe.png"
              alt="RMR Open scythe logo"
              width={48}
              height={48}
              priority
              className="h-9 w-9 sm:h-12 sm:w-12"
            />
          </Link>
          <Link
            href="/"
            className={linkClasses(pathname === "/")}
            onClick={() => setOpen(false)}
          >
            Home
          </Link>
        </div>

        {/* Desktop links */}
        <ul className="hidden items-center gap-6 md:flex lg:gap-8">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={linkClasses(pathname.startsWith(href))}
              >
                {label}
              </Link>
            </li>
          ))}
          <li>
            <a
              href="https://phlstats.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold tracking-[0.2em] uppercase text-muted transition-colors hover:text-steel"
            >
              PHLstats
            </a>
          </li>
        </ul>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 border border-steel-dark text-steel md:hidden"
        >
          <span
            className={`h-px w-4 bg-current transition-transform ${
              open ? "translate-y-[3.5px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-px w-4 bg-current transition-transform ${
              open ? "-translate-y-[3.5px] -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <ul className="flex flex-col border-t border-steel-dark/50 md:hidden">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={() => setOpen(false)}
                className={`block px-6 py-3 text-xs font-semibold tracking-[0.2em] uppercase transition-colors ${
                  pathname.startsWith(href)
                    ? "bg-charcoal text-steel-bright"
                    : "text-muted hover:text-steel"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
          <li>
            <a
              href="https://phlstats.com/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="block px-6 py-3 text-xs font-semibold tracking-[0.2em] uppercase text-muted transition-colors hover:text-steel"
            >
              PHLstats
            </a>
          </li>
        </ul>
      )}
    </header>
  );
}
