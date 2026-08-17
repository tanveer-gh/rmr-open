"use client";

import Link from "next/link";
import { useState } from "react";
import { DISCORD_INVITE, STEAM_ID64_RE, steamProfileUrl } from "@/lib/site";
import {
  currentTournament,
  findLiveMatch,
  freeAgents,
  isTournamentLive,
  roundName,
  getTeam,
} from "@/lib/tournament";

// Demo data — becomes the viewer's real registration once the database
// exists. The role switcher previews what each kind of player sees here;
// Steam sign-in will pick the role automatically.
type RosterPlayer = {
  name: string;
  steam: string;
  discord: string;
  position: string;
  captain?: boolean;
};

type Role = "captain" | "teammate" | "free-agent";

const MIN_PLAYERS = 5;
const MAX_PLAYERS = 8;
const POSITIONS = ["Skater", "Goalie", "Flex"] as const;
const viewerTeamId = "ice-reapers";

const initialRoster: RosterPlayer[] = [
  { name: "YourSteamName", steam: "steamcommunity.com/id/YourSteamName", discord: "reapermain", position: "Skater", captain: true },
  { name: "Teammate2", steam: "steamcommunity.com/id/Teammate2", discord: "topshelf", position: "Skater" },
  { name: "Teammate3", steam: "steamcommunity.com/id/Teammate3", discord: "fivehole", position: "Skater" },
  { name: "Teammate4", steam: "steamcommunity.com/id/Teammate4", discord: "bluepaint", position: "Skater" },
  { name: "Teammate5", steam: "steamcommunity.com/id/Teammate5", discord: "brickwall", position: "Goalie" },
];

const underlineInput =
  "w-full border-0 border-b border-steel-dark/60 bg-transparent px-0 py-1 text-sm text-steel-bright placeholder:text-muted/50 focus:border-steel focus:outline-none";

function CheckInReminder() {
  if (currentTournament.phase !== "registration") return null;
  return (
    <div className="steel-frame mt-8 flex flex-col gap-1 bg-card p-4 text-left">
      <p className="text-xs font-semibold tracking-[0.2em] text-steel uppercase">
        Check-in opens 7:15 PM EST Saturday
      </p>
      <p className="text-xs leading-5 text-muted">
        Closes at 8:00 sharp — unchecked teams lose their spot to free
        agents. Reminders go out in the{" "}
        <a
          href={DISCORD_INVITE}
          target="_blank"
          rel="noopener noreferrer"
          className="text-steel underline underline-offset-4 transition-colors hover:text-steel-bright"
        >
          Discord
        </a>{" "}
        when the window opens.
      </p>
    </div>
  );
}

function LiveMatchCard() {
  // Real derivation: renders only while the tournament is running and this
  // team has a live match — no more hardcoded always-on card.
  const match = isTournamentLive() ? findLiveMatch(viewerTeamId) : undefined;
  if (!match) return null;
  const opponentId = match.teamA === viewerTeamId ? match.teamB : match.teamA;
  const opponent = getTeam(opponentId);
  return (
    <Link
      href={`/bracket/${match.id}`}
      className="steel-frame mt-6 flex items-center justify-between gap-4 bg-card p-5 transition-colors hover:bg-charcoal"
    >
      <span>
        <span className="block text-[10px] tracking-[0.3em] text-blade-red uppercase">
          ● Live — Your match
        </span>
        <span className="font-display mt-1 block text-lg font-bold tracking-[0.1em] text-steel-bright uppercase">
          {roundName(match.round, 3)} vs {opponent?.name ?? "TBD"}
        </span>
      </span>
      <span className="shrink-0 text-xs font-semibold tracking-[0.2em] text-steel uppercase">
        Match room →
      </span>
    </Link>
  );
}

