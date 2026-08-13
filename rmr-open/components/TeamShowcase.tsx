import type { Team } from "@/lib/tournament";

// Pre-tournament team list: flat and minimal — team name with check-in
// status, player names underneath, thin dividers with alternating shading.

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

      {/* Team list */}
      <ul className="mt-10">
        {teams.map((team, i) => (
          <li
            key={team.id}
            className={`border-b border-steel-dark/40 px-4 py-5 first:border-t ${
              i % 2 === 0 ? "bg-transparent" : "bg-charcoal/30"
            }`}
          >
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-display text-lg font-bold tracking-[0.1em] text-steel-bright uppercase">
                {team.name}
              </h3>
              <span
                className={`flex shrink-0 items-center gap-1.5 text-[9px] font-semibold tracking-[0.2em] uppercase ${
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
            <p className="mt-2 text-sm leading-6 text-muted">
              {(team.players ?? []).map((player, j) => (
                <span key={player.name}>
                  {j > 0 && <span className="mx-2 text-steel-dark">·</span>}
                  <span className={player.captain ? "text-steel" : ""}>
                    {player.name}
                    {player.captain && (
                      <span className="ml-1 text-[9px] tracking-[0.15em] uppercase">
                        C
                      </span>
                    )}
                  </span>
                </span>
              ))}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
