import type { Team } from "@/lib/tournament";

// Pre-tournament team showcase: red/blue gradient cards (echoing the
// scythe blades) with each team's roster and check-in status.

function TeamCard({ team, tint }: { team: Team; tint: "red" | "blue" }) {
  const accent =
    tint === "red"
      ? {
          bar: "bg-gradient-to-r from-blade-red via-blade-red/50 to-transparent",
          glow: "bg-[radial-gradient(ellipse_at_top_left,rgba(193,39,45,0.16),transparent_65%)]",
          name: "from-blade-red/90",
        }
      : {
          bar: "bg-gradient-to-r from-blade-blue via-blade-blue/50 to-transparent",
          glow: "bg-[radial-gradient(ellipse_at_top_left,rgba(31,95,160,0.2),transparent_65%)]",
          name: "from-blade-blue/90",
        };

  return (
    <div className="steel-frame relative overflow-hidden bg-card">
      <div className={`absolute inset-x-0 top-0 h-1 ${accent.bar}`} />
      <div className={`pointer-events-none absolute inset-0 ${accent.glow}`} />

      <div className="relative p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-bold tracking-[0.1em] text-steel-bright uppercase">
            {team.name}
          </h3>
          <span
            className={`mt-1 flex shrink-0 items-center gap-1.5 text-[9px] font-semibold tracking-[0.2em] uppercase ${
              team.checkedIn ? "text-green-400" : "text-muted"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                team.checkedIn ? "bg-green-400" : "bg-steel-dark"
              }`}
            />
            {team.checkedIn ? "Checked in" : "Not checked in"}
          </span>
        </div>

        <ul className="mt-4 flex flex-col gap-1.5">
          {(team.players ?? []).map((player) => (
            <li
              key={player.name}
              className="flex items-center justify-between gap-2 text-sm"
            >
              <span className="truncate text-steel">
                {player.name}
                {player.captain && (
                  <span className="ml-2 text-[9px] tracking-[0.2em] text-muted uppercase">
                    C
                  </span>
                )}
              </span>
              <span
                className={`shrink-0 text-[9px] tracking-[0.15em] uppercase ${
                  player.position === "Goalie"
                    ? "text-steel-bright"
                    : "text-muted"
                }`}
              >
                {player.position}
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-4 text-[10px] tracking-[0.15em] text-muted uppercase">
          {(team.players ?? []).length} players
        </p>
      </div>
    </div>
  );
}

export default function TeamShowcase({ teams }: { teams: Team[] }) {
  const checkedIn = teams.filter((t) => t.checkedIn).length;

  return (
    <div>
      {/* Status strip */}
      <div className="mx-auto flex max-w-xl items-center justify-center gap-8 text-center">
        <div>
          <p className="font-display text-3xl font-bold text-steel-bright tabular-nums">
            {teams.length}
          </p>
          <p className="mt-1 text-[10px] tracking-[0.25em] text-muted uppercase">
            Teams registered
          </p>
        </div>
        <span className="h-10 w-px bg-steel-dark/60" />
        <div>
          <p className="font-display text-3xl font-bold text-green-400 tabular-nums">
            {checkedIn}
          </p>
          <p className="mt-1 text-[10px] tracking-[0.25em] text-muted uppercase">
            Checked in
          </p>
        </div>
        <span className="h-10 w-px bg-steel-dark/60" />
        <div>
          <p className="font-display text-3xl font-bold text-steel tabular-nums">
            {teams.length - checkedIn}
          </p>
          <p className="mt-1 text-[10px] tracking-[0.25em] text-muted uppercase">
            Awaiting check-in
          </p>
        </div>
      </div>

      {/* Team cards — alternating red/blue like the scythe blades */}
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {teams.map((team, i) => (
          <TeamCard key={team.id} team={team} tint={i % 2 === 0 ? "red" : "blue"} />
        ))}
      </div>
    </div>
  );
}
