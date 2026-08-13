import Link from "next/link";
import { pastEvents } from "@/lib/history";

export default function HistoryPage() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
      <div className="flex items-center gap-6">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-steel-dark" />
        <h1 className="font-display text-3xl font-bold tracking-[0.15em] text-steel-bright uppercase">
          History
        </h1>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-steel-dark" />
      </div>
      <p className="mt-3 text-center text-xs tracking-[0.3em] text-muted uppercase">
        Past RMR Opens
      </p>

      <ul className="mt-10 flex flex-col gap-4">
        {pastEvents.map((event) => (
          <li key={event.id}>
            <Link
              href={`/history/${event.id}`}
              className="steel-frame flex flex-col gap-4 bg-card p-5 transition-colors hover:bg-charcoal sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex flex-col gap-1 text-left">
                <span className="font-display text-lg font-semibold tracking-[0.2em] text-steel-bright uppercase">
                  RMR Open #{event.number}
                </span>
                <span className="text-xs tracking-[0.2em] text-muted uppercase">
                  {event.date} — {event.teams} teams
                </span>
              </div>
              <div className="flex flex-col gap-1 text-left sm:text-right">
                <span className="text-sm text-steel">
                  Champion:{" "}
                  <span className="font-semibold text-steel-bright">
                    {event.champion}
                  </span>
                </span>
                <span className="text-xs text-muted">
                  def. {event.runnerUp} ({event.finalScore})
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
