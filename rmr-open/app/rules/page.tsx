const sections = [
  {
    title: "Format",
    rules: [
      "The RMR Open is a weekly single-elimination tournament played in Puck, every Saturday at 8:00 PM EST.",
      "The bracket is randomly generated once all teams are checked in, just before 8:00 PM EST. Matchups — and byes, when the team count isn't a power of two — are pure luck of the draw.",
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
      "Matches are a single game: three 5-minute periods on the in-game clock, 4 skaters and a goalie per side.",
      "Tied after regulation? Sudden-death overtime in 5-minute periods until someone scores.",
      "The team listed first in the bracket hosts the server and posts its name and password in the match chat before the round starts.",
      "Substitutions are allowed between periods and during stoppages — rostered players only.",
      "A team may start one skater short (4 total including goalie), but never with fewer. Free agents assigned at puck drop count as rostered.",
      "A team that isn't in the server 10 minutes after its round opens forfeits the match.",
      "If a player disconnects, play continues — they may rejoin at any time. A full-server crash restarts the period at 0–0 for that period, carrying the game score.",
      "Both captains report the final score in the match room. Matching reports confirm instantly; disagreements go to the organizers, whose ruling is final. Keep a screenshot of the final scoreboard until results are confirmed.",
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
      "No slurs, harassment, or hate speech — in match chat, in-game, or the Discord. Zero tolerance.",
      "No throwing matches, colluding on results, or playing on someone else's Steam account. One account, one player.",
      "Trash talk is hockey; personal attacks aren't. Keep it about the game.",
      "Violations earn a warning, removal from the night, or a ban from future Opens depending on severity — at the organizers' discretion.",
      "Organizer decisions are final on the night of the tournament. Appeals can be raised afterward in the Discord.",
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
