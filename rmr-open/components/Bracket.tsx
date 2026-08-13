import Link from "next/link";
import { Fragment } from "react";
import type { Match, Team } from "@/lib/tournament";
import { roundName } from "@/lib/tournament";

// Single-elimination bracket with elbow connectors between rounds and a
// subtle neon glow. Column entries are either a match or a first-round
// bye. Pass `matchHref` to make match cards link to per-game pages.
export type BracketColumnEntry =
  | { kind: "match"; match: Match }
  | { kind: "bye"; team: Team };

export type BracketColumn = BracketColumnEntry[];

type TeamLookup = (id: string | null) => Team | undefined;

const ROW_H = 116;
const LINE = "absolute bg-steel-dark";

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
  const bodyHeight = columns[0].length * ROW_H;

  return (
    <div className="overflow-x-auto pb-4">
      <div className="relative mx-auto min-w-max px-2">
        <div className="relative flex items-stretch">
          {columns.map((entries, i) => (
            <Fragment key={i}>
              {/* Round column */}
              <div className="flex flex-col">
                <h3 className="mb-4 h-5 text-center text-[10px] font-semibold tracking-[0.25em] text-muted uppercase">
                  {roundName(i + 1, totalRounds)}
                </h3>
                <div className="flex flex-col" style={{ height: bodyHeight }}>
                  {entries.map((entry) => (
                    <div
                      key={
                        entry.kind === "match"
                          ? entry.match.id
                          : `bye-${entry.team.id}`
                      }
                      className="flex flex-1 items-center"
                    >
                      {entry.kind === "match" ? (
                        <MatchCard
                          match={entry.match}
                          getTeam={getTeam}
                          href={matchHref?.(entry.match)}
                        />
                      ) : (
                        <ByeCard team={entry.team} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Elbow connectors into the next round */}
              {i < columns.length - 1 && (
                <div className="flex w-10 flex-col">
                  <div className="mb-4 h-5" />
                  <div
                    className="flex flex-col"
                    style={{ height: bodyHeight }}
                  >
                    {columns[i + 1].map((_, j) => (
                      <div key={j} className="relative flex-1">
                        <span className={`${LINE} top-1/4 left-0 h-px w-1/2`} />
                        <span className={`${LINE} top-3/4 left-0 h-px w-1/2`} />
                        <span className={`${LINE} top-1/4 left-1/2 h-1/2 w-px`} />
                        <span className={`${LINE} top-1/2 left-1/2 h-px w-1/2`} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
