import type { WeatherData } from "./types";

export async function getWeather(): Promise<WeatherData | null> {
  try {
    const res = await fetch("https://wttr.in/Wroclaw?format=j1", {
      next: { revalidate: 1800 },
      headers: { "User-Agent": "curl" },
    });
    if (!res.ok) return null;

    const json = await res.json();
    const current = json?.current_condition?.[0];
    if (!current) return null;

    return {
      temp: Number(current.temp_C),
      condition: current.weatherDesc?.[0]?.value?.trim() ?? "Unknown",
    };
  } catch {
    return null;
  }
}
