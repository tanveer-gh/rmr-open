import Link from "next/link";
import { notFound } from "next/navigation";
import { getEvent, getMatch } from "@/lib/history";
import { roundName } from "@/lib/tournament";

export default async function MatchDetailPage({
  params,
}: PageProps<"/history/[id]/[matchId]">) {
  const { id, matchId } = await params;
  const event = getEvent(id);
  if (!event) notFound();
  const match = getMatch(event, matchId);
  if (!match) notFound();

  const teamA = event.teams.find((t) => t.id === match.teamA);
  const teamB = event.teams.find((t) => t.id === match.teamB);
  if (!teamA || !teamB) notFound();

  const totalRounds = event.layout.length;
  const aWins = (match.scoreA ?? 0) > (match.scoreB ?? 0);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <Link
        href={`/history/${event.id}`}
        className="text-xs tracking-[0.2em] text-muted uppercase transition-colors hover:text-steel"
      >
        ← Back to RMR Open #{event.number} bracket
      </Link>

      <p className="mt-8 text-center text-[10px] tracking-[0.35em] text-muted uppercase">
        RMR Open #{event.number} — {roundName(match.round, totalRounds)}
      </p>

      {/* Score line */}
      <div className="mt-4 flex items-center justify-center gap-6 text-center">
        <span
          className={`flex-1 text-right font-display text-2xl font-bold tracking-[0.08em] uppercase sm:text-3xl ${
            aWins ? "text-steel-bright" : "text-muted"
          }`}
        >
          {teamA.name}
        </span>
        <span className="font-display text-3xl font-bold text-steel-bright tabular-nums sm:text-4xl">
          {match.scoreA} – {match.scoreB}
        </span>
        <span
          className={`flex-1 text-left font-display text-2xl font-bold tracking-[0.08em] uppercase sm:text-3xl ${
            aWins ? "text-muted" : "text-steel-bright"
          }`}
        >
          {teamB.name}
        </span>
      </div>
      <p className="mt-3 text-center text-[10px] tracking-[0.25em] text-muted uppercase">
        Final
      </p>

      {/* Game stats placeholder */}
      <section className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {[teamA, teamB].map((team) => (
          <div key={team.id} className="steel-frame bg-card p-5">
            <h2 className="font-display text-sm font-semibold tracking-[0.2em] text-steel-bright uppercase">
              {team.name}
            </h2>
            <div className="mt-4 flex h-40 items-center justify-center border border-dashed border-steel-dark text-center text-xs leading-5 tracking-[0.15em] text-muted uppercase">
              Goals · Assists · Saves
              <br />
              per player — coming with
              <br />
              the database
            </div>
          </div>
        ))}
      </section>

      <p className="mt-6 text-center text-xs leading-5 text-muted">
        Every game&apos;s box score — scorers, assists, goalie saves — will be
        recorded here once match stats are connected.
      </p>
    </main>
  );
}
