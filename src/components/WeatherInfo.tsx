import { getWeather } from "@/lib/weather";

export async function WeatherCondition() {
  const weather = await getWeather();
  return (
    <p className="font-mono text-[11px] text-(--text-muted)">
      {weather?.condition ?? "no data"}
    </p>
  );
}

export async function WeatherTemp() {
  const weather = await getWeather();
  if (!weather) return null;

  return (
    <p className="font-mono text-[11px] text-(--text-muted)">
      {weather.temp}°C
    </p>
  );
}
