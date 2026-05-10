"use client";

import { useEffect, useState } from "react";
import { WeatherIcon } from "@/components/icons/WeatherIcon";
import { fetchWeather, type WeatherData } from "@/lib/weather";

export function Weather() {
  const [data, setData] = useState<WeatherData | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchWeather()
      .then((w) => {
        if (!cancelled) setData(w);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (!data) return null;

  return (
    <span className="hidden sm:inline-flex items-center gap-2 font-pixel text-sm text-muted">
      <span aria-hidden="true">·</span>
      <WeatherIcon condition={data.condition} />
      <span>
        {data.temperature}°F {data.city}
      </span>
    </span>
  );
}
