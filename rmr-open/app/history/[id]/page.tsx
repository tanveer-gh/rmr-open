import Link from "next/link";
import { notFound } from "next/navigation";
import Bracket, { type BracketColumn } from "@/components/Bracket";
import { getEvent, type PastEvent } from "@/lib/history";

function buildColumns(event: PastEvent): BracketColumn[] {
  return event.layout.map((column) =>
    column.map((slot) => {
      if (slot.startsWith("bye:")) {
        const team = event.teams.find((t) => t.id === slot.slice(4));
        return { kind: "bye" as const, team: team! };
      }
      const match = event.matches.find((m) => m.id === slot);
      return { kind: "match" as const, match: match! };
    }),
  );
}

export default async function EventDetailPage({
  params,
}: PageProps<"/history/[id]">) {
  const { id } = await params;
  const event = getEvent(id);
  if (!event) notFound();

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
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
        {event.date} — {event.teamCount} teams
      </p>

      {/* Champion */}
      <div className="steel-frame mx-auto mt-8 w-full max-w-md bg-card p-6 text-center">
        <p className="text-[10px] tracking-[0.3em] text-muted uppercase">
          Champions
        </p>
        <p className="font-display mt-2 text-2xl font-bold tracking-[0.1em] text-steel-bright uppercase">
          🏆 {event.champion}
        </p>
        <p className="mt-2 text-xs tracking-[0.2em] text-muted uppercase">
          MVP: {event.mvp}
        </p>
      </div>

      {/* Bracket — every match links to its game stats */}
      <section className="mt-10">
        <Bracket
          columns={buildColumns(event)}
          teams={event.teams}
          matchHref={(match) => `/history/${event.id}/${match.id}`}
        />
        <p className="mt-2 text-center text-xs text-muted">
          Click any match to view that game&apos;s stats.
        </p>
      </section>
    </main>
  );
}
