import { getWeather } from "@/lib/weather";
import { ClockDisplay } from "./ClockDisplay";

export async function LocationCard() {
  const weather = await getWeather();

  return (
    <div className="card">
      <p className="card-label">location</p>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-[13px] text-[var(--text-primary)]">Wrocław, PL</p>
          <p className="font-mono text-[11px] text-(--text-muted)">
            {weather?.condition ?? "no data"}
          </p>
        </div>
        <div className="text-right">
          <ClockDisplay timeZone="Europe/Warsaw" />
          {weather && (
            <p className="font-mono text-[11px] text-(--text-muted)">
              {weather.temp}°C
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
