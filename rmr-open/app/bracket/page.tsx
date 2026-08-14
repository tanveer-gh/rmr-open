"use client";

import Image from "next/image";
import { useState } from "react";
import Bracket, { type BracketColumn } from "@/components/Bracket";
import Countdown from "@/components/Countdown";
import TeamShowcase from "@/components/TeamShowcase";
import {
  currentTournament,
  freeAgents,
  hasFullFreeAgentTeam,
  matches,
  nextFreeAgentTeamName,
  teams,
  type Match,
  type TournamentPhase,
} from "@/lib/tournament";

const byId = (id: string): Match => matches.find((m) => m.id === id)!;

// Round 1 pairs feed the semifinals in display order: seed 1's bye sits
// above the match that produces its opponent, same for seed 2.
const liveColumns: BracketColumn[] = [
  [
    { kind: "bye", team: teams[0] },
    { kind: "match", match: byId("qf-2") },
    { kind: "bye", team: teams[1] },
    { kind: "match", match: byId("qf-1") },
  ],
  [
    { kind: "match", match: byId("sf-1") },
    { kind: "match", match: byId("sf-2") },
  ],
  [{ kind: "match", match: byId("final") }],
];

// Demo of a finished night — same bracket with every result filled in.
const completeColumns: BracketColumn[] = (() => {
  const done = (id: string, patch: Partial<Match>): Match => ({
    ...byId(id),
    status: "final",
    ...patch,
  });
  const sf1 = done("sf-1", { scoreA: 5, scoreB: 2 });
  const sf2 = done("sf-2", { scoreA: 3, scoreB: 2 });
  const final = done("final", {
    teamA: "ice-reapers",
    teamB: "five-hole-bandits",
    scoreA: 4,
    scoreB: 2,
  });
  return [
    liveColumns[0].map((entry) =>
      entry.kind === "match"
        ? { kind: "match", match: done(entry.match.id, {}) }
        : entry,
    ),
    [
      { kind: "match", match: sf1 },
      { kind: "match", match: sf2 },
    ],
    [{ kind: "match", match: final }],
  ];
})();

const phases: { value: TournamentPhase; label: string }[] = [
  { value: "registration", label: "Before" },
  { value: "live", label: "Live" },
  { value: "complete", label: "Complete" },
];

type HubTab = "teams" | "bracket";

export default function TournamentHubPage() {
  const [tab, setTab] = useState<HubTab>("teams");
  const [phase, setPhase] = useState<TournamentPhase>(currentTournament.phase);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
      <div className="flex flex-col gap-10 md:flex-row md:gap-12">
        {/* Left — tournament identity */}
        <aside className="flex shrink-0 flex-col items-center text-center md:w-60">
          <h1 className="font-display text-3xl font-bold tracking-[0.15em] text-steel-bright uppercase">
            RMR Open
          </h1>
          <p className="mt-1 text-xs tracking-[0.35em] text-muted uppercase">
            Week {currentTournament.number}
          </p>

          <Image
            src="/images/reaper.png"
            alt="RMR Open reaper emblem"
            width={240}
            height={240}
            priority
            className="mt-6 h-auto w-44"
          />

          <div className="mt-8 w-full border-t border-steel-dark/50 pt-6">
            <Countdown />
          </div>

          {/* Free agent pool */}
          <div className="mt-8 w-full border-t border-steel-dark/50 pt-6 text-left">
            <p className="text-center text-xs tracking-[0.3em] text-muted uppercase">
              Free Agents
            </p>
            <ul className="mt-4 flex flex-col gap-2">
              {freeAgents.map((agent) => (
                <li
                  key={agent.name}
                  className="flex items-baseline justify-between gap-2"
                >
                  <span className="truncate text-sm text-steel">
                    {agent.name}
                  </span>
                  <span className="shrink-0 text-[9px] tracking-[0.15em] text-muted uppercase">
                    {agent.position}
                  </span>
                </li>
              ))}
            </ul>
            {hasFullFreeAgentTeam(freeAgents) && (
              <p className="mt-4 text-xs leading-5 text-green-400">
                Enough for a full team — a random free agent squad forms at
                check-in as{" "}
                <span className="font-semibold">
                  {nextFreeAgentTeamName(teams.map((t) => t.name))}
                </span>
                .
              </p>
            )}
            <p className="mt-2 text-xs leading-5 text-muted">
              Leftover free agents fill incomplete rosters at puck drop.
            </p>
          </div>
        </aside>

        {/* Right — teams & bracket */}
        <section className="min-w-0 flex-1">
          {/* Tabs */}
          <div
            className="flex gap-8 border-b border-steel-dark/50"
            role="tablist"
            aria-label="Tournament hub view"
          >
            {(
              [
                { value: "teams", label: "Teams" },
                { value: "bracket", label: "Bracket" },
              ] as const
            ).map(({ value, label }) => (
              <button
                key={value}
                role="tab"
                aria-selected={tab === value}
                onClick={() => setTab(value)}
                className={`-mb-px border-b-2 pb-3 text-xs font-semibold tracking-[0.25em] uppercase transition-colors ${
                  tab === value
                    ? "border-steel text-steel-bright"
                    : "border-transparent text-muted hover:text-steel"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === "teams" && (
            <div className="mt-8">
              <TeamShowcase teams={teams} />
              <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-5 text-muted">
                Check-in opens 45 minutes before puck drop — 7:15 PM EST (4:15
                PM PST). Teams that don&apos;t check in lose their spot to
                free agents.
              </p>
            </div>
          )}

          {tab === "bracket" && (
            <div className="mt-8">
              {/* Demo-only phase switcher, removed once real states exist */}
              <div className="flex items-center justify-center gap-2">
                <span className="text-[10px] tracking-[0.2em] text-muted uppercase">
                  Preview (demo):
                </span>
                {phases.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setPhase(value)}
                    className={`border px-3 py-1 text-[10px] font-semibold tracking-[0.15em] uppercase transition-colors ${
                      phase === value
                        ? "border-steel bg-charcoal text-steel-bright"
                        : "border-steel-dark text-muted hover:text-steel"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {phase === "registration" && (
                <div className="mt-12 flex flex-col items-center gap-3 text-center">
                  <p className="font-display text-lg font-semibold tracking-[0.2em] text-steel-bright uppercase">
                    Bracket reveals at puck drop
                  </p>
                  <p className="max-w-md text-xs leading-5 text-muted">
                    Once every team is checked in, the bracket is randomly
                    generated just before 8:00 PM EST — matchups and byes are
                    pure luck of the draw. Until then, scout the competition
                    in the Teams tab.
                  </p>
                </div>
              )}

              {phase === "live" && (
                <div className="mt-8">
                  <Bracket
                    columns={liveColumns}
                    teams={teams}
                    matchHref={(match) => `/bracket/${match.id}`}
                  />
                  <p className="mt-2 text-center text-xs text-muted">
                    Click your match to open its match room and chat.
                  </p>
                </div>
              )}

              {phase === "complete" && (
                <div className="mt-8">
                  <div className="steel-frame mx-auto mb-8 w-full max-w-md bg-card p-6 text-center">
                    <p className="text-[10px] tracking-[0.3em] text-muted uppercase">
                      RMR Open #{currentTournament.number} Champions
                    </p>
                    <p className="font-display mt-2 text-2xl font-bold tracking-[0.1em] text-steel-bright uppercase">
                      Ice Reapers
                    </p>
                  </div>
                  <Bracket
                    columns={completeColumns}
                    teams={teams}
                    matchHref={(match) => `/bracket/${match.id}`}
                  />
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
