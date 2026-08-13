"use client";

import { useEffect, useState } from "react";

// Time until next Saturday 8:00 PM Eastern, computed in the ET frame so it
// shows the same countdown no matter the viewer's timezone.
function getTimeLeft() {
  const nowET = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/New_York" }),
  );

  const target = new Date(nowET);
  const daysUntilSaturday = (6 - nowET.getDay() + 7) % 7;
  target.setDate(nowET.getDate() + daysUntilSaturday);
  target.setHours(20, 0, 0, 0);
  if (target <= nowET) {
    target.setDate(target.getDate() + 7);
  }

  let diff = Math.floor((target.getTime() - nowET.getTime()) / 1000);
  const days = Math.floor(diff / 86400);
  diff -= days * 86400;
  const hours = Math.floor(diff / 3600);
  diff -= hours * 3600;
  const minutes = Math.floor(diff / 60);
  const seconds = diff - minutes * 60;

  return { days, hours, minutes, seconds };
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<ReturnType<
    typeof getTimeLeft
  > | null>(null);

  useEffect(() => {
    setTimeLeft(getTimeLeft());
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const segments = [
    { label: "Days", value: timeLeft?.days },
    { label: "Hours", value: timeLeft?.hours },
    { label: "Mins", value: timeLeft?.minutes },
    { label: "Secs", value: timeLeft?.seconds },
  ];

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <p className="text-xs tracking-[0.3em] text-muted uppercase">
        Saturday 8:00 PM EST
      </p>
      <div className="flex w-full items-start justify-between">
        {segments.map(({ label, value }) => (
          <div key={label} className="flex flex-col items-center gap-1">
            <span className="font-display text-3xl font-semibold text-steel-bright tabular-nums sm:text-4xl">
              {value === undefined ? "--" : String(value).padStart(2, "0")}
            </span>
            <span className="text-[10px] tracking-[0.2em] text-muted uppercase">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
