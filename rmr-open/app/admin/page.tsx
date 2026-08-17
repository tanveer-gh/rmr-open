"use client";

import { useState } from "react";
import AdminGate from "@/components/AdminGate";
import { organizers as seedOrganizers, type Organizer } from "@/lib/organizers";
import { STEAM_ID64_RE } from "@/lib/site";
import {
  matches as seedMatches,
  teams as seedTeams,
  scoreDisputes as seedDisputes,
  freeAgents,
  getTeam,
  hasFullFreeAgentTeam,
  nextFreeAgentTeamName,
  type Match,
  type Team,
  type ScoreDispute,
} from "@/lib/tournament";

const inputClasses =
  "w-14 border border-steel-dark bg-abyss px-2 py-1.5 text-center text-sm text-steel-bright focus:border-steel focus:outline-none";

const textInput =
  "border border-steel-dark bg-abyss px-3 py-2 text-sm text-steel-bright placeholder:text-muted/60 focus:border-steel focus:outline-none";

type Phase = "registration" | "live" | "complete";

const phaseActions: { value: Phase; label: string }[] = [
  { value: "registration", label: "Registration Open" },
  { value: "live", label: "Seed & Start Bracket" },
  { value: "complete", label: "Mark Complete" },
];

function SectionFrame({
  title,
  children,
  aside,
}: {
  title: string;
  children: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <section className="steel-frame mt-6 bg-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-sm font-semibold tracking-[0.25em] text-steel uppercase">
          {title}
        </h2>
        {aside}
      </div>
      {children}
    </section>
  );
}

