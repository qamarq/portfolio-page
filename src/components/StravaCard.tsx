import {
  Activity,
  Bike,
  Dumbbell,
  Footprints,
  HeartPulse,
  type LucideIcon,
  Mountain,
  MountainSnow,
  PersonStanding,
  Sailboat,
  Volleyball,
  Waves,
} from "lucide-react";
import { getStravaData } from "@/lib/strava";
import { SkeletonBar } from "./Skeleton";
import type { ActivitySummary, ActivityType } from "@/lib/types";

export function StravaCardSkeleton() {
  return (
    <div className="card">
      <p className="card-label">strava</p>
      <SkeletonBar className="h-6 w-32" />
      <SkeletonBar className="mt-1.5 h-1 w-full" />
      <SkeletonBar className="mt-3 h-6 w-32" />
      <SkeletonBar className="mt-1.5 h-1 w-full" />
      <div className="mt-4 flex flex-col gap-2 border-t border-(--muted-bg) pt-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonBar key={i} className="h-3.5 w-full" />
        ))}
      </div>
    </div>
  );
}

// Keyed by Strava's raw activity `type` string for specific icons,
// falls back to a generic icon per category (run/ride/other).
const ICON_BY_LABEL: Record<string, LucideIcon> = {
  Walk: Footprints,
  Hike: Mountain,
  Swim: Waves,
  Soccer: Volleyball,
  Basketball: Volleyball,
  Tennis: Volleyball,
  Golf: Volleyball,
  Workout: Dumbbell,
  WeightTraining: Dumbbell,
  Crossfit: Dumbbell,
  Yoga: PersonStanding,
  AlpineSki: MountainSnow,
  NordicSki: MountainSnow,
  BackcountrySki: MountainSnow,
  Snowboard: MountainSnow,
  Kayaking: Sailboat,
  Canoeing: Sailboat,
  Rowing: Waves,
  Sail: Sailboat,
};

const ACTIVITY_ICONS: Record<ActivityType, LucideIcon> = {
  run: Footprints,
  ride: Bike,
  other: Activity,
};

const ACTIVITY_COLORS: Record<ActivityType, string> = {
  run: "text-(--accent)",
  ride: "text-(--blue)",
  other: "text-(--purple)",
};

function ActivityRow({ activity }: { activity: ActivitySummary }) {
  const Icon = ICON_BY_LABEL[activity.label] ?? ACTIVITY_ICONS[activity.type];

  return (
    <div className="flex items-center gap-2 font-mono text-[11px] text-(--text-muted)">
      <Icon
        className={`h-3.5 w-3.5 shrink-0 ${ACTIVITY_COLORS[activity.type]}`}
      />
      <span>
        {activity.label}
        {activity.distanceKm > 0 && ` · ${activity.distanceKm}km`}
        {activity.pace && ` · ${activity.pace}`} · {activity.duration}
      </span>
      {activity.avgHeartrate !== null && (
        <span className="ml-auto flex items-center gap-1 text-(--warning)">
          <HeartPulse className="h-3 w-3" />
          {activity.avgHeartrate}
        </span>
      )}
    </div>
  );
}

export async function StravaCard() {
  const data = await getStravaData();

  if (!data) {
    return (
      <div className="card">
        <p className="card-label">strava</p>
        <p className="font-mono text-xs text-(--text-muted)">no data</p>
      </div>
    );
  }

  const {
    monthlyRunKm,
    monthlyRideKm,
    runGoalKm,
    rideGoalKm,
    recentActivities,
  } = data;

  const runProgress = Math.min(
    100,
    Math.round((monthlyRunKm / runGoalKm) * 100),
  );
  const rideProgress = Math.min(
    100,
    Math.round((monthlyRideKm / rideGoalKm) * 100),
  );

  return (
    <div className="card">
      <p className="card-label">strava</p>

      <div className="flex items-center gap-2">
        <Footprints className="h-4 w-4 shrink-0 text-(--accent)" />
        <span className="font-mono text-lg text-foreground">{monthlyRunKm}</span>
        <span className="text-xs text-(--text-muted)">km running</span>
        <span className="ml-auto font-mono text-xs text-(--text-muted)">
          {runProgress}%
        </span>
      </div>
      <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-(--muted-bg)">
        <div
          className="h-full rounded-full bg-(--accent)"
          style={{ width: `${runProgress}%` }}
        />
      </div>

      <div className="mt-3 flex items-center gap-2">
        <Bike className="h-4 w-4 shrink-0 text-(--blue)" />
        <span className="font-mono text-lg text-foreground">
          {monthlyRideKm}
        </span>
        <span className="text-xs text-(--text-muted)">km cycling</span>
        <span className="ml-auto font-mono text-xs text-(--text-muted)">
          {rideProgress}%
        </span>
      </div>
      <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-(--muted-bg)">
        <div
          className="h-full rounded-full bg-(--blue)"
          style={{ width: `${rideProgress}%` }}
        />
      </div>

      <div className="mt-4 flex flex-col gap-2 border-t border-(--muted-bg) pt-3">
        {recentActivities.map((activity, i) => (
          <ActivityRow key={i} activity={activity} />
        ))}
      </div>
    </div>
  );
}
