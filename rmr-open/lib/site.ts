// Site-wide constants and external-link helpers.

// Placeholder invite — swap for the real RMR Open server link before launch.
export const DISCORD_INVITE = "https://discord.gg/rmr-open-placeholder";

// Per-player PHLstats destination. Their exact profile URL scheme isn't
// confirmed yet, so this routes through site search — one place to update
// once the real pattern is known.
export function phlstatsPlayerUrl(playerName: string): string {
  return `https://phlstats.com/?search=${encodeURIComponent(playerName)}`;
}

export const PHLSTATS_HOME = "https://phlstats.com/";