export default function AdminPage() {
  const [phase, setPhase] = useState<Phase>("registration");
  const [teams, setTeams] = useState(seedTeams);
  const [withdrawn, setWithdrawn] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>(seedMatches);
  const [disputes, setDisputes] = useState<ScoreDispute[]>(seedDisputes);
  const [organizers, setOrganizers] = useState<Organizer[]>(seedOrganizers);
  const [newOrganizer, setNewOrganizer] = useState({ steamId: "", name: "" });
  const [organizerError, setOrganizerError] = useState("");
  const [poolSeated, setPoolSeated] = useState(false);

  const reseed = (list: Team[]) => list.map((t, i) => ({ ...t, seed: i + 1 }));

  const moveSeed = (index: number, dir: -1 | 1) => {
    setTeams((prev) => {
      const next = [...prev];
      const j = index + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[index], next[j]] = [next[j], next[index]];
      return reseed(next);
    });
  };

  // State updaters must stay pure — compute the moving team first, then
  // issue the two updates as siblings (StrictMode double-invokes updaters).
  const withdrawTeam = (id: string) => {
    const team = teams.find((t) => t.id === id);
    if (!team) return;
    setTeams((prev) => reseed(prev.filter((t) => t.id !== id)));
    setWithdrawn((prev) => [...prev, team]);
  };

  const restoreTeam = (id: string) => {
    const team = withdrawn.find((t) => t.id === id);
    if (!team) return;
    setWithdrawn((prev) => prev.filter((t) => t.id !== id));
    setTeams((prev) => reseed([...prev, team]));
  };

  const seatFreeAgentSquad = () => {
    // A squad is exactly 4 skaters + 1 goalie (a true goalie beats a Flex);
    // everyone else stays in the pool to fill short rosters.
    const goalie =
      freeAgents.find((a) => a.position === "Goalie") ??
      freeAgents.find((a) => a.position === "Flex");
    if (!goalie) return;
    const skaters = freeAgents
      .filter((a) => a !== goalie && a.position !== "Goalie")
      .slice(0, 4);
    if (skaters.length < 4) return;
    const lineup = [...skaters, goalie];
    setTeams((prev) => {
      const name = nextFreeAgentTeamName(prev.map((t) => t.name));
      const squad: Team = {
        id: "free-agent-squad",
        name,
        seed: prev.length + 1,
        checkedIn: true,
        players: lineup.map((agent, i) => ({
          name: agent.name,
          position:
            agent.position === "Goalie"
              ? "Goalie"
              : agent.position === "Flex"
                ? "Flex"
                : "Skater",
          captain: i === 0,
        })),
      };
      return reseed([...prev, squad]);
    });
    setPoolSeated(true);
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

  const resolveDispute = (
    dispute: ScoreDispute,
    accepted: "reportA" | "reportB",
  ) => {
    const { scoreA, scoreB } = dispute[accepted];
    setMatches((prev) =>
      prev.map((m) =>
        m.id === dispute.matchId ? { ...m, scoreA, scoreB, status: "final" } : m,
      ),
    );
    setDisputes((prev) => prev.filter((d) => d.matchId !== dispute.matchId));
  };

  const addOrganizer = () => {
    const steamId = newOrganizer.steamId.trim();
    if (!STEAM_ID64_RE.test(steamId)) {
      setOrganizerError("That doesn't look like a SteamID64 — it's 17 digits.");
      return;
    }
    if (organizers.some((o) => o.steamId === steamId)) {
      setOrganizerError("That Steam ID is already on the list.");
      return;
    }
    setOrganizers((prev) => [
      ...prev,
      { steamId, name: newOrganizer.name.trim() || "Organizer" },
    ]);
    setNewOrganizer({ steamId: "", name: "" });
    setOrganizerError("");
  };

  return (
    <AdminGate>
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
          Demo preview. At launch every action writes to the database and
          access runs through the Steam ID list below.
        </p>

        {/* Phase control */}
        <SectionFrame title="Tournament Phase">
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
            Registration open → teams can sign up. Seed &amp; start → bracket
            is generated from the seeding below and goes live. Complete →
            results are archived to History.
          </p>
        </SectionFrame>

        {/* Registrations & bracket generation */}
        <SectionFrame
          title="Registrations"
          aside={
            <span className="flex items-center gap-3">
              <span className="text-xs text-muted">{teams.length} teams</span>
              <button
                onClick={() =>
                  setTeams((prev) => {
                    const shuffled = [...prev];
                    for (let i = shuffled.length - 1; i > 0; i--) {
                      const j = Math.floor(Math.random() * (i + 1));
                      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                    }
                    return reseed(shuffled);
                  })
                }
                className="steel-frame bg-charcoal/60 px-4 py-2 text-[10px] font-semibold tracking-[0.2em] text-steel uppercase transition-colors hover:bg-charcoal hover:text-steel-bright"
              >
                🎲 Generate Random Bracket
              </button>
            </span>
          }
        >
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
                    onClick={() => withdrawTeam(team.id)}
                    aria-label={`Withdraw ${team.name}`}
                    className="border border-steel-dark px-2 py-1 text-[10px] tracking-[0.1em] text-muted uppercase transition-colors hover:border-blade-red/60 hover:text-blade-red"
                  >
                    Withdraw
                  </button>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs leading-5 text-muted">
            The bracket is randomly generated once all teams are checked in
            (~7:55 PM EST) — the dice button previews the shuffle; at launch
            it runs automatically and creates a match room with chat for each
            pairing. Byes fall wherever the draw lands them. Arrows allow a
            manual override if something needs fixing.
          </p>
        </SectionFrame>

        {/* Withdrawals & replacements */}
        <SectionFrame
          title="Withdrawals & Replacements"
          aside={
            <span className="text-xs text-muted">
              {freeAgents.length} free agents in the pool
            </span>
          }
        >
          {withdrawn.length === 0 ? (
            <p className="mt-4 text-xs leading-5 text-muted">
              No withdrawals this week. When a team withdraws (or misses
              check-in), it appears here so its spot can be restored or
              refilled.
            </p>
          ) : (
            <ul className="mt-4 flex flex-col">
              {withdrawn.map((team) => (
                <li
                  key={team.id}
                  className="flex items-center justify-between gap-3 border-b border-steel-dark/30 py-2.5 last:border-b-0"
                >
                  <span className="truncate text-sm text-muted line-through">
                    {team.name}
                  </span>
                  <button
                    onClick={() => restoreTeam(team.id)}
                    className="border border-steel-dark px-3 py-1 text-[10px] tracking-[0.1em] text-muted uppercase transition-colors hover:border-steel hover:text-steel"
                  >
                    Restore
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={seatFreeAgentSquad}
              disabled={poolSeated || !hasFullFreeAgentTeam(freeAgents)}
              className="steel-frame bg-charcoal/60 px-4 py-2 text-[10px] font-semibold tracking-[0.2em] text-steel uppercase transition-colors hover:bg-charcoal hover:text-steel-bright disabled:cursor-not-allowed disabled:opacity-40"
            >
              Seat a free-agent squad
            </button>
            <span className="text-xs text-muted">
              {poolSeated
                ? `Squad seated (4 skaters + 1 goalie) — ${freeAgents.length - 5} left in the pool to fill short rosters.`
                : hasFullFreeAgentTeam(freeAgents)
                  ? "Pool holds a full lineup — name comes from the preset list."
                  : "Needs 4 skaters + 1 goalie in the pool."}
            </span>
          </div>
        </SectionFrame>

        {/* Score disputes */}
        <SectionFrame
          title="Score Disputes"
          aside={
            disputes.length > 0 ? (
              <span className="text-xs font-semibold tracking-[0.15em] text-blade-red uppercase">
                {disputes.length} open
              </span>
            ) : undefined
          }
        >
          {disputes.length === 0 ? (
            <p className="mt-4 text-xs leading-5 text-muted">
              No open disputes. When both captains report different scores,
              the match lands here for a ruling.
            </p>
          ) : (
            <ul className="mt-4 flex flex-col gap-4">
              {disputes.map((dispute) => {
                const match = matches.find((m) => m.id === dispute.matchId);
                const a = getTeam(match?.teamA ?? null);
                const b = getTeam(match?.teamB ?? null);
                return (
                  <li
                    key={dispute.matchId}
                    className="border border-blade-red/40 p-4"
                  >
                    <p className="text-xs font-semibold tracking-[0.2em] text-steel-bright uppercase">
                      {a?.name ?? "TBD"} vs {b?.name ?? "TBD"}
                      <span className="ml-2 text-[10px] text-muted">
                        ({dispute.matchId})
                      </span>
                    </p>
                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {(["reportA", "reportB"] as const).map((key) => (
                        <div
                          key={key}
                          className="flex items-center justify-between gap-3 border border-steel-dark/60 p-3"
                        >
                          <span className="min-w-0">
                            <span className="block truncate text-xs text-muted">
                              {dispute[key].by}
                            </span>
                            <span className="text-sm font-semibold text-steel-bright tabular-nums">
                              {dispute[key].scoreA} – {dispute[key].scoreB}
                            </span>
                          </span>
                          <button
                            onClick={() => resolveDispute(dispute, key)}
                            className="shrink-0 border border-steel-dark px-3 py-1.5 text-[10px] tracking-[0.15em] text-steel uppercase transition-colors hover:border-steel hover:text-steel-bright"
                          >
                            Accept
                          </button>
                        </div>
                      ))}
                    </div>
                    <p className="mt-2 text-xs leading-5 text-muted">
                      Accepting a report finalizes the match with that score.
                      Check the captains&apos; scoreboard screenshots first.
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </SectionFrame>

        {/* Score entry */}
        <SectionFrame title="Match Results">
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
            Marking a match final advances the winner to the next round once
            the database is connected.
          </p>
        </SectionFrame>

        {/* Organizer access */}
        <SectionFrame title="Organizer Access">
          <p className="mt-3 text-xs leading-5 text-muted">
            Everyone on this list gets the admin console automatically once
            Steam sign-in is live — no passcode needed. Until then, share the
            passcode only with people listed here, and change it before
            launch.
          </p>
          <ul className="mt-4 flex flex-col">
            {organizers.map((organizer) => (
              <li
                key={organizer.steamId}
                className="flex items-center justify-between gap-3 border-b border-steel-dark/30 py-2.5 last:border-b-0"
              >
                <span className="flex min-w-0 items-baseline gap-3">
                  <span className="truncate text-sm text-steel-bright">
                    {organizer.name}
                  </span>
                  <span className="truncate font-mono text-xs text-muted">
                    {organizer.steamId}
                  </span>
                  {organizer.owner && (
                    <span className="shrink-0 text-[10px] tracking-[0.2em] text-teal uppercase">
                      Owner
                    </span>
                  )}
                </span>
                {!organizer.owner && (
                  <button
                    onClick={() =>
                      setOrganizers((prev) =>
                        prev.filter((o) => o.steamId !== organizer.steamId),
                      )
                    }
                    className="border border-steel-dark px-2 py-1 text-[10px] tracking-[0.1em] text-muted uppercase transition-colors hover:border-blade-red/60 hover:text-blade-red"
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
          <form
            className="mt-4 flex flex-col gap-2 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              addOrganizer();
            }}
          >
            <input
              value={newOrganizer.steamId}
              onChange={(e) =>
                setNewOrganizer((p) => ({ ...p, steamId: e.target.value }))
              }
              placeholder="SteamID64 (17 digits)"
              aria-label="New organizer SteamID64"
              className={`${textInput} flex-1 font-mono`}
            />
            <input
              value={newOrganizer.name}
              onChange={(e) =>
                setNewOrganizer((p) => ({ ...p, name: e.target.value }))
              }
              placeholder="Name"
              aria-label="New organizer name"
              className={`${textInput} flex-1`}
            />
            <button
              type="submit"
              className="steel-frame bg-charcoal/60 px-4 py-2 text-[10px] font-semibold tracking-[0.2em] text-steel uppercase transition-colors hover:bg-charcoal hover:text-steel-bright"
            >
              Add organizer
            </button>
          </form>
          {organizerError && (
            <p className="mt-2 text-xs text-blade-red">{organizerError}</p>
          )}
          <p className="mt-2 text-xs text-muted">
            Find a SteamID64 at steamcommunity.com → profile → Edit Profile,
            or via steamid.io.
          </p>
        </SectionFrame>
      </main>
    </AdminGate>
  );
}
