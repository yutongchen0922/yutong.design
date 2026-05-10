"use client";

import { useEffect, useState } from "react";

const formatter = new Intl.DateTimeFormat(undefined, {
  hour: "numeric",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
  timeZoneName: "short",
});

export function Clock() {
  const [date, setDate] = useState<Date | null>(null);

  useEffect(() => {
    setDate(new Date());
    const id = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="hidden sm:inline-block font-pixel text-sm tabular-nums text-muted">
      {date ? (
        formatter.format(date)
      ) : (
        <span className="invisible">12:34:56 PM PDT</span>
      )}
    </span>
  );
}
