import Image from "next/image";
import Link from "next/link";
import Countdown from "@/components/Countdown";

const tabs = [
  { label: "Register", href: "/register" },
  { label: "Bracket", href: "/bracket" },
  { label: "Leaderboard", href: "/leaderboard" },
] as const;

export default function Home() {
  return (
    <main className="hero-atmosphere flex flex-1 flex-col items-center px-6 py-10 text-center">
      {/* Title */}
      <div className="flex w-full max-w-3xl items-center gap-6">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-steel-dark" />
        <h1 className="font-display text-4xl font-bold tracking-[0.15em] text-steel-bright sm:text-5xl">
          RMR OPEN
        </h1>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-steel-dark" />
      </div>

      {/* Reaper emblem */}
      <Image
        src="/images/reaper.png"
        alt="RMR Open reaper emblem"
        width={360}
        height={360}
        priority
        className="mt-6 h-auto w-64 sm:w-80"
      />

      {/* Section heading */}
      <h2 className="mt-8">
        <a
          href="https://store.steampowered.com/app/2994020/Puck/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-display text-xl font-semibold tracking-[0.2em] text-steel-bright uppercase underline-offset-8 transition-colors hover:text-steel hover:underline sm:text-2xl"
        >
          Download Puck on Steam
        </a>
      </h2>

      {/* Main tabs */}
      <div className="mt-8 grid w-full max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
        {tabs.map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            className="steel-frame flex h-28 items-center justify-center bg-card transition-colors hover:bg-charcoal"
          >
            <span className="font-display text-lg font-semibold tracking-[0.25em] text-steel uppercase">
              {label}
            </span>
          </Link>
        ))}
      </div>

      {/* Countdown to next tournament — middle column mirrors the BRACKET tab */}
      <div className="mt-10 grid w-full max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="sm:col-start-2">
          <Countdown />
        </div>
      </div>

    </main>
  );
}
