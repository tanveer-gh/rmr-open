"use client";

import { useState } from "react";

// Demo data — becomes the captain's real registration once the database exists.
type RosterPlayer = {
  name: string;
  discord: string;
  position: string;
};

const initialRoster: RosterPlayer[] = [
  { name: "YourSteamName", discord: "reapermain", position: "Skater" },
  { name: "Teammate2", discord: "topshelf", position: "Skater" },
  { name: "Teammate3", discord: "fivehole", position: "Skater" },
  { name: "Teammate4", discord: "bluepaint", position: "Skater" },
  { name: "Teammate5", discord: "brickwall", position: "Goalie" },
];

const POSITIONS = ["Skater", "Goalie", "Flex"] as const;

const inputClasses =
  "w-full border border-steel-dark bg-abyss px-3 py-2 text-sm text-steel-bright placeholder:text-muted/60 focus:border-steel focus:outline-none";

export default function ManageTeam({ onBack }: { onBack: () => void }) {
  const [roster, setRoster] = useState(initialRoster);
  const [checkedIn, setCheckedIn] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirmingWithdraw, setConfirmingWithdraw] = useState(false);
  const [withdrawn, setWithdrawn] = useState(false);

  const update = (index: number, field: keyof RosterPlayer, value: string) => {
    setSaved(false);
    setRoster((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)),
    );
  };

  if (withdrawn) {
    return (
      <div className="steel-frame mx-auto flex w-full max-w-md flex-col items-center gap-4 bg-card p-8">
        <h2 className="font-display text-xl font-semibold tracking-[0.2em] text-steel-bright uppercase">
          Team Withdrawn
        </h2>
        <p className="text-sm leading-6 text-muted">
          Ice Reapers has been withdrawn from RMR Open #4. Your spot may be
          given to another team or free agents.
        </p>
        <button
          onClick={onBack}
          className="mt-2 text-xs tracking-[0.2em] text-muted uppercase transition-colors hover:text-steel"
        >
          Back to registration
        </button>
      </div>
    );
  }

  return (
    <div className="steel-frame mx-auto flex w-full max-w-2xl flex-col gap-6 bg-card p-6 text-left sm:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold tracking-[0.2em] text-steel-bright uppercase">
            Ice Reapers
          </h2>
          <p className="text-[10px] tracking-[0.15em] text-muted uppercase">
            Registered — RMR Open #4 · Seed 1
          </p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="text-[10px] tracking-[0.15em] text-muted uppercase transition-colors hover:text-steel"
        >
          Sign out
        </button>
      </div>

      {/* Check-in */}
      <div
        className={`flex items-center justify-between border p-4 ${
          checkedIn ? "border-teal/50 bg-teal/5" : "border-steel-dark"
        }`}
      >
        <div>
          <p
            className={`text-xs font-semibold tracking-[0.2em] uppercase ${
              checkedIn ? "text-teal" : "text-steel-bright"
            }`}
          >
            {checkedIn ? "Checked in" : "Not checked in"}
          </p>
          <p className="mt-1 text-xs text-muted">
            Check-in opens 30 minutes before puck drop (8:00 PM EST).
          </p>
        </div>
        {!checkedIn && (
          <button
            type="button"
            onClick={() => setCheckedIn(true)}
            className="steel-frame shrink-0 bg-charcoal/60 px-4 py-2 text-xs font-semibold tracking-[0.2em] text-steel uppercase transition-colors hover:bg-charcoal hover:text-steel-bright"
          >
            Check In
          </button>
        )}
      </div>

      {/* Roster */}
      <div className="flex flex-col gap-3">
        <span className="text-xs tracking-[0.2em] text-steel uppercase">
          Roster
        </span>
        {roster.map((player, index) => (
          <fieldset
            key={index}
            className="grid gap-2 border border-steel-dark/60 p-3 sm:grid-cols-[1fr_1fr_0.8fr] sm:items-end"
          >
            <div className="flex flex-col gap-1">
              <span className="text-[10px] tracking-[0.15em] text-muted uppercase">
                Player {index + 1}
              </span>
              <span className="px-1 py-2 text-sm text-steel-bright">
                {player.name}
              </span>
            </div>
            <label className="flex flex-col gap-1">
              <span className="text-[10px] tracking-[0.15em] text-muted uppercase">
                Discord username
              </span>
              <input
                type="text"
                value={player.discord}
                onChange={(e) => update(index, "discord", e.target.value)}
                className={inputClasses}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[10px] tracking-[0.15em] text-muted uppercase">
                Position
              </span>
              <select
                value={player.position}
                onChange={(e) => update(index, "position", e.target.value)}
                className={inputClasses}
              >
                {POSITIONS.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </label>
          </fieldset>
        ))}
        <p className="text-xs leading-5 text-muted">
          Adding or replacing players reopens once the database is connected —
          for now, edit Discord names and positions here.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => setSaved(true)}
          className="steel-frame bg-charcoal/60 px-6 py-2.5 text-xs font-semibold tracking-[0.2em] text-steel uppercase transition-colors hover:bg-charcoal hover:text-steel-bright"
        >
          {saved ? "Saved ✓" : "Save Changes"}
        </button>

        {confirmingWithdraw ? (
          <div className="flex items-center gap-3">
            <span className="text-xs text-blade-red">Withdraw from #4?</span>
            <button
              type="button"
              onClick={() => setWithdrawn(true)}
              className="border border-blade-red/60 px-3 py-2 text-xs font-semibold tracking-[0.15em] text-blade-red uppercase transition-colors hover:bg-blade-red/10"
            >
              Yes, withdraw
            </button>
            <button
              type="button"
              onClick={() => setConfirmingWithdraw(false)}
              className="text-xs tracking-[0.15em] text-muted uppercase hover:text-steel"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmingWithdraw(true)}
            className="text-xs tracking-[0.15em] text-muted uppercase transition-colors hover:text-blade-red"
          >
            Withdraw team
          </button>
        )}
      </div>
    </div>
  );
}
