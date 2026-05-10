export type WeatherCondition =
  | "clear"
  | "partly-cloudy"
  | "cloudy"
  | "fog"
  | "rain"
  | "snow"
  | "thunderstorm";

export type WeatherData = {
  temperature: number;
  condition: WeatherCondition;
  city: string;
};

type IpApiResponse = {
  latitude: number;
  longitude: number;
  city: string;
};

type OpenMeteoResponse = {
  current: {
    temperature_2m: number;
    weather_code: number;
  };
};

function wmoToCondition(code: number): WeatherCondition {
  if (code === 0 || code === 1) return "clear";
  if (code === 2) return "partly-cloudy";
  if (code === 3) return "cloudy";
  if (code === 45 || code === 48) return "fog";
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return "rain";
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return "snow";
  if (code >= 95) return "thunderstorm";
  return "cloudy";
}

export async function fetchWeather(): Promise<WeatherData> {
  const locRes = await fetch("https://ipapi.co/json/");
  if (!locRes.ok) throw new Error("location fetch failed");
  const loc = (await locRes.json()) as IpApiResponse;

  const wxUrl = `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current=temperature_2m,weather_code&temperature_unit=fahrenheit`;
  const wxRes = await fetch(wxUrl);
  if (!wxRes.ok) throw new Error("weather fetch failed");
  const wx = (await wxRes.json()) as OpenMeteoResponse;

  return {
    temperature: Math.round(wx.current.temperature_2m),
    condition: wmoToCondition(wx.current.weather_code),
    city: loc.city,
  };
}
