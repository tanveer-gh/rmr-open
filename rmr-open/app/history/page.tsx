import Link from "next/link";
import { pastEvents } from "@/lib/history";
import { playerStandings } from "@/lib/leaderboard";

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="flex w-full items-center gap-3 border-b border-steel-dark/50 pb-3">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-steel-dark" />
      <span className="font-display text-lg font-semibold tracking-[0.25em] text-steel-bright uppercase">
        {label}
      </span>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-steel-dark" />
    </div>
  );
}

export default function HistoryPage() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <div className="flex items-center gap-6">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-steel-dark" />
        <h1 className="font-display text-3xl font-bold tracking-[0.15em] text-steel-bright uppercase">
          History
        </h1>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-steel-dark" />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-8">
        {/* Left — past winners */}
        <section>
          <SectionHeader label="Past Winners" />
          <ul className="mt-6 flex flex-col gap-4">
            {pastEvents.map((event) => (
              <li key={event.id}>
                <Link
                  href={`/history/${event.id}`}
                  className="steel-frame flex flex-col gap-2 bg-card p-4 transition-colors hover:bg-charcoal"
                >
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="text-xs font-semibold tracking-[0.15em] text-muted uppercase">
                      RMR Open #{event.number}
                    </span>
                    <span className="text-[10px] tracking-[0.15em] text-muted uppercase">
                      {event.date}
                    </span>
                  </span>
                  <span className="font-display text-xl font-bold tracking-[0.1em] text-steel-bright uppercase">
                    🏆 {event.champion}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Right — player leaderboard */}
        <section>
          <SectionHeader label="Leaderboard" />
          <div className="mt-6">
            <div className="grid grid-cols-[2rem_1fr_2.5rem_2.5rem_3rem] gap-2 px-3 pb-2 text-[10px] font-semibold tracking-[0.2em] text-muted uppercase">
              <span>#</span>
              <span>Player</span>
              <span className="text-right">G</span>
              <span className="text-right">A</span>
              <span className="text-right">Pts</span>
            </div>
            <ul className="flex flex-col">
              {playerStandings.map((row) => (
                <li
                  key={row.player}
                  className="grid grid-cols-[2rem_1fr_2.5rem_2.5rem_3rem] items-center gap-2 border-b border-steel-dark/30 px-3 py-2.5 last:border-b-0 hover:bg-charcoal/50"
                >
                  <span className="text-xs text-muted">{row.rank}</span>
                  <span className="min-w-0">
                    <a
                      href="https://phlstats.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`${row.player} on PHLstats`}
                      className="block truncate text-sm font-semibold text-steel-bright underline-offset-4 transition-colors hover:text-steel hover:underline"
                    >
                      {row.player}
                    </a>
                    <span className="block truncate text-[10px] text-muted">
                      {row.team}
                    </span>
                  </span>
                  <span className="text-right text-sm text-steel">
                    {row.goals}
                  </span>
                  <span className="text-right text-sm text-steel">
                    {row.assists}
                  </span>
                  <span className="text-right text-sm font-semibold text-steel-bright">
                    {row.points}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-5 text-muted">
              Player names link to their PHLstats profile. Stats are
              placeholders until the database is connected.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
