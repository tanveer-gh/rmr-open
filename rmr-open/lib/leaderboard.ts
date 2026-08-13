// Placeholder season standings — replaced by the database later.

export type TeamStanding = {
  rank: number;
  team: string;
  played: number;
  wins: number;
  losses: number;
  titles: number;
  points: number;
};

export type PlayerStanding = {
  rank: number;
  player: string;
  team: string;
  games: number;
  goals: number;
  assists: number;
  points: number;
};

export const teamStandings: TeamStanding[] = [
  { rank: 1, team: "Ice Reapers", played: 3, wins: 7, losses: 1, titles: 2, points: 21 },
  { rank: 2, team: "Five Hole Bandits", played: 3, wins: 6, losses: 2, titles: 1, points: 18 },
  { rank: 3, team: "Blue Liners", played: 3, wins: 4, losses: 3, titles: 0, points: 12 },
  { rank: 4, team: "Top Shelf", played: 3, wins: 3, losses: 3, titles: 0, points: 9 },
  { rank: 5, team: "Zamboni Crew", played: 2, wins: 1, losses: 2, titles: 0, points: 3 },
  { rank: 6, team: "Puck Wraiths", played: 2, wins: 0, losses: 2, titles: 0, points: 0 },
];

export const playerStandings: PlayerStanding[] = [
  { rank: 1, player: "PlaceholderPlayer1", team: "Ice Reapers", games: 8, goals: 12, assists: 7, points: 19 },
  { rank: 2, player: "PlaceholderPlayer2", team: "Five Hole Bandits", games: 8, goals: 9, assists: 8, points: 17 },
  { rank: 3, player: "PlaceholderPlayer3", team: "Blue Liners", games: 7, goals: 8, assists: 6, points: 14 },
  { rank: 4, player: "PlaceholderPlayer4", team: "Ice Reapers", games: 8, goals: 5, assists: 8, points: 13 },
  { rank: 5, player: "PlaceholderPlayer5", team: "Top Shelf", games: 6, goals: 6, assists: 4, points: 10 },
  { rank: 6, player: "PlaceholderPlayer6", team: "Zamboni Crew", games: 5, goals: 4, assists: 3, points: 7 },
  { rank: 7, player: "PlaceholderPlayer7", team: "Five Hole Bandits", games: 8, goals: 2, assists: 5, points: 7 },
  { rank: 8, player: "PlaceholderPlayer8", team: "Puck Wraiths", games: 5, goals: 3, assists: 2, points: 5 },
];
