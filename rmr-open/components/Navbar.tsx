"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/history", label: "History" },
  { href: "/register", label: "Register" },
] as const;

function linkClasses(active: boolean) {
  return `text-[10px] font-semibold tracking-[0.12em] uppercase transition-colors sm:text-xs sm:tracking-[0.2em] ${
    active
      ? "text-steel-bright border-b-2 border-steel pb-1"
      : "text-muted hover:text-steel"
  }`;
}

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-steel-dark/50 bg-abyss/95 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/"
            aria-label="Return to main page"
            className="shrink-0 transition-opacity hover:opacity-80"
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
          <Link href="/" className={linkClasses(pathname === "/")}>
            Home
          </Link>
        </div>

        <ul className="flex items-center gap-4 sm:gap-8">
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
              className="text-[10px] font-semibold tracking-[0.12em] uppercase text-muted transition-colors hover:text-steel sm:text-xs sm:tracking-[0.2em]"
            >
              PHLstats
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
