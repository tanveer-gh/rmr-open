// Placeholder data for past RMR Opens — replaced by the database later.

export type PastEvent = {
  id: string;
  number: number;
  date: string;
  champion: string;
  runnerUp: string;
  finalScore: string;
  mvp: string;
  teams: number;
};

export const pastEvents: PastEvent[] = [
  {
    id: "rmr-open-3",
    number: 3,
    date: "August 1, 2026",
    champion: "Ice Reapers",
    runnerUp: "Top Shelf",
    finalScore: "4 – 2",
    mvp: "PlaceholderPlayer1",
    teams: 8,
  },
  {
    id: "rmr-open-2",
    number: 2,
    date: "July 25, 2026",
    champion: "Five Hole Bandits",
    runnerUp: "Ice Reapers",
    finalScore: "3 – 1",
    mvp: "PlaceholderPlayer2",
    teams: 6,
  },
  {
    id: "rmr-open-1",
    number: 1,
    date: "July 18, 2026",
    champion: "Blue Liners",
    runnerUp: "Zamboni Crew",
    finalScore: "5 – 4 (OT)",
    mvp: "PlaceholderPlayer3",
    teams: 6,
  },
];

export function getEvent(id: string): PastEvent | undefined {
  return pastEvents.find((event) => event.id === id);
}
