"use client";

import Link from "next/link";
import { useState } from "react";
import { DISCORD_INVITE, STEAM_REF_PATTERN } from "@/lib/site";

type Step = "signed-out" | "form" | "done";
type Mode = "team" | "free-agent";
type Teammate = { steam: string; discord: string; position: string };

const POSITIONS = ["Skater", "Goalie", "Flex"] as const;

// Roster rules: captain + 4 teammates minimum (4 skaters + 1 goalie),
// up to 8 players total (2 subs + 1 backup goalie).
const MIN_PLAYERS = 5;
const MAX_PLAYERS = 8;

// Placeholder identity — becomes the real Steam profile once auth is wired up.
const mockUser = {
  name: "YourSteamName",
  initial: "Y",
  profileUrl: "steamcommunity.com/id/YourSteamName",
};

const emptyTeammate = (): Teammate => ({
  steam: "",
  discord: "",
  position: "Skater",
});

function SteamLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 0 0-9.97 9.24l5.35 2.21a2.83 2.83 0 0 1 1.6-.49h.14l2.38-3.45v-.05a3.77 3.77 0 1 1 3.77 3.77h-.09l-3.4 2.43v.12a2.83 2.83 0 1 1-5.65.17l-3.83-1.58A10 10 0 1 0 12 2Zm-5.7 15.15a2.12 2.12 0 0 0 3.9.14 2.12 2.12 0 0 0-1.14-2.78l-1.28-.53a1.6 1.6 0 0 1 1.18.06 1.6 1.6 0 0 1-1.23 2.95l1.32.55-2.75-1.14v.75Zm10.98-7.13a2.51 2.51 0 1 0-2.51 2.51 2.51 2.51 0 0 0 2.51-2.51Zm-4.4 0a1.89 1.89 0 1 1 1.89 1.88 1.89 1.89 0 0 1-1.89-1.88Z" />
    </svg>
  );
}

const inputClasses =
  "w-full border border-steel-dark bg-abyss px-3 py-2.5 text-sm text-steel-bright placeholder:text-muted/60 focus:border-steel focus:outline-none";

const labelClasses = "text-xs tracking-[0.2em] text-steel uppercase";

