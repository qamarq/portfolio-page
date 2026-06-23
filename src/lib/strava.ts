import type { ActivitySummary, StravaData } from "./types";

const RUN_GOAL_KM = 50;
const RIDE_GOAL_KM = 150;

async function getAccessToken(): Promise<string | null> {
  const { STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, STRAVA_REFRESH_TOKEN } =
    process.env;
  if (!STRAVA_CLIENT_ID || !STRAVA_CLIENT_SECRET || !STRAVA_REFRESH_TOKEN) {
    return null;
  }

  try {
    const res = await fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: STRAVA_CLIENT_ID,
        client_secret: STRAVA_CLIENT_SECRET,
        refresh_token: STRAVA_REFRESH_TOKEN,
        grant_type: "refresh_token",
      }),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.access_token ?? null;
  } catch {
    return null;
  }
}

function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.round(totalSeconds % 60);

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

interface StravaActivity {
  type: string;
  distance: number;
  moving_time: number;
  start_date: string;
  average_heartrate?: number;
}

function toActivitySummary(activity: StravaActivity): ActivitySummary {
  const distanceKm = Math.round((activity.distance / 1000) * 10) / 10;
  const avgHeartrate = activity.average_heartrate
    ? Math.round(activity.average_heartrate)
    : null;
  const duration = formatDuration(activity.moving_time);

  if (activity.type.includes("Run")) {
    const paceSecPerKm = activity.moving_time / (activity.distance / 1000);
    const pace = `${Math.floor(paceSecPerKm / 60)}:${String(
      Math.round(paceSecPerKm % 60),
    ).padStart(2, "0")}/km`;
    return {
      type: "run",
      label: activity.type === "Run" ? "Run" : activity.type,
      distanceKm,
      pace,
      duration,
      avgHeartrate,
    };
  }

  if (activity.type.includes("Ride")) {
    const speedKmh = distanceKm / (activity.moving_time / 3600);
    return {
      type: "ride",
      label: activity.type === "Ride" ? "Ride" : activity.type,
      distanceKm,
      pace: `${Math.round(speedKmh * 10) / 10} km/h`,
      duration,
      avgHeartrate,
    };
  }

  return {
    type: "other",
    label: activity.type,
    distanceKm,
    pace: null,
    duration,
    avgHeartrate,
  };
}

export async function getStravaData(): Promise<StravaData | null> {
  const token = await getAccessToken();
  if (!token) return null;

  try {
    const after = Math.floor(Date.now() / 1000) - 30 * 24 * 3600;
    const res = await fetch(
      `https://www.strava.com/api/v3/athlete/activities?after=${after}&per_page=50`,
      {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 3600 },
      },
    );
    if (!res.ok) return null;

    const rawActivities: StravaActivity[] = await res.json();

    // Strava returns activities oldest-first when `after` is used.
    const activities = [...rawActivities].sort(
      (a, b) =>
        new Date(b.start_date).getTime() - new Date(a.start_date).getTime(),
    );

    const weekAgo = Date.now() - 7 * 24 * 3600 * 1000;
    const lastWeek = activities.filter(
      (a) => new Date(a.start_date).getTime() >= weekAgo,
    );

    const weeklyRunKm =
      lastWeek
        .filter((a) => a.type.includes("Run"))
        .reduce((sum, a) => sum + a.distance, 0) / 1000;
    const weeklyRideKm =
      lastWeek
        .filter((a) => a.type.includes("Ride"))
        .reduce((sum, a) => sum + a.distance, 0) / 1000;

    return {
      weeklyRunKm: Math.round(weeklyRunKm * 10) / 10,
      weeklyRideKm: Math.round(weeklyRideKm * 10) / 10,
      runGoalKm: RUN_GOAL_KM,
      rideGoalKm: RIDE_GOAL_KM,
      recentActivities: activities.slice(0, 5).map(toActivitySummary),
    };
  } catch {
    return null;
  }
}
