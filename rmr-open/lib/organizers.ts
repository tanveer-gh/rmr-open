// Organizer access control.
//
// Until Steam sign-in is wired up, /admin sits behind a passcode. Entering
// it once stores a key on the device, so organizers aren't re-prompted.
// The Steam ID allowlist below is what takes over at launch: anyone signed
// in through Steam whose ID is on the list gets /admin automatically, and
// the passcode disappears.

// CHANGE BEFORE LAUNCH — and move server-side with the database.
export const ADMIN_PASSCODE = "puckdrop";

// localStorage key marking a device as organizer-approved.
export const ADMIN_UNLOCK_KEY = "rmr-admin-unlocked";

export type Organizer = {
  steamId: string; // SteamID64
  name: string;
  owner?: boolean; // the owner can't be removed from the list
};

// Seed list — replace the owner's placeholder SteamID64 with the real one.
export const organizers: Organizer[] = [
  { steamId: "76561198000000000", name: "You (owner)", owner: true },
];