export default function RegisterFlow() {
  const [step, setStep] = useState<Step>("signed-out");
  const [mode, setMode] = useState<Mode>("team");
  const [teamName, setTeamName] = useState("");
  const [captain, setCaptain] = useState<Teammate>({
    ...emptyTeammate(),
    steam: mockUser.profileUrl,
  });
  const [teammates, setTeammates] = useState<Teammate[]>(
    Array.from({ length: MIN_PLAYERS - 1 }, emptyTeammate),
  );
  const [position, setPosition] = useState("Forward");

  const playerCount = teammates.length + 1;

  const updateTeammate = (
    index: number,
    field: keyof Teammate,
    value: string,
  ) => {
    setTeammates((prev) =>
      prev.map((mate, i) => (i === index ? { ...mate, [field]: value } : mate)),
    );
  };

  if (step === "signed-out") {
    return (
      <div className="steel-frame mx-auto flex w-full max-w-md flex-col items-center gap-6 bg-card p-8">
        <p className="text-sm leading-6 text-muted">
          One sign-in registers your whole team. The captain signs in with
          Steam and adds everyone else — teammates don&apos;t need to do a
          thing.
        </p>
        <button
          onClick={() => setStep("form")}
          className="flex items-center gap-3 rounded-sm bg-[#171a21] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2a475e]"
        >
          <SteamLogo />
          Sign in through Steam
        </button>
        <p className="text-[10px] tracking-[0.15em] text-muted uppercase">
          Preview — real Steam sign-in comes with launch
        </p>
        <Link
          href="/team"
          className="text-xs text-muted underline underline-offset-4 transition-colors hover:text-steel"
        >
          Already registered? View your team
        </Link>
      </div>
    );
  }

  if (step === "done") {
    return (
      <div className="steel-frame mx-auto flex w-full max-w-md flex-col items-center gap-4 bg-card p-8">
        <h2 className="font-display text-xl font-semibold tracking-[0.2em] text-steel-bright uppercase">
          You&apos;re in
        </h2>
        <p className="text-sm leading-6 text-muted">
          {mode === "team" ? (
            <>
              <span className="text-steel-bright">{teamName || "Your team"}</span>{" "}
              is registered with {playerCount} players for the next RMR Open.
            </>
          ) : (
            <>
              You&apos;re registered as a free agent (
              <span className="text-steel-bright">{position}</span>) for the
              next RMR Open.
            </>
          )}
        </p>
        <p className="text-xs tracking-[0.2em] text-muted uppercase">
          Saturday 8:00 PM EST — see you on the ice
        </p>
        {mode === "free-agent" && (
          <div className="mt-2 flex flex-col gap-3 border-t border-steel-dark/60 pt-4 text-left">
            <p className="text-xs tracking-[0.2em] text-steel uppercase">
              Please note
            </p>
            <ul className="flex list-disc flex-col gap-2 pl-4 text-sm leading-6 text-muted">
              <li>
                A spot is not guaranteed — but by signing up, you&apos;re
                committing to being available Saturday at 8:00 PM EST if
                you&apos;re needed.
              </li>
              <li>
                If there are enough free agents and open spots, you&apos;ll be
                randomly assigned to a team.
              </li>
            </ul>
          </div>
        )}
        <a
          href={DISCORD_INVITE}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 w-full border border-steel-dark px-4 py-3 text-xs font-semibold tracking-[0.2em] text-steel uppercase transition-colors hover:border-steel hover:text-steel-bright"
        >
          Join the RMR Open Discord →
        </a>
        <p className="text-xs leading-5 text-muted">
          Announcements, check-in reminders, and free-agent call-ups all
          happen there — don&apos;t miss puck drop.
        </p>
        <button
          onClick={() => setStep("signed-out")}
          className="mt-2 text-xs tracking-[0.2em] text-muted uppercase transition-colors hover:text-steel"
        >
          Start over
        </button>
      </div>
    );
  }

  return (
    <form
      className="steel-frame mx-auto flex w-full max-w-2xl flex-col gap-6 bg-card p-6 sm:p-8"
      onSubmit={(e) => {
        e.preventDefault();
        setStep("done");
      }}
    >
      {/* Signed-in identity */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-charcoal-light font-display text-lg text-steel-bright">
            {mockUser.initial}
          </span>
          <div className="text-left">
            <p className="text-sm font-semibold text-steel-bright">
              {mockUser.name}
            </p>
            <p className="text-[10px] tracking-[0.15em] text-muted uppercase">
              Signed in through Steam
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setStep("signed-out")}
          className="text-[10px] tracking-[0.15em] text-muted uppercase transition-colors hover:text-steel"
        >
          Sign out
        </button>
      </div>

      {/* Team / free agent toggle */}
      <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Registration type">
        {(
          [
            { value: "team", label: "Register a Team" },
            { value: "free-agent", label: "Free Agent" },
          ] as const
        ).map(({ value, label }) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={mode === value}
            onClick={() => setMode(value)}
            className={`border px-3 py-2 text-xs font-semibold tracking-[0.15em] uppercase transition-colors ${
              mode === value
                ? "border-steel bg-charcoal text-steel-bright"
                : "border-steel-dark text-muted hover:text-steel"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === "team" ? (
        <>
          <label className="flex flex-col gap-2 text-left">
            <span className={labelClasses}>Team name</span>
            <input
              type="text"
              required
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g. Ice Reapers"
              className={inputClasses}
            />
          </label>

          {/* Roster */}
          <div className="flex flex-col gap-4 text-left">
            <div className="flex items-baseline justify-between">
              <span className={labelClasses}>Roster</span>
              <span className="text-xs text-muted">
                {playerCount} / {MAX_PLAYERS} players (you included) — minimum{" "}
                {MIN_PLAYERS}
              </span>
            </div>
            <p className="text-xs leading-5 text-muted">
              Every player needs a Steam profile link or SteamID64 (the
              17-digit number), a Discord username, and a position. In-game
              names and stats link up automatically from Steam.
            </p>

            {/* Captain — player 1 */}
            <fieldset className="grid gap-2 border border-steel/40 bg-charcoal/30 p-3 sm:grid-cols-[1.3fr_1fr_0.8fr_auto] sm:items-end">
              <label className="flex flex-col gap-1">
                <span className="text-[10px] tracking-[0.15em] text-steel uppercase">
                  Player 1 — Steam profile link
                </span>
                <input
                  type="text"
                  readOnly
                  value={captain.steam}
                  aria-describedby="captain-steam-note"
                  className={`${inputClasses} cursor-default text-muted`}
                />
                <span id="captain-steam-note" className="text-[10px] text-muted">
                  Filled from your Steam sign-in
                </span>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[10px] tracking-[0.15em] text-muted uppercase">
                  Discord username
                </span>
                <input
                  type="text"
                  required
                  value={captain.discord}
                  onChange={(e) =>
                    setCaptain((prev) => ({ ...prev, discord: e.target.value }))
                  }
                  placeholder="e.g. reapermain"
                  className={inputClasses}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[10px] tracking-[0.15em] text-muted uppercase">
                  Position
                </span>
                <select
                  value={captain.position}
                  onChange={(e) =>
                    setCaptain((prev) => ({
                      ...prev,
                      position: e.target.value,
                    }))
                  }
                  className={inputClasses}
                >
                  {POSITIONS.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </label>
              <span className="hidden sm:block" />
            </fieldset>

            {teammates.map((mate, index) => (
              <fieldset
                key={index}
                className="grid gap-2 border border-steel-dark/60 p-3 sm:grid-cols-[1.3fr_1fr_0.8fr_auto] sm:items-end"
              >
                <label className="flex flex-col gap-1">
                  <span className="text-[10px] tracking-[0.15em] text-muted uppercase">
                    Player {index + 2} — Steam profile or ID64
                  </span>
                  <input
                    type="text"
                    required
                    value={mate.steam}
                    onChange={(e) =>
                      updateTeammate(index, "steam", e.target.value)
                    }
                    placeholder="steamcommunity.com/id/… or 76561198…"
                    pattern={STEAM_REF_PATTERN}
                    title="A steamcommunity.com profile link or a 17-digit SteamID64"
                    className={inputClasses}
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-[10px] tracking-[0.15em] text-muted uppercase">
                    Discord username
                  </span>
                  <input
                    type="text"
                    required
                    value={mate.discord}
                    onChange={(e) =>
                      updateTeammate(index, "discord", e.target.value)
                    }
                    placeholder="e.g. topshelf"
                    className={inputClasses}
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-[10px] tracking-[0.15em] text-muted uppercase">
                    Position
                  </span>
                  <select
                    value={mate.position}
                    onChange={(e) =>
                      updateTeammate(index, "position", e.target.value)
                    }
                    className={inputClasses}
                  >
                    {POSITIONS.map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </label>
                {index >= MIN_PLAYERS - 1 ? (
                  <button
                    type="button"
                    onClick={() =>
                      setTeammates((prev) => prev.filter((_, i) => i !== index))
                    }
                    aria-label={`Remove player ${index + 2}`}
                    className="justify-self-start border border-steel-dark px-3 py-2.5 text-xs tracking-[0.15em] text-muted uppercase transition-colors hover:border-steel hover:text-steel sm:justify-self-auto"
                  >
                    Remove
                  </button>
                ) : (
                  <span className="hidden sm:block" />
                )}
              </fieldset>
            ))}

            {playerCount < MAX_PLAYERS && (
              <button
                type="button"
                onClick={() => setTeammates((prev) => [...prev, emptyTeammate()])}
                className="self-start border border-dashed border-steel-dark px-4 py-2 text-xs tracking-[0.15em] text-muted uppercase transition-colors hover:border-steel hover:text-steel"
              >
                + Add player ({MAX_PLAYERS - playerCount} spots left)
              </button>
            )}
          </div>
        </>
      ) : (
        <div className="grid gap-4 text-left sm:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className={labelClasses}>Preferred position</span>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className={inputClasses}
            >
              <option>Forward</option>
              <option>Defense</option>
              <option>Goalie</option>
              <option>Flex (Skater + Goalie)</option>
            </select>
          </label>
          <label className="flex flex-col gap-2">
            <span className={labelClasses}>Discord username</span>
            <input
              type="text"
              required
              placeholder="e.g. loneskater"
              className={inputClasses}
            />
          </label>
          <p className="text-xs leading-5 text-muted sm:col-span-2">
            Free agents are placed on teams that need players before puck drop.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <button
          type="submit"
          className="steel-frame bg-charcoal/60 px-6 py-3 text-sm font-semibold tracking-[0.25em] text-steel uppercase transition-colors hover:bg-charcoal hover:text-steel-bright"
        >
          {mode === "team" ? "Register Team" : "Confirm Registration"}
        </button>
        <p className="text-center text-xs text-muted">
          By registering you agree to the{" "}
          <a
            href="/rules"
            className="text-steel underline underline-offset-4 transition-colors hover:text-steel-bright"
          >
            tournament rules
          </a>
          .
        </p>
      </div>
    </form>
  );
}
