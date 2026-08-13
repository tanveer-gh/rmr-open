// Placeholder data for the current week's tournament — replaced by the
// database later. The bracket is single elimination; when the team count
// isn't a power of two, top seeds receive first-round byes.

export type Team = {
  id: string;
  name: string;
  seed: number;
  checkedIn: boolean;
};

export type Match = {
  id: string;
  round: number; // 1 = first round, increasing toward the final
  teamA: string | null; // team id, null = TBD (winner of an earlier match)
  teamB: string | null; // null with fromA/fromB unset means a bye
  scoreA: number | null;
  scoreB: number | null;
  status: "upcoming" | "live" | "final";
  fromA?: string; // match id feeding slot A
  fromB?: string; // match id feeding slot B
};

export type TournamentPhase = "registration" | "live" | "complete";

export const currentTournament = {
  number: 4,
  date: "Saturday 8:00 PM EST",
  phase: "registration" as TournamentPhase,
};

// 6 teams registered → bracket of 8, seeds 1 and 2 get byes.
export const teams: Team[] = [
  { id: "ice-reapers", name: "Ice Reapers", seed: 1, checkedIn: true },
  { id: "five-hole-bandits", name: "Five Hole Bandits", seed: 2, checkedIn: true },
  { id: "blue-liners", name: "Blue Liners", seed: 3, checkedIn: true },
  { id: "top-shelf", name: "Top Shelf", seed: 4, checkedIn: false },
  { id: "zamboni-crew", name: "Zamboni Crew", seed: 5, checkedIn: true },
  { id: "puck-wraiths", name: "Puck Wraiths", seed: 6, checkedIn: false },
];

// Demo bracket used to preview the live/final states.
// Round 1: 3v6 and 4v5 (seeds 1 & 2 on bye). Round 2: semifinals. Round 3: final.
export const matches: Match[] = [
  {
    id: "qf-1",
    round: 1,
    teamA: "blue-liners",
    teamB: "puck-wraiths",
    scoreA: 4,
    scoreB: 1,
    status: "final",
  },
  {
    id: "qf-2",
    round: 1,
    teamA: "top-shelf",
    teamB: "zamboni-crew",
    scoreA: 2,
    scoreB: 3,
    status: "final",
  },
  {
    id: "sf-1",
    round: 2,
    teamA: "ice-reapers",
    teamB: "top-shelf", // placeholder: winner of qf-2
    fromB: "qf-2",
    scoreA: 5,
    scoreB: 2,
    status: "live",
  },
  {
    id: "sf-2",
    round: 2,
    teamA: "five-hole-bandits",
    teamB: "blue-liners",
    fromB: "qf-1",
    scoreA: null,
    scoreB: null,
    status: "upcoming",
  },
  {
    id: "final",
    round: 3,
    teamA: null,
    teamB: null,
    fromA: "sf-1",
    fromB: "sf-2",
    scoreA: null,
    scoreB: null,
    status: "upcoming",
  },
];

export function getTeam(id: string | null): Team | undefined {
  return id ? teams.find((t) => t.id === id) : undefined;
}

export const roundName = (round: number, totalRounds: number): string => {
  const fromEnd = totalRounds - round;
  if (fromEnd === 0) return "Final";
  if (fromEnd === 1) return "Semifinals";
  if (fromEnd === 2) return "Quarterfinals";
  return `Round ${round}`;
};
