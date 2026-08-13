import Link from "next/link";
import type { Match, Team } from "@/lib/tournament";
import { roundName } from "@/lib/tournament";

// Single-elimination bracket. Column entries are either a match or a
// first-round bye for a top seed. Pass `matchHref` to make match cards
// link through to a per-game stats page.
export type BracketColumnEntry =
  | { kind: "match"; match: Match }
  | { kind: "bye"; team: Team };

export type BracketColumn = BracketColumnEntry[];

type TeamLookup = (id: string | null) => Team | undefined;

function TeamRow({
  team,
  score,
  winner,
  placeholder,
}: {
  team: Team | undefined;
  score: number | null;
  winner: boolean;
  placeholder: string;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-2 px-3 py-2 ${
        winner ? "text-steel-bright" : team ? "text-steel" : "text-muted/60"
      }`}
    >
      <span className="flex min-w-0 items-center gap-2">
        {team && (
          <span className="w-4 shrink-0 text-[10px] text-muted">
            {team.seed}
          </span>
        )}
        <span className={`truncate text-sm ${winner ? "font-semibold" : ""}`}>
          {team ? team.name : placeholder}
        </span>
      </span>
      <span className={`text-sm tabular-nums ${winner ? "font-semibold" : ""}`}>
        {score ?? ""}
      </span>
    </div>
  );
}

function MatchCard({
  match,
  getTeam,
  href,
}: {
  match: Match;
  getTeam: TeamLookup;
  href?: string;
}) {
  const teamA = getTeam(match.teamA);
  const teamB = getTeam(match.teamB);
  const decided =
    match.status === "final" && match.scoreA !== null && match.scoreB !== null;
  const aWins = decided && match.scoreA! > match.scoreB!;
  const bWins = decided && match.scoreB! > match.scoreA!;

  const card = (
    <div
      className={`steel-frame w-56 bg-card ${
        href ? "transition-colors hover:bg-charcoal" : ""
      }`}
    >
      <div className="flex items-center justify-between border-b border-steel-dark/40 px-3 py-1">
        <span className="text-[9px] tracking-[0.2em] text-muted uppercase">
          {match.status === "live" ? (
            <span className="text-blade-red">● Live</span>
          ) : match.status === "final" ? (
            "Final"
          ) : (
            "Upcoming"
          )}
        </span>
        {href && (
          <span className="text-[9px] tracking-[0.15em] text-muted uppercase">
            Stats →
          </span>
        )}
      </div>
      <TeamRow
        team={teamA}
        score={match.scoreA}
        winner={aWins}
        placeholder="TBD"
      />
      <div className="mx-3 h-px bg-steel-dark/30" />
      <TeamRow
        team={teamB}
        score={match.scoreB}
        winner={bWins}
        placeholder="TBD"
      />
    </div>
  );

  return href ? <Link href={href as never}>{card}</Link> : card;
}

function ByeCard({ team }: { team: Team }) {
  return (
    <div className="w-56 border border-dashed border-steel-dark/60 bg-card/50">
      <div className="flex items-center justify-between gap-2 px-3 py-2">
        <span className="flex min-w-0 items-center gap-2 text-steel">
          <span className="w-4 shrink-0 text-[10px] text-muted">
            {team.seed}
          </span>
          <span className="truncate text-sm">{team.name}</span>
        </span>
        <span className="text-[10px] tracking-[0.2em] text-muted uppercase">
          Bye
        </span>
      </div>
    </div>
  );
}

export default function Bracket({
  columns,
  teams,
  matchHref,
}: {
  columns: BracketColumn[];
  teams: Team[];
  matchHref?: (match: Match) => string;
}) {
  const totalRounds = columns.length;
  const getTeam: TeamLookup = (id) =>
    id ? teams.find((team) => team.id === id) : undefined;

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex min-w-max items-stretch gap-8">
        {columns.map((entries, i) => (
          <div key={i} className="flex flex-col">
            <h3 className="mb-4 text-center text-[10px] font-semibold tracking-[0.25em] text-muted uppercase">
              {roundName(i + 1, totalRounds)}
            </h3>
            <div className="flex flex-1 flex-col justify-around gap-4">
              {entries.map((entry) =>
                entry.kind === "match" ? (
                  <MatchCard
                    key={entry.match.id}
                    match={entry.match}
                    getTeam={getTeam}
                    href={matchHref?.(entry.match)}
                  />
                ) : (
                  <ByeCard key={`bye-${entry.team.id}`} team={entry.team} />
                ),
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
