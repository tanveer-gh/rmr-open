const sections = [
  {
    title: "Format",
    rules: [
      "The RMR Open is a weekly single-elimination tournament played in Puck, every Saturday at 8:00 PM EST.",
      "The bracket is seeded at puck drop. When the number of teams isn't a power of two, top seeds receive first-round byes.",
      "All rounds are played the same night — one match per round per team.",
    ],
  },
  {
    title: "Rosters & Eligibility",
    rules: [
      "Teams register 5 to 8 players: 4 skaters + 1 goalie starting, with up to 2 subs and 1 backup goalie.",
      "Every player must have a valid Steam account that owns Puck.",
      "Players may only appear on one roster per tournament.",
    ],
  },
  {
    title: "Match Rules",
    rules: [
      "Placeholder — match length, server settings, and overtime format go here.",
      "Placeholder — forfeit and no-show rules go here.",
      "Placeholder — dispute and replay policy go here.",
    ],
  },
  {
    title: "Check-in",
    rules: [
      "Check-in opens 45 minutes before puck drop — 7:15 PM EST (4:15 PM PST) — and closes at 8:00 PM EST.",
      "Teams that fail to check in lose their spot; free agents may be used to fill incomplete rosters.",
      "Free agents who signed up are committing to being available at 8:00 PM EST if called on.",
    ],
  },
  {
    title: "Conduct",
    rules: [
      "Placeholder — sportsmanship, chat conduct, and penalty policy go here.",
      "Organizer decisions are final on the night of the tournament.",
    ],
  },
];

export default function RulesPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <div className="flex items-center gap-6">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-steel-dark" />
        <h1 className="font-display text-3xl font-bold tracking-[0.15em] text-steel-bright uppercase">
          Rules
        </h1>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-steel-dark" />
      </div>
      <p className="mt-3 text-center text-xs tracking-[0.3em] text-muted uppercase">
        RMR Open Official Rulebook
      </p>

      <div className="mt-10 flex flex-col gap-6">
        {sections.map(({ title, rules }) => (
          <section key={title} className="steel-frame bg-card p-6">
            <h2 className="font-display text-sm font-semibold tracking-[0.25em] text-steel uppercase">
              {title}
            </h2>
            <ul className="mt-4 flex list-disc flex-col gap-2 pl-5 text-sm leading-6 text-muted">
              {rules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
