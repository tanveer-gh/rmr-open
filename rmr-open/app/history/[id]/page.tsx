import Link from "next/link";
import { notFound } from "next/navigation";
import { getEvent } from "@/lib/history";

export default async function EventDetailPage({
  params,
}: PageProps<"/history/[id]">) {
  const { id } = await params;
  const event = getEvent(id);
  if (!event) notFound();

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
      <Link
        href="/history"
        className="text-xs tracking-[0.2em] text-muted uppercase transition-colors hover:text-steel"
      >
        ← Back to history
      </Link>

      <div className="mt-6 flex items-center gap-6">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-steel-dark" />
        <h1 className="font-display text-3xl font-bold tracking-[0.15em] text-steel-bright uppercase">
          RMR Open #{event.number}
        </h1>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-steel-dark" />
      </div>
      <p className="mt-3 text-center text-xs tracking-[0.3em] text-muted uppercase">
        {event.date} — {event.teams} teams
      </p>

      {/* Result summary */}
      <section className="steel-frame mt-10 bg-card p-6 text-center">
        <h2 className="font-display text-sm font-semibold tracking-[0.25em] text-steel uppercase">
          Final
        </h2>
        <p className="mt-4 font-display text-2xl font-semibold text-steel-bright">
          {event.champion}{" "}
          <span className="text-steel">{event.finalScore}</span>{" "}
          {event.runnerUp}
        </p>
        <p className="mt-2 text-xs tracking-[0.2em] text-muted uppercase">
          MVP: {event.mvp}
        </p>
      </section>

      {/* Bracket placeholder */}
      <section className="steel-frame mt-6 bg-card p-6">
        <h2 className="font-display text-center text-sm font-semibold tracking-[0.25em] text-steel uppercase">
          Bracket
        </h2>
        <div className="mt-4 flex h-48 items-center justify-center border border-dashed border-steel-dark text-xs tracking-[0.2em] text-muted uppercase">
          Bracket view — coming with the database
        </div>
      </section>

      {/* Standings placeholder */}
      <section className="steel-frame mt-6 bg-card p-6">
        <h2 className="font-display text-center text-sm font-semibold tracking-[0.25em] text-steel uppercase">
          Standings &amp; Stats
        </h2>
        <div className="mt-4 flex h-48 items-center justify-center border border-dashed border-steel-dark text-xs tracking-[0.2em] text-muted uppercase">
          Team standings and player stats — coming with the database
        </div>
      </section>
    </main>
  );
}
