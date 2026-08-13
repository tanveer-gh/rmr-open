// Placeholder data for past RMR Opens — replaced by the database later.
// Each event stores its full bracket: teams, matches, and a column layout
// ("bye:<teamId>" or a match id per slot) so History can replay any week.

import type { Match, Team } from "@/lib/tournament";

export type PastEvent = {
  id: string;
  number: number;
  date: string;
  champion: string;
  runnerUp: string;
  finalScore: string;
  mvp: string;
  teamCount: number;
  teams: Team[];
  matches: Match[];
  layout: string[][];
};

const t = (id: string, name: string, seed: number): Team => ({
  id,
  name,
  seed,
  checkedIn: true,
});

const m = (
  id: string,
  round: number,
  teamA: string,
  teamB: string,
  scoreA: number,
  scoreB: number,
): Match => ({ id, round, teamA, teamB, scoreA, scoreB, status: "final" });

export const pastEvents: PastEvent[] = [
  {
    id: "rmr-open-3",
    number: 3,
    date: "August 1, 2026",
    champion: "Ice Reapers",
    runnerUp: "Top Shelf",
    finalScore: "4 – 2",
    mvp: "PlaceholderPlayer1",
    teamCount: 8,
    teams: [
      t("ice-reapers", "Ice Reapers", 1),
      t("top-shelf", "Top Shelf", 2),
      t("blue-liners", "Blue Liners", 3),
      t("five-hole-bandits", "Five Hole Bandits", 4),
      t("zamboni-crew", "Zamboni Crew", 5),
      t("puck-wraiths", "Puck Wraiths", 6),
      t("ice-giants", "Ice Giants", 7),
      t("net-minders", "Net Minders", 8),
    ],
    matches: [
      m("qf-1", 1, "ice-reapers", "net-minders", 5, 1),
      m("qf-2", 1, "five-hole-bandits", "zamboni-crew", 3, 2),
      m("qf-3", 1, "blue-liners", "puck-wraiths", 4, 1),
      m("qf-4", 1, "top-shelf", "ice-giants", 3, 0),
      m("sf-1", 2, "ice-reapers", "five-hole-bandits", 4, 2),
      m("sf-2", 2, "top-shelf", "blue-liners", 2, 1),
      m("final", 3, "ice-reapers", "top-shelf", 4, 2),
    ],
    layout: [
      ["qf-1", "qf-2", "qf-3", "qf-4"],
      ["sf-1", "sf-2"],
      ["final"],
    ],
  },
  {
    id: "rmr-open-2",
    number: 2,
    date: "July 25, 2026",
    champion: "Five Hole Bandits",
    runnerUp: "Ice Reapers",
    finalScore: "3 – 1",
    mvp: "PlaceholderPlayer2",
    teamCount: 6,
    teams: [
      t("five-hole-bandits", "Five Hole Bandits", 1),
      t("ice-reapers", "Ice Reapers", 2),
      t("blue-liners", "Blue Liners", 3),
      t("top-shelf", "Top Shelf", 4),
      t("zamboni-crew", "Zamboni Crew", 5),
      t("puck-wraiths", "Puck Wraiths", 6),
    ],
    matches: [
      m("qf-1", 1, "top-shelf", "zamboni-crew", 4, 3),
      m("qf-2", 1, "blue-liners", "puck-wraiths", 2, 1),
      m("sf-1", 2, "five-hole-bandits", "top-shelf", 5, 2),
      m("sf-2", 2, "ice-reapers", "blue-liners", 3, 2),
      m("final", 3, "five-hole-bandits", "ice-reapers", 3, 1),
    ],
    layout: [
      ["bye:five-hole-bandits", "qf-1", "bye:ice-reapers", "qf-2"],
      ["sf-1", "sf-2"],
      ["final"],
    ],
  },
  {
    id: "rmr-open-1",
    number: 1,
    date: "July 18, 2026",
    champion: "Blue Liners",
    runnerUp: "Zamboni Crew",
    finalScore: "5 – 4 (OT)",
    mvp: "PlaceholderPlayer3",
    teamCount: 6,
    teams: [
      t("blue-liners", "Blue Liners", 1),
      t("zamboni-crew", "Zamboni Crew", 2),
      t("ice-reapers", "Ice Reapers", 3),
      t("five-hole-bandits", "Five Hole Bandits", 4),
      t("top-shelf", "Top Shelf", 5),
      t("puck-wraiths", "Puck Wraiths", 6),
    ],
    matches: [
      m("qf-1", 1, "five-hole-bandits", "top-shelf", 3, 2),
      m("qf-2", 1, "ice-reapers", "puck-wraiths", 6, 2),
      m("sf-1", 2, "blue-liners", "five-hole-bandits", 4, 1),
      m("sf-2", 2, "zamboni-crew", "ice-reapers", 3, 2),
      m("final", 3, "blue-liners", "zamboni-crew", 5, 4),
    ],
    layout: [
      ["bye:blue-liners", "qf-1", "bye:zamboni-crew", "qf-2"],
      ["sf-1", "sf-2"],
      ["final"],
    ],
  },
];

export function getEvent(id: string): PastEvent | undefined {
  return pastEvents.find((event) => event.id === id);
}

export function getMatch(
  event: PastEvent,
  matchId: string,
): Match | undefined {
  return event.matches.find((match) => match.id === matchId);
}
