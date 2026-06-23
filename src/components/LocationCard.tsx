import { Suspense } from "react";
import { ClockDisplay } from "./ClockDisplay";
import { WeatherCondition, WeatherTemp } from "./WeatherInfo";
import { SkeletonBar } from "./Skeleton";

export function LocationCard() {
  return (
    <div className="card">
      <p className="card-label">location</p>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-[13px] text-[var(--text-primary)]">Wrocław, PL</p>
          <Suspense fallback={<SkeletonBar className="h-3.5 w-20" />}>
            <WeatherCondition />
          </Suspense>
        </div>
        <div className="text-right">
          <ClockDisplay timeZone="Europe/Warsaw" />
          <Suspense fallback={<SkeletonBar className="ml-auto h-3.5 w-10" />}>
            <WeatherTemp />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
