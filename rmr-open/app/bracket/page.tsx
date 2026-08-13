"use client";

import { useState } from "react";
import Bracket, { type BracketColumn } from "@/components/Bracket";
import {
  currentTournament,
  matches,
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

export default function BracketPage() {
  const [phase, setPhase] = useState<TournamentPhase>(currentTournament.phase);

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <div className="flex items-center gap-6">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-steel-dark" />
        <h1 className="font-display text-3xl font-bold tracking-[0.15em] text-steel-bright uppercase">
          Bracket
        </h1>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-steel-dark" />
      </div>
      <p className="mt-3 text-center text-xs tracking-[0.3em] text-muted uppercase">
        RMR Open #{currentTournament.number} — {currentTournament.date}
      </p>

      {/* Demo-only phase switcher, removed once real tournament states exist */}
      <div className="mt-8 flex items-center justify-center gap-2">
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
        <section className="mx-auto mt-10 w-full max-w-2xl">
          <div className="steel-frame bg-card p-6">
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-sm font-semibold tracking-[0.25em] text-steel uppercase">
                Registered Teams
              </h2>
              <span className="text-xs text-muted">{teams.length} teams</span>
            </div>
            <ul className="mt-4 flex flex-col">
              {teams.map((team) => (
                <li
                  key={team.id}
                  className="flex items-center justify-between border-b border-steel-dark/30 py-3 last:border-b-0"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-5 text-right text-xs text-muted">
                      {team.seed}
                    </span>
                    <span className="text-sm text-steel-bright">
                      {team.name}
                    </span>
                  </span>
                  <span
                    className={`flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase ${
                      team.checkedIn ? "text-teal" : "text-muted"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        team.checkedIn ? "bg-teal" : "bg-steel-dark"
                      }`}
                    />
                    {team.checkedIn ? "Checked in" : "Not checked in"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-4 text-center text-xs leading-5 text-muted">
            Check-in opens 45 minutes before puck drop — 7:15 PM EST (4:15 PM
            PST). Teams that don&apos;t
            check in lose their spot to free agents. Seeding and the bracket
            are revealed at 8:00 PM EST.
          </p>
        </section>
      )}

      {phase === "live" && (
        <section className="mt-10">
          <Bracket columns={liveColumns} teams={teams} />
        </section>
      )}

      {phase === "complete" && (
        <section className="mt-10">
          <div className="steel-frame mx-auto mb-8 w-full max-w-md bg-card p-6 text-center">
            <p className="text-[10px] tracking-[0.3em] text-muted uppercase">
              RMR Open #{currentTournament.number} Champions
            </p>
            <p className="font-display mt-2 text-2xl font-bold tracking-[0.1em] text-steel-bright uppercase">
              Ice Reapers
            </p>
          </div>
          <Bracket columns={completeColumns} teams={teams} />
        </section>
      )}
    </main>
  );
}
