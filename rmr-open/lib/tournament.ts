// Placeholder data for the current week's tournament — replaced by the
// database later. The bracket is single elimination; when the team count
// isn't a power of two, top seeds receive first-round byes.

export type TeamPlayer = {
  name: string;
  position: "Skater" | "Goalie" | "Flex";
  captain?: boolean;
};

export type Team = {
  id: string;
  name: string;
  seed: number;
  checkedIn: boolean;
  players?: TeamPlayer[];
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
// Rosters are placeholders until registration writes to the database.
const roster = (
  prefix: string,
  count: number,
): TeamPlayer[] =>
  Array.from({ length: count }, (_, i) => ({
    name: `${prefix}${i + 1}`,
    position: i === count - 1 ? "Goalie" : i === count - 2 && count > 5 ? "Flex" : "Skater",
    captain: i === 0,
  }));

export const teams: Team[] = [
  { id: "ice-reapers", name: "Ice Reapers", seed: 1, checkedIn: true, players: roster("Reaper", 6) },
  { id: "five-hole-bandits", name: "Five Hole Bandits", seed: 2, checkedIn: true, players: roster("Bandit", 5) },
  { id: "blue-liners", name: "Blue Liners", seed: 3, checkedIn: true, players: roster("Liner", 7) },
  { id: "top-shelf", name: "Top Shelf", seed: 4, checkedIn: false, players: roster("Shelf", 5) },
  { id: "zamboni-crew", name: "Zamboni Crew", seed: 5, checkedIn: true, players: roster("Zamboni", 6) },
  { id: "puck-wraiths", name: "Puck Wraiths", seed: 6, checkedIn: false, players: roster("Wraith", 5) },
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

export type FreeAgent = {
  name: string;
  position: "Forward" | "Defense" | "Goalie" | "Flex";
};

// Free agent pool — when it holds 4 skaters + 1 goalie, a random team is
// formed from it at check-in (team name drawn from a preset list).
export const freeAgents: FreeAgent[] = [
  { name: "LoneWolf7", position: "Forward" },
  { name: "IcePickle", position: "Defense" },
  { name: "SundinFan13", position: "Forward" },
  { name: "BluePaintDrifter", position: "Defense" },
  { name: "BrickWallBackup", position: "Goalie" },
  { name: "WhereverNeeded", position: "Flex" },
];

export function hasFullFreeAgentTeam(pool: FreeAgent[]): boolean {
  const goalies = pool.filter(
    (p) => p.position === "Goalie" || p.position === "Flex",
  ).length;
  const skaters = pool.filter((p) => p.position !== "Goalie").length;
  return goalies >= 1 && skaters >= 4 && pool.length >= 5;
}

// Preset names for randomly-formed free agent squads. Each week's squad
// takes the first name not already used by a registered team.
export const FREE_AGENT_TEAM_NAMES = [
  "The Reapers' Draft",
  "Grim Pickings",
  "Scythe Squad",
  "The Bone Rattlers",
  "Last Rites",
  "The Undrafted",
  "Graveyard Shift",
  "Pale Riders",
] as const;

export function nextFreeAgentTeamName(takenNames: string[]): string {
  const taken = new Set(takenNames.map((n) => n.toLowerCase()));
  return (
    FREE_AGENT_TEAM_NAMES.find((n) => !taken.has(n.toLowerCase())) ??
    FREE_AGENT_TEAM_NAMES[0]
  );
}

// True only while a tournament night is actually running — drives the LIVE
// nav link and the "your match" cards instead of hardcoded demo state.
export function isTournamentLive(): boolean {
  return currentTournament.phase === "live";
}

// The live match a team is currently playing in, if any.
export function findLiveMatch(teamId: string): Match | undefined {
  return matches.find(
    (m) => m.status === "live" && (m.teamA === teamId || m.teamB === teamId),
  );
}

// A disagreement between the two captains' score reports, waiting on an
// organizer ruling. Placeholder data until reporting is wired up.
export type ScoreDispute = {
  matchId: string;
  reportA: { by: string; scoreA: number; scoreB: number };
  reportB: { by: string; scoreA: number; scoreB: number };
};

export const scoreDisputes: ScoreDispute[] = [
  {
    matchId: "sf-1",
    reportA: { by: "YourSteamName (Ice Reapers)", scoreA: 5, scoreB: 2 },
    reportB: { by: "TopShelfCaptain (Top Shelf)", scoreA: 4, scoreB: 2 },
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
