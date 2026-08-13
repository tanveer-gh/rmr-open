"use client";

import { useState } from "react";
import {
  matches as seedMatches,
  teams as seedTeams,
  getTeam,
  type Match,
} from "@/lib/tournament";

const inputClasses =
  "w-14 border border-steel-dark bg-abyss px-2 py-1.5 text-center text-sm text-steel-bright focus:border-steel focus:outline-none";

type Phase = "registration" | "live" | "complete";

const phaseActions: { value: Phase; label: string }[] = [
  { value: "registration", label: "Registration Open" },
  { value: "live", label: "Seed & Start Bracket" },
  { value: "complete", label: "Mark Complete" },
];

export default function AdminPage() {
  const [phase, setPhase] = useState<Phase>("registration");
  const [teams, setTeams] = useState(seedTeams);
  const [matches, setMatches] = useState<Match[]>(seedMatches);

  const moveSeed = (index: number, dir: -1 | 1) => {
    setTeams((prev) => {
      const next = [...prev];
      const j = index + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[index], next[j]] = [next[j], next[index]];
      return next.map((t, i) => ({ ...t, seed: i + 1 }));
    });
  };

  const removeTeam = (id: string) => {
    setTeams((prev) =>
      prev.filter((t) => t.id !== id).map((t, i) => ({ ...t, seed: i + 1 })),
    );
  };

  const setScore = (id: string, side: "scoreA" | "scoreB", value: string) => {
    const num = value === "" ? null : Number(value);
    setMatches((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [side]: num } : m)),
    );
  };

  const setStatus = (id: string, status: Match["status"]) => {
    setMatches((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status } : m)),
    );
  };

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
      <div className="flex items-center gap-6">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-steel-dark" />
        <h1 className="font-display text-3xl font-bold tracking-[0.15em] text-steel-bright uppercase">
          Admin
        </h1>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-steel-dark" />
      </div>
      <p className="mt-3 text-center text-xs tracking-[0.3em] text-muted uppercase">
        Organizer tools — RMR Open #4
      </p>
      <p className="mt-2 text-center text-xs text-muted">
        Demo preview. At launch this page is restricted to organizers and every
        action writes to the database.
      </p>

      {/* Phase control */}
      <section className="steel-frame mt-8 bg-card p-6">
        <h2 className="font-display text-sm font-semibold tracking-[0.25em] text-steel uppercase">
          Tournament Phase
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {phaseActions.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setPhase(value)}
              className={`border px-3 py-2.5 text-xs font-semibold tracking-[0.15em] uppercase transition-colors ${
                phase === value
                  ? "border-steel bg-charcoal text-steel-bright"
                  : "border-steel-dark text-muted hover:text-steel"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs leading-5 text-muted">
          Registration open → teams can sign up. Seed &amp; start → bracket is
          generated from the seeding below and goes live. Complete → results
          are archived to History.
        </p>
      </section>

      {/* Registrations & seeding */}
      <section className="steel-frame mt-6 bg-card p-6">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-sm font-semibold tracking-[0.25em] text-steel uppercase">
            Registrations &amp; Seeding
          </h2>
          <span className="text-xs text-muted">{teams.length} teams</span>
        </div>
        <ul className="mt-4 flex flex-col">
          {teams.map((team, index) => (
            <li
              key={team.id}
              className="flex items-center justify-between gap-3 border-b border-steel-dark/30 py-2.5 last:border-b-0"
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="w-5 shrink-0 text-right text-xs text-muted">
                  {team.seed}
                </span>
                <span className="truncate text-sm text-steel-bright">
                  {team.name}
                </span>
                <span
                  className={`hidden text-[10px] tracking-[0.15em] uppercase sm:inline ${
                    team.checkedIn ? "text-teal" : "text-muted"
                  }`}
                >
                  {team.checkedIn ? "Checked in" : "—"}
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-1.5">
                <button
                  onClick={() => moveSeed(index, -1)}
                  aria-label={`Move ${team.name} up`}
                  className="border border-steel-dark px-2 py-1 text-xs text-muted transition-colors hover:border-steel hover:text-steel"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveSeed(index, 1)}
                  aria-label={`Move ${team.name} down`}
                  className="border border-steel-dark px-2 py-1 text-xs text-muted transition-colors hover:border-steel hover:text-steel"
                >
                  ↓
                </button>
                <button
                  onClick={() => removeTeam(team.id)}
                  aria-label={`Remove ${team.name}`}
                  className="border border-steel-dark px-2 py-1 text-[10px] tracking-[0.1em] text-muted uppercase transition-colors hover:border-blade-red/60 hover:text-blade-red"
                >
                  Remove
                </button>
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs leading-5 text-muted">
          Order = seeding. Top seeds receive byes when the team count
          isn&apos;t a power of two. Free agent pool and roster details appear
          here with the database.
        </p>
      </section>

      {/* Score entry */}
      <section className="steel-frame mt-6 bg-card p-6">
        <h2 className="font-display text-sm font-semibold tracking-[0.25em] text-steel uppercase">
          Match Results
        </h2>
        <ul className="mt-4 flex flex-col gap-3">
          {matches.map((match) => {
            const a = getTeam(match.teamA);
            const b = getTeam(match.teamB);
            return (
              <li
                key={match.id}
                className="flex flex-col gap-2 border border-steel-dark/60 p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="text-[10px] tracking-[0.2em] text-muted uppercase">
                  {match.id}
                </span>
                <span className="flex items-center gap-2 text-sm">
                  <span className="w-32 truncate text-right text-steel-bright">
                    {a ? a.name : "TBD"}
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={match.scoreA ?? ""}
                    onChange={(e) => setScore(match.id, "scoreA", e.target.value)}
                    className={inputClasses}
                    aria-label={`${a?.name ?? "Team A"} score`}
                  />
                  <span className="text-muted">–</span>
                  <input
                    type="number"
                    min={0}
                    value={match.scoreB ?? ""}
                    onChange={(e) => setScore(match.id, "scoreB", e.target.value)}
                    className={inputClasses}
                    aria-label={`${b?.name ?? "Team B"} score`}
                  />
                  <span className="w-32 truncate text-steel-bright">
                    {b ? b.name : "TBD"}
                  </span>
                </span>
                <span className="flex items-center gap-1.5">
                  {(["upcoming", "live", "final"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatus(match.id, s)}
                      className={`border px-2 py-1 text-[10px] tracking-[0.1em] uppercase transition-colors ${
                        match.status === s
                          ? "border-steel bg-charcoal text-steel-bright"
                          : "border-steel-dark text-muted hover:text-steel"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </span>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 text-xs leading-5 text-muted">
          Marking a match final advances the winner to the next round once the
          database is connected.
        </p>
      </section>
    </main>
  );
}
