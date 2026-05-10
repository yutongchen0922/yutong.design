import type { WeatherCondition } from "@/lib/weather";

type Props = {
  condition: WeatherCondition;
  className?: string;
};

export function WeatherIcon({ condition, className }: Props) {
  const base = {
    viewBox: "0 0 24 24",
    width: "1em",
    height: "1em",
    fill: "currentColor",
    shapeRendering: "crispEdges" as const,
    className,
    "aria-hidden": true,
  };

  switch (condition) {
    case "clear":
      return (
        <svg {...base}>
          <rect x="9" y="9" width="6" height="6" />
          <rect x="11" y="3" width="2" height="3" />
          <rect x="11" y="18" width="2" height="3" />
          <rect x="3" y="11" width="3" height="2" />
          <rect x="18" y="11" width="3" height="2" />
          <rect x="5" y="5" width="2" height="2" />
          <rect x="17" y="5" width="2" height="2" />
          <rect x="5" y="17" width="2" height="2" />
          <rect x="17" y="17" width="2" height="2" />
        </svg>
      );

    case "cloudy":
      return (
        <svg {...base}>
          <rect x="9" y="7" width="6" height="2" />
          <rect x="7" y="9" width="10" height="2" />
          <rect x="5" y="11" width="14" height="2" />
          <rect x="4" y="13" width="16" height="5" />
        </svg>
      );

    case "partly-cloudy":
      return (
        <svg {...base}>
          <rect x="4" y="4" width="4" height="4" />
          <rect x="5" y="1" width="2" height="2" />
          <rect x="1" y="5" width="2" height="2" />
          <rect x="9" y="11" width="8" height="2" />
          <rect x="7" y="13" width="12" height="2" />
          <rect x="6" y="15" width="14" height="5" />
        </svg>
      );

    case "fog":
      return (
        <svg {...base}>
          <rect x="4" y="6" width="16" height="2" />
          <rect x="3" y="11" width="18" height="2" />
          <rect x="5" y="16" width="14" height="2" />
        </svg>
      );

    case "rain":
      return (
        <svg {...base}>
          <rect x="6" y="1" width="12" height="2" />
          <rect x="4" y="3" width="16" height="5" />
          <rect x="6" y="12" width="2" height="3" />
          <rect x="11" y="12" width="2" height="3" />
          <rect x="16" y="12" width="2" height="3" />
          <rect x="8" y="17" width="2" height="3" />
          <rect x="14" y="17" width="2" height="3" />
        </svg>
      );

    case "snow":
      return (
        <svg {...base}>
          <rect x="6" y="1" width="12" height="2" />
          <rect x="4" y="3" width="16" height="5" />
          <rect x="6" y="12" width="2" height="2" />
          <rect x="11" y="12" width="2" height="2" />
          <rect x="16" y="12" width="2" height="2" />
          <rect x="8" y="17" width="2" height="2" />
          <rect x="14" y="17" width="2" height="2" />
        </svg>
      );

    case "thunderstorm":
      return (
        <svg {...base}>
          <rect x="6" y="1" width="12" height="2" />
          <rect x="4" y="3" width="16" height="5" />
          <rect x="13" y="10" width="4" height="2" />
          <rect x="11" y="12" width="4" height="2" />
          <rect x="9" y="14" width="6" height="2" />
          <rect x="11" y="16" width="2" height="3" />
          <rect x="10" y="19" width="2" height="2" />
        </svg>
      );
  }
}
