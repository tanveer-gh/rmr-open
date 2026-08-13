"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { currentTournament, getTeam, matches, roundName } from "@/lib/tournament";

// Demo identity + chat log — real messages persist per match with the database.
const mockUser = "YourSteamName";

type ChatMessage = { user: string; team: string; text: string; time: string };

const initialMessages: ChatMessage[] = [
  {
    user: "YourSteamName",
    team: "Ice Reapers",
    text: "Server is up — NA East, password rmr4. Join when ready.",
    time: "7:58 PM",
  },
  {
    user: "TopShelfCaptain",
    team: "Top Shelf",
    text: "Joining now. GLHF!",
    time: "7:59 PM",
  },
];

export default function MatchRoomPage({
  params,
}: PageProps<"/bracket/[matchId]">) {
  const { matchId } = use(params);
  const match = matches.find((m) => m.id === matchId);
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");

  // Score reporting: both captains can submit; matching scores confirm
  // instantly, and 2 minutes after a lone submission it auto-accepts.
  const [reportA, setReportA] = useState("");
  const [reportB, setReportB] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(120);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    if (!submitted || accepted) return;
    if (secondsLeft <= 0) {
      setAccepted(true);
      return;
    }
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [submitted, accepted, secondsLeft]);

  if (!match) notFound();

  const teamA = getTeam(match.teamA);
  const teamB = getTeam(match.teamB);
  const totalRounds = 3;

  const send = () => {
    if (!draft.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        user: mockUser,
        team: teamA?.name ?? "Your team",
        text: draft.trim(),
        time: "now",
      },
    ]);
    setDraft("");
  };

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
      <Link
        href="/bracket"
        className="text-xs tracking-[0.2em] text-muted uppercase transition-colors hover:text-steel"
      >
        ← Back to bracket
      </Link>

      {/* Match header */}
      <p className="mt-8 text-center text-[10px] tracking-[0.35em] text-muted uppercase">
        RMR Open #{currentTournament.number} —{" "}
        {roundName(match.round, totalRounds)}
      </p>
      <div className="mt-3 flex items-center justify-center gap-5 text-center">
        <span className="flex-1 text-right font-display text-xl font-bold tracking-[0.08em] text-steel-bright uppercase sm:text-2xl">
          {teamA ? teamA.name : "TBD"}
        </span>
        <span className="font-display text-2xl font-bold text-steel-bright tabular-nums">
          {match.scoreA ?? ""}{" "}
          <span className="text-muted">vs</span> {match.scoreB ?? ""}
        </span>
        <span className="flex-1 text-left font-display text-xl font-bold tracking-[0.08em] text-steel-bright uppercase sm:text-2xl">
          {teamB ? teamB.name : "TBD"}
        </span>
      </div>
      <p className="mt-2 text-center text-[10px] tracking-[0.25em] uppercase">
        {match.status === "live" ? (
          <span className="text-blade-red">● Live</span>
        ) : (
          <span className="text-muted">{match.status}</span>
        )}
      </p>

      {/* Match chat */}
      <section className="steel-frame mt-10 flex flex-col bg-card">
        <div className="border-b border-steel-dark/40 px-4 py-3">
          <h2 className="font-display text-sm font-semibold tracking-[0.25em] text-steel uppercase">
            Match Chat
          </h2>
          <p className="mt-1 text-xs text-muted">
            Both teams can coordinate here — server name, password, anything
            important. Visible only to these two rosters.
          </p>
        </div>

        <div className="flex max-h-80 min-h-48 flex-col gap-3 overflow-y-auto px-4 py-4">
          {messages.map((msg, i) => (
            <div key={i}>
              <p className="text-xs">
                <span className="font-semibold text-steel-bright">
                  {msg.user}
                </span>{" "}
                <span className="text-muted">
                  · {msg.team} · {msg.time}
                </span>
              </p>
              <p className="mt-0.5 text-sm leading-5 text-steel">{msg.text}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 border-t border-steel-dark/40 p-3">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder={`Message as ${mockUser}…`}
            className="min-w-0 flex-1 border border-steel-dark bg-abyss px-3 py-2 text-sm text-steel-bright placeholder:text-muted/60 focus:border-steel focus:outline-none"
          />
          <button
            onClick={send}
            className="steel-frame shrink-0 bg-charcoal/60 px-5 py-2 text-xs font-semibold tracking-[0.2em] text-steel uppercase transition-colors hover:bg-charcoal hover:text-steel-bright"
          >
            Send
          </button>
        </div>
      </section>

      <p className="mt-4 text-center text-xs leading-5 text-muted">
        Chat requires being signed in through Steam and on one of these two
        rosters — which every registered player already is. Messages are
        placeholders until the database is connected.
      </p>

      {/* Score reporting — captains only */}
      <section className="steel-frame mt-8 bg-card p-5">
        <h2 className="font-display text-sm font-semibold tracking-[0.25em] text-steel uppercase">
          Report Final Score
        </h2>

        {accepted ? (
          <div className="mt-4">
            <p className="text-sm font-semibold text-green-400">
              ✓ Score accepted — {teamA?.name} {reportA} – {reportB}{" "}
              {teamB?.name}
            </p>
            <p className="mt-2 text-xs leading-5 text-muted">
              Reported by {mockUser}. The opposing captain didn&apos;t confirm
              within 2 minutes, so the lone report was accepted. The bracket
              advances automatically at launch.
            </p>
          </div>
        ) : submitted ? (
          <div className="mt-4">
            <p className="text-sm text-steel-bright">
              Score submitted: {teamA?.name} {reportA} – {reportB}{" "}
              {teamB?.name}
            </p>
            <p className="mt-2 text-xs leading-5 text-muted">
              Waiting for the opposing captain to confirm. If they don&apos;t
              respond, your report is accepted automatically in{" "}
              <span className="font-semibold text-steel-bright tabular-nums">
                {Math.floor(secondsLeft / 60)}:
                {String(secondsLeft % 60).padStart(2, "0")}
              </span>
              .
            </p>
          </div>
        ) : (
          <div className="mt-4">
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-steel">
                <span className="max-w-32 truncate">{teamA?.name}</span>
                <input
                  type="number"
                  min={0}
                  value={reportA}
                  onChange={(e) => setReportA(e.target.value)}
                  aria-label={`${teamA?.name} final score`}
                  className="w-16 border border-steel-dark bg-abyss px-2 py-2 text-center text-sm text-steel-bright focus:border-steel focus:outline-none"
                />
              </label>
              <span className="text-muted">–</span>
              <label className="flex items-center gap-2 text-sm text-steel">
                <input
                  type="number"
                  min={0}
                  value={reportB}
                  onChange={(e) => setReportB(e.target.value)}
                  aria-label={`${teamB?.name} final score`}
                  className="w-16 border border-steel-dark bg-abyss px-2 py-2 text-center text-sm text-steel-bright focus:border-steel focus:outline-none"
                />
                <span className="max-w-32 truncate">{teamB?.name}</span>
              </label>
              <button
                onClick={() => {
                  if (reportA === "" || reportB === "") return;
                  setSubmitted(true);
                }}
                className="steel-frame bg-charcoal/60 px-5 py-2 text-xs font-semibold tracking-[0.2em] text-steel uppercase transition-colors hover:bg-charcoal hover:text-steel-bright"
              >
                Submit Score
              </button>
            </div>
            <p className="mt-3 text-xs leading-5 text-muted">
              Captains only. If both captains submit matching scores, the
              result confirms instantly; if the scores disagree, the organizer
              is flagged to resolve it. If only one captain reports, it&apos;s
              accepted automatically after 2 minutes. (Box-score automation
              replaces this later.)
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