function RoleSwitcher({
  role,
  setRole,
}: {
  role: Role;
  setRole: (r: Role) => void;
}) {
  return (
    <div className="mb-10 flex flex-wrap items-center gap-2">
      <span className="text-[10px] tracking-[0.2em] text-muted uppercase">
        Preview as (demo — Steam sign-in decides this at launch):
      </span>
      {(
        [
          { value: "captain", label: "Captain" },
          { value: "teammate", label: "Teammate" },
          { value: "free-agent", label: "Free Agent" },
        ] as const
      ).map(({ value, label }) => (
        <button
          key={value}
          onClick={() => setRole(value)}
          className={`border px-3 py-1 text-[10px] font-semibold tracking-[0.15em] uppercase transition-colors ${
            role === value
              ? "border-steel bg-charcoal text-steel-bright"
              : "border-steel-dark text-muted hover:text-steel"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function FreeAgentView() {
  const [left, setLeft] = useState(false);
  const position = "Flex (Skater + Goalie)";

  if (left) {
    return (
      <div>
        <h1 className="font-display text-4xl font-bold tracking-[0.1em] text-steel-bright uppercase">
          Out of the pool
        </h1>
        <p className="mt-4 max-w-md text-sm leading-6 text-muted">
          You&apos;ve left the free-agent pool for RMR Open #
          {currentTournament.number}. Changed your mind? Register again any
          time before check-in closes.
        </p>
        <Link
          href="/register"
          className="mt-8 inline-block text-xs tracking-[0.2em] text-muted uppercase transition-colors hover:text-steel"
        >
          ← Back to registration
        </Link>
      </div>
    );
  }

  return (
    <div>
      <p className="text-[10px] tracking-[0.35em] text-muted uppercase">
        Free agent — RMR Open #{currentTournament.number}
      </p>
      <h1 className="mt-2 font-display text-4xl font-bold tracking-[0.1em] text-steel-bright uppercase sm:text-5xl">
        In the pool
      </h1>
      <p className="mt-4 max-w-md text-sm leading-6 text-muted">
        You&apos;re signed up as{" "}
        <span className="text-steel-bright">{position}</span> with{" "}
        {freeAgents.length - 1} other free agents. Be ready Saturday at 8:00
        PM EST — call-ups happen at check-in.
      </p>

      <div className="steel-frame mt-8 max-w-md bg-card p-5 text-left">
        <p className="text-xs font-semibold tracking-[0.2em] text-steel uppercase">
          How call-ups work
        </p>
        <ul className="mt-3 flex list-disc flex-col gap-2 pl-4 text-sm leading-6 text-muted">
          <li>
            If the pool holds a full lineup (4 skaters + 1 goalie), a random
            free-agent squad forms at check-in with a name from the preset
            list.
          </li>
          <li>Everyone left fills incomplete rosters at puck drop.</li>
          <li>A spot isn&apos;t guaranteed — but committing means being available.</li>
        </ul>
      </div>

      <CheckInReminder />
      <LiveMatchCard />

      <div className="mt-16">
        <button
          onClick={() => setLeft(true)}
          className="text-[10px] tracking-[0.2em] text-muted uppercase transition-colors hover:text-blade-red"
        >
          Leave the pool
        </button>
      </div>
    </div>
  );
}

function TeammateView({ roster }: { roster: RosterPlayer[] }) {
  return (
    <div>
      <p className="text-[10px] tracking-[0.35em] text-muted uppercase">
        Your team — RMR Open #{currentTournament.number} · Seed 1
      </p>
      <h1 className="mt-2 font-display text-4xl font-bold tracking-[0.1em] text-steel-bright uppercase sm:text-5xl">
        Ice Reapers
      </h1>
      <p className="mt-3 text-xs leading-5 text-muted">
        Your captain manages the roster and checks the team in. You just show
        up Saturday — signed into Steam so the match chat recognizes you.
      </p>

      <CheckInReminder />
      <LiveMatchCard />

      {/* Read-only roster */}
      <div className="mt-12 flex flex-col gap-6">
        {roster.map((player, index) => (
          <div key={index} className="flex items-baseline justify-between gap-4 border-b border-steel-dark/30 pb-4">
            <div>
              <p className="text-lg font-semibold text-steel-bright">
                {player.name}
                {player.captain && (
                  <span className="ml-3 text-[10px] tracking-[0.25em] text-muted uppercase">
                    Captain
                  </span>
                )}
              </p>
              <p className="mt-1 text-xs text-muted">
                {player.position} · {player.discord}
              </p>
            </div>
            <a
              href={steamProfileUrl(player.steam)}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-xs text-muted transition-colors hover:text-steel"
            >
              Steam ↗
            </a>
          </div>
        ))}
      </div>
      <p className="mt-6 text-xs text-muted">
        Something wrong with your entry? Ask your captain to fix it.
      </p>
    </div>
  );
}

export default function TeamPage() {
  const [role, setRole] = useState<Role>("captain");
  const [teamName, setTeamName] = useState("Ice Reapers");
  const [renaming, setRenaming] = useState(false);
  const [roster, setRoster] = useState(initialRoster);
  const [checkedIn, setCheckedIn] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newPlayer, setNewPlayer] = useState({ steam: "", discord: "", position: "Skater" });
  const [addError, setAddError] = useState("");
  const [confirmingWithdraw, setConfirmingWithdraw] = useState(false);
  const [withdrawn, setWithdrawn] = useState(false);

  const update = (index: number, field: keyof RosterPlayer, value: string) => {
    setRoster((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)),
    );
  };

  const removePlayer = (index: number) => {
    setRoster((prev) => prev.filter((_, i) => i !== index));
  };

  const addPlayer = () => {
    const ref = newPlayer.steam.trim();
    if (!ref) return;
    if (
      roster.some((p) => p.steam.trim().toLowerCase() === ref.toLowerCase())
    ) {
      setAddError("That player is already on the roster.");
      return;
    }
    // Accept a profile link or a bare SteamID64; the display name becomes
    // the real Steam persona once auth is wired up.
    const handle = STEAM_ID64_RE.test(ref)
      ? `ID ${ref.slice(0, 5)}…${ref.slice(-4)}`
      : (ref.split("/").filter(Boolean).pop() ?? "NewPlayer");
    setRoster((prev) => [...prev, { ...newPlayer, steam: ref, name: handle }]);
    setNewPlayer({ steam: "", discord: "", position: "Skater" });
    setAddError("");
    setAdding(false);
  };

  if (role !== "captain") {
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
        <RoleSwitcher role={role} setRole={setRole} />
        {role === "teammate" ? (
          <TeammateView roster={roster} />
        ) : (
          <FreeAgentView />
        )}
      </main>
    );
  }

  if (withdrawn) {
    return (
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-start justify-center px-6 py-16">
        <h1 className="font-display text-4xl font-bold tracking-[0.1em] text-steel-bright uppercase">
          {teamName}
        </h1>
        <p className="mt-4 max-w-md text-sm leading-6 text-muted">
          Withdrawn from RMR Open #{currentTournament.number}. Your spot is
          released: the organizers may seat a full free-agent squad in it or
          hand it to another team. Your roster is kept, so re-registering
          before check-in closes takes one click.
        </p>
        <div className="mt-8 flex items-center gap-6">
          <Link
            href="/register"
            className="text-xs tracking-[0.2em] text-steel uppercase underline underline-offset-4 transition-colors hover:text-steel-bright"
          >
            Re-register
          </Link>
          <button
            onClick={() => {
              setWithdrawn(false);
              setConfirmingWithdraw(false);
            }}
            className="text-xs tracking-[0.2em] text-muted uppercase transition-colors hover:text-steel"
          >
            Undo withdraw (demo)
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
      <RoleSwitcher role={role} setRole={setRole} />

      {/* Team name */}
      <p className="text-[10px] tracking-[0.35em] text-muted uppercase">
        Your team — RMR Open #{currentTournament.number} · Seed 1
      </p>
      {renaming ? (
        <input
          autoFocus
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          onBlur={() => setRenaming(false)}
          onKeyDown={(e) => e.key === "Enter" && setRenaming(false)}
          className="mt-2 w-full border-0 border-b border-steel bg-transparent px-0 font-display text-4xl font-bold tracking-[0.1em] text-steel-bright uppercase focus:outline-none sm:text-5xl"
        />
      ) : (
        <h1 className="mt-2 font-display text-4xl font-bold tracking-[0.1em] text-steel-bright uppercase sm:text-5xl">
          {teamName}
        </h1>
      )}
      <div className="mt-3">
        <button
          onClick={() => setRenaming(true)}
          className="text-[10px] tracking-[0.2em] text-muted uppercase transition-colors hover:text-steel"
        >
          Rename
        </button>
      </div>

      {/* Check-in — red until checked in, green after */}
      <button
        onClick={() => setCheckedIn(true)}
        disabled={checkedIn}
        className={`mt-8 border-2 px-10 py-4 text-lg font-bold tracking-[0.25em] uppercase transition-colors ${
          checkedIn
            ? "cursor-default border-green-500 bg-green-500/10 text-green-400"
            : "border-blade-red bg-blade-red/10 text-blade-red hover:bg-blade-red/20"
        }`}
      >
        {checkedIn ? "✓ Checked In" : "Check In"}
      </button>

      <CheckInReminder />
      <LiveMatchCard />

      {/* Roster */}
      <div className="mt-12 flex flex-col gap-8">
        {roster.map((player, index) => (
          <div key={index} className="group">
            <div className="flex items-baseline justify-between gap-4">
              <p className="text-lg font-semibold text-steel-bright">
                {player.name}
                {player.captain && (
                  <span className="ml-3 text-[10px] tracking-[0.25em] text-muted uppercase">
                    Captain
                  </span>
                )}
              </p>
              {!player.captain && (
                <button
                  onClick={() => removePlayer(index)}
                  disabled={roster.length <= MIN_PLAYERS}
                  title={
                    roster.length <= MIN_PLAYERS
                      ? `Rosters need at least ${MIN_PLAYERS} players`
                      : undefined
                  }
                  className="text-[10px] tracking-[0.2em] text-muted uppercase transition-colors hover:text-blade-red disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Remove
                </button>
              )}
            </div>
            <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <input
                value={player.discord}
                onChange={(e) => update(index, "discord", e.target.value)}
                aria-label={`${player.name} Discord username`}
                placeholder="Discord username"
                className={underlineInput}
              />
              <select
                value={player.position}
                onChange={(e) => update(index, "position", e.target.value)}
                aria-label={`${player.name} position`}
                className={`${underlineInput} cursor-pointer`}
              >
                {POSITIONS.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
              <a
                href={steamProfileUrl(player.steam)}
                target="_blank"
                rel="noopener noreferrer"
                className="self-end pb-1 text-xs text-muted transition-colors hover:text-steel"
              >
                Steam profile ↗
              </a>
            </div>
          </div>
        ))}

        {/* Add player */}
        {adding ? (
          <div>
            <p className="text-lg font-semibold text-muted">New player</p>
            <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <input
                autoFocus
                value={newPlayer.steam}
                onChange={(e) =>
                  setNewPlayer((p) => ({ ...p, steam: e.target.value }))
                }
                placeholder="Steam profile link or SteamID64"
                className={underlineInput}
              />
              <input
                value={newPlayer.discord}
                onChange={(e) =>
                  setNewPlayer((p) => ({ ...p, discord: e.target.value }))
                }
                placeholder="Discord username"
                className={underlineInput}
              />
              <select
                value={newPlayer.position}
                onChange={(e) =>
                  setNewPlayer((p) => ({ ...p, position: e.target.value }))
                }
                className={`${underlineInput} cursor-pointer`}
              >
                {POSITIONS.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>
            {addError && (
              <p className="mt-3 text-xs text-blade-red">{addError}</p>
            )}
            <div className="mt-4 flex items-center gap-5">
              <button
                onClick={addPlayer}
                className="text-[10px] tracking-[0.2em] text-steel-bright uppercase underline underline-offset-4 transition-colors hover:text-teal"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setAdding(false);
                  setAddError("");
                }}
                className="text-[10px] tracking-[0.2em] text-muted uppercase transition-colors hover:text-steel"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          roster.length < MAX_PLAYERS && (
            <button
              onClick={() => setAdding(true)}
              className="self-start text-xs tracking-[0.2em] text-muted uppercase transition-colors hover:text-steel"
            >
              + Add player ({MAX_PLAYERS - roster.length} spots left)
            </button>
          )
        )}
      </div>

      {/* Footer actions */}
      <div className="mt-16 flex items-center justify-between">
        <p className="text-xs text-muted">
          {roster.length} / {MAX_PLAYERS} players · changes save automatically
          at launch
        </p>
        {confirmingWithdraw ? (
          <span className="flex items-center gap-4">
            <button
              onClick={() => setWithdrawn(true)}
              className="text-[10px] tracking-[0.2em] text-blade-red uppercase underline underline-offset-4"
            >
              Confirm withdraw
            </button>
            <button
              onClick={() => setConfirmingWithdraw(false)}
              className="text-[10px] tracking-[0.2em] text-muted uppercase hover:text-steel"
            >
              Cancel
            </button>
          </span>
        ) : (
          <button
            onClick={() => setConfirmingWithdraw(true)}
            className="text-[10px] tracking-[0.2em] text-muted uppercase transition-colors hover:text-blade-red"
          >
            Withdraw team
          </button>
        )}
      </div>
    </main>
  );
}
