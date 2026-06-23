export type TagColor = "teal" | "blue" | "purple";

export interface Tag {
  label: string;
  color: TagColor;
}

export type ProjectStatus = "active" | "wip" | "shipped";

export interface Project {
  name: string;
  status: ProjectStatus;
  desc: string;
  tags: Tag[];
  websiteUrl: string | null;
  githubUrl: string | null;
}

export interface Commit {
  message: string;
  author: string;
  repo: string;
  timeAgo: string;
}

export interface Organization {
  login: string;
  avatarUrl: string | null;
}

export interface HeatmapData {
  weeks: number[][]; // 52 weeks x 7 days, values 0-4
  monthLabels: { label: string; week: number }[];
  totalContributions: number;
  organizations: Organization[];
}

export type ServiceStatus = "ok" | "warn";

export interface Service {
  name: string;
  status: ServiceStatus;
  uptime: string;
  heartbeats: ServiceStatus[]; // most recent last
}

export type ActivityType = "run" | "ride" | "other";

export interface ActivitySummary {
  type: ActivityType;
  label: string; // e.g. "Run", "Ride", "Soccer", "Workout"
  distanceKm: number;
  pace: string | null; // run: min/km, ride: km/h, other: null
  duration: string;
  avgHeartrate: number | null;
}

export interface StravaData {
  weeklyRunKm: number;
  weeklyRideKm: number;
  runGoalKm: number;
  rideGoalKm: number;
  recentActivities: ActivitySummary[];
}

export interface NowPlayingData {
  track: string;
  artist: string;
  albumArt: string | null;
  isLive: boolean;
  scrobbledAt: string | null; // e.g. "2h ago", null if currently playing
}

export interface WeatherData {
  temp: number;
  condition: string;
}
