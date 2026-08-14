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

// Players can identify themselves by Steam profile link OR SteamID64 —
// the 17-digit number everything hangs off. These helpers accept both.

export const STEAM_ID64_RE = /^\d{17}$/;

// HTML input `pattern` matching a steamcommunity link or a SteamID64.
export const STEAM_REF_PATTERN =
  "(https?://)?(www\\.)?steamcommunity\\.com/.+|\\d{17}";

export function steamProfileUrl(ref: string): string {
  const trimmed = ref.trim();
  if (STEAM_ID64_RE.test(trimmed)) {
    return `https://steamcommunity.com/profiles/${trimmed}`;
  }
  return trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
}
