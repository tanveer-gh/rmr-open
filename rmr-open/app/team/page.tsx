"use client";

import Link from "next/link";
import { useState } from "react";

// Demo data — becomes the captain's real registration once the database exists.
type RosterPlayer = {
  name: string;
  steam: string;
  discord: string;
  position: string;
  captain?: boolean;
};

const MIN_PLAYERS = 5;
const MAX_PLAYERS = 8;
const POSITIONS = ["Skater", "Goalie", "Flex"] as const;

const initialRoster: RosterPlayer[] = [
  { name: "YourSteamName", steam: "steamcommunity.com/id/YourSteamName", discord: "reapermain", position: "Skater", captain: true },
  { name: "Teammate2", steam: "steamcommunity.com/id/Teammate2", discord: "topshelf", position: "Skater" },
  { name: "Teammate3", steam: "steamcommunity.com/id/Teammate3", discord: "fivehole", position: "Skater" },
  { name: "Teammate4", steam: "steamcommunity.com/id/Teammate4", discord: "bluepaint", position: "Skater" },
  { name: "Teammate5", steam: "steamcommunity.com/id/Teammate5", discord: "brickwall", position: "Goalie" },
];

const underlineInput =
  "w-full border-0 border-b border-steel-dark/60 bg-transparent px-0 py-1 text-sm text-steel-bright placeholder:text-muted/50 focus:border-steel focus:outline-none";

export default function TeamPage() {
  const [teamName, setTeamName] = useState("Ice Reapers");
  const [renaming, setRenaming] = useState(false);
  const [roster, setRoster] = useState(initialRoster);
  const [checkedIn, setCheckedIn] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newPlayer, setNewPlayer] = useState({ steam: "", discord: "", position: "Skater" });
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
    if (!newPlayer.steam) return;
    const handle = newPlayer.steam.split("/").filter(Boolean).pop() ?? "NewPlayer";
    setRoster((prev) => [...prev, { name: handle, ...newPlayer }]);
    setNewPlayer({ steam: "", discord: "", position: "Skater" });
    setAdding(false);
  };

  if (withdrawn) {
    return (
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-start justify-center px-6 py-16">
        <h1 className="font-display text-4xl font-bold tracking-[0.1em] text-steel-bright uppercase">
          {teamName}
        </h1>
        <p className="mt-4 text-sm text-muted">
          Withdrawn from RMR Open #4. Your spot may be given to another team or
          free agents.
        </p>
        <Link
          href="/register"
          className="mt-8 text-xs tracking-[0.2em] text-muted uppercase transition-colors hover:text-steel"
        >
          ← Back to registration
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
      {/* Team name */}
      <p className="text-[10px] tracking-[0.35em] text-muted uppercase">
        Your team — RMR Open #4 · Seed 1
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
      <div className="mt-3 flex items-center gap-5">
        <button
          onClick={() => setRenaming(true)}
          className="text-[10px] tracking-[0.2em] text-muted uppercase transition-colors hover:text-steel"
        >
          Rename
        </button>
        <span
          className={`text-[10px] tracking-[0.2em] uppercase ${checkedIn ? "text-teal" : "text-muted"}`}
        >
          {checkedIn ? "✓ Checked in" : "Not checked in"}
        </span>
        {!checkedIn && (
          <button
            onClick={() => setCheckedIn(true)}
            className="text-[10px] tracking-[0.2em] text-steel-bright uppercase underline underline-offset-4 transition-colors hover:text-teal"
          >
            Check in
          </button>
        )}
      </div>

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
                href={`https://${player.steam}`}
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
                placeholder="Steam profile link"
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
            <div className="mt-4 flex items-center gap-5">
              <button
                onClick={addPlayer}
                className="text-[10px] tracking-[0.2em] text-steel-bright uppercase underline underline-offset-4 transition-colors hover:text-teal"
              >
                Add
              </button>
              <button
                onClick={() => setAdding(false)}
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
