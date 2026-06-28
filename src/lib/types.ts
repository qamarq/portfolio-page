import type { ReactNode } from "react";

export type TagColor = "teal" | "blue" | "purple";

export interface Tag {
  label: string;
  color: TagColor;
  icon?: ReactNode;
}

export type ProjectStatus = "active" | "wip" | "shipped";

export interface Project {
  name: string;
  status: ProjectStatus;
  desc: string;
  tags: Tag[];
  websiteUrl: string | null;
  githubUrl: string | null;
  icon?: ReactNode;
}

export interface AboutContent {
  name: string;
  title: string;
  avatar: string | null;
  tags: Tag[];
  bio: string;
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
  monthlyRunKm: number;
  monthlyRideKm: number;
  runGoalKm: number;
  rideGoalKm: number;
  recentActivities: ActivitySummary[];
}

export interface NowPlayingData {
  track: string;
  artist: string;
  albumArt: string | null;
  isLive: boolean;
  scrobbledAt: string | null;
  // only present when isLive=true
  progressMs?: number;
  durationMs?: number;
  fetchedAt?: number; // Date.now() on server at fetch time
}

export interface WeatherData {
  temp: number;
  condition: string;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string; // ISO date, e.g. "2026-05-01"
  excerpt: string;
  tags: Tag[];
}

export interface BlogPost extends BlogPostMeta {
  html: string;
}
