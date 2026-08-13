"use client";

import { useState } from "react";
import { playerStandings, teamStandings } from "@/lib/leaderboard";

type Tab = "teams" | "players";

const thClasses =
  "px-3 py-2 text-left text-[10px] font-semibold tracking-[0.2em] text-muted uppercase";
const tdClasses = "px-3 py-3 text-sm";

export default function LeaderboardPage() {
  const [tab, setTab] = useState<Tab>("teams");

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
      <div className="flex items-center gap-6">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-steel-dark" />
        <h1 className="font-display text-3xl font-bold tracking-[0.15em] text-steel-bright uppercase">
          Leaderboard
        </h1>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-steel-dark" />
      </div>
      <p className="mt-3 text-center text-xs tracking-[0.3em] text-muted uppercase">
        Season 1 — across all RMR Opens
      </p>

      {/* Tab switcher */}
      <div
        className="mx-auto mt-8 grid w-full max-w-sm grid-cols-2 gap-2"
        role="tablist"
        aria-label="Leaderboard view"
      >
        {(
          [
            { value: "teams", label: "Teams" },
            { value: "players", label: "Players" },
          ] as const
        ).map(({ value, label }) => (
          <button
            key={value}
            role="tab"
            aria-selected={tab === value}
            onClick={() => setTab(value)}
            className={`border px-3 py-2 text-xs font-semibold tracking-[0.15em] uppercase transition-colors ${
              tab === value
                ? "border-steel bg-charcoal text-steel-bright"
                : "border-steel-dark text-muted hover:text-steel"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="steel-frame mt-8 overflow-x-auto bg-card">
        {tab === "teams" ? (
          <table className="w-full min-w-[560px]">
            <thead>
              <tr className="border-b border-steel-dark/40">
                <th className={thClasses}>#</th>
                <th className={thClasses}>Team</th>
                <th className={`${thClasses} text-right`}>Events</th>
                <th className={`${thClasses} text-right`}>W</th>
                <th className={`${thClasses} text-right`}>L</th>
                <th className={`${thClasses} text-right`}>Titles</th>
                <th className={`${thClasses} text-right`}>Points</th>
              </tr>
            </thead>
            <tbody>
              {teamStandings.map((row) => (
                <tr
                  key={row.team}
                  className="border-b border-steel-dark/20 last:border-b-0 hover:bg-charcoal/50"
                >
                  <td className={`${tdClasses} text-muted`}>{row.rank}</td>
                  <td className={`${tdClasses} font-semibold text-steel-bright`}>
                    {row.team}
                  </td>
                  <td className={`${tdClasses} text-right text-steel`}>
                    {row.played}
                  </td>
                  <td className={`${tdClasses} text-right text-steel`}>
                    {row.wins}
                  </td>
                  <td className={`${tdClasses} text-right text-steel`}>
                    {row.losses}
                  </td>
                  <td className={`${tdClasses} text-right text-steel`}>
                    {row.titles}
                  </td>
                  <td
                    className={`${tdClasses} text-right font-semibold text-steel-bright`}
                  >
                    {row.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full min-w-[560px]">
            <thead>
              <tr className="border-b border-steel-dark/40">
                <th className={thClasses}>#</th>
                <th className={thClasses}>Player</th>
                <th className={thClasses}>Team</th>
                <th className={`${thClasses} text-right`}>GP</th>
                <th className={`${thClasses} text-right`}>G</th>
                <th className={`${thClasses} text-right`}>A</th>
                <th className={`${thClasses} text-right`}>Pts</th>
              </tr>
            </thead>
            <tbody>
              {playerStandings.map((row) => (
                <tr
                  key={row.player}
                  className="border-b border-steel-dark/20 last:border-b-0 hover:bg-charcoal/50"
                >
                  <td className={`${tdClasses} text-muted`}>{row.rank}</td>
                  <td className={`${tdClasses} font-semibold text-steel-bright`}>
                    {row.player}
                  </td>
                  <td className={`${tdClasses} text-steel`}>{row.team}</td>
                  <td className={`${tdClasses} text-right text-steel`}>
                    {row.games}
                  </td>
                  <td className={`${tdClasses} text-right text-steel`}>
                    {row.goals}
                  </td>
                  <td className={`${tdClasses} text-right text-steel`}>
                    {row.assists}
                  </td>
                  <td
                    className={`${tdClasses} text-right font-semibold text-steel-bright`}
                  >
                    {row.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="mt-4 text-center text-xs leading-5 text-muted">
        Standings are placeholders until the database is connected. Player
        names will link to profiles with RMR stats and PHLstats career pages.
      </p>
    </main>
  );
}
