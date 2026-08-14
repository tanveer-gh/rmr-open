"use client";

import { useState, useSyncExternalStore, type ReactNode } from "react";
import { ADMIN_PASSCODE, ADMIN_UNLOCK_KEY } from "@/lib/organizers";

// Passcode gate in front of the organizer console. A correct entry marks
// this device in localStorage so organizers aren't re-prompted every visit.
// At launch, Steam sign-in + the organizer allowlist replaces this entirely.

// Tiny external store around the localStorage unlock flag, so components
// stay in sync with it (including across tabs) without effect-driven state.
let listeners: Array<() => void> = [];

function subscribe(listener: () => void) {
  listeners.push(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
    window.removeEventListener("storage", listener);
  };
}

function getSnapshot() {
  return localStorage.getItem(ADMIN_UNLOCK_KEY) === "yes";
}

// Server render (and first hydration pass) always shows the locked gate.
function getServerSnapshot() {
  return false;
}

function setUnlocked(value: boolean) {
  if (value) {
    localStorage.setItem(ADMIN_UNLOCK_KEY, "yes");
  } else {
    localStorage.removeItem(ADMIN_UNLOCK_KEY);
  }
  listeners.forEach((l) => l());
}

export default function AdminGate({ children }: { children: ReactNode }) {
  const unlocked = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const [attempt, setAttempt] = useState("");
  const [error, setError] = useState(false);

  const submit = () => {
    if (attempt === ADMIN_PASSCODE) {
      setUnlocked(true);
      setAttempt("");
      setError(false);
    } else {
      setError(true);
    }
  };

  if (!unlocked) {
    return (
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
        <div className="steel-frame bg-card p-8 text-center">
          <h1 className="font-display text-2xl font-bold tracking-[0.2em] text-steel-bright uppercase">
            Organizers Only
          </h1>
          <p className="mt-3 text-xs leading-5 text-muted">
            Enter the organizer passcode. This device stays unlocked
            afterward. At launch, organizers on the Steam ID list get in
            automatically instead.
          </p>
          <form
            className="mt-6 flex flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            <input
              type="password"
              autoFocus
              value={attempt}
              onChange={(e) => setAttempt(e.target.value)}
              placeholder="Passcode"
              aria-label="Organizer passcode"
              className="w-full border border-steel-dark bg-abyss px-3 py-2.5 text-center text-sm text-steel-bright placeholder:text-muted/60 focus:border-steel focus:outline-none"
            />
            {error && (
              <p className="text-xs text-blade-red">
                Wrong passcode — ask the tournament owner for access.
              </p>
            )}
            <button
              type="submit"
              className="steel-frame bg-charcoal/60 px-6 py-3 text-sm font-semibold tracking-[0.25em] text-steel uppercase transition-colors hover:bg-charcoal hover:text-steel-bright"
            >
              Unlock
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <>
      {children}
      <div className="mx-auto w-full max-w-4xl px-6 pb-10 text-right">
        <button
          onClick={() => setUnlocked(false)}
          className="text-[10px] tracking-[0.2em] text-muted uppercase transition-colors hover:text-steel"
        >
          Lock this device
        </button>
      </div>
    </>
  );
}
