import type { Service, ServiceStatus } from "./types";

const HEARTBEAT_COUNT = 20;

interface MonitorRef {
  id: number;
  name: string;
}

interface StatusPageConfig {
  publicGroupList: { monitorList: MonitorRef[] }[];
}

interface Heartbeat {
  status: number; // 1 = up, 0 = down, 2 = pending, 3 = maintenance
}

interface HeartbeatResponse {
  heartbeatList: Record<string, Heartbeat[]>;
  uptimeList: Record<string, number>; // key: `${monitorId}_24`
}

export interface HomelabData {
  main: Service[];
  servers: Service[];
}

// Only show these monitors, grouped and ordered as listed here.
const MAIN_MONITORS = [
  "Proxmox",
  "TrueNAS",
  "Jellyfin",
  "My website",
  "Solvro Site",
];
const SERVER_MONITORS = ["SeoHost", "Main WCSS", "Second WCSS"];

export async function getHomelabServices(): Promise<HomelabData | null> {
  const baseUrl = process.env.UPTIME_KUMA_URL;
  const slug = process.env.UPTIME_KUMA_SLUG;
  if (!baseUrl || !slug) return null;

  try {
    const [configRes, heartbeatRes] = await Promise.all([
      fetch(`${baseUrl}/api/status-page/${slug}`, {
        next: { revalidate: 300 },
      }),
      fetch(`${baseUrl}/api/status-page/heartbeat/${slug}`, {
        next: { revalidate: 300 },
      }),
    ]);
    if (!configRes.ok || !heartbeatRes.ok) return null;

    const config: StatusPageConfig = await configRes.json();
    const { heartbeatList, uptimeList }: HeartbeatResponse =
      await heartbeatRes.json();

    const monitors = config.publicGroupList.flatMap((g) => g.monitorList);
    if (monitors.length === 0) return null;

    function toService(monitor: MonitorRef): Service {
      const beats = heartbeatList[monitor.id] ?? [];
      const lastStatus = beats[beats.length - 1]?.status;
      const uptimeRatio = uptimeList[`${monitor.id}_24`];
      const heartbeats: ServiceStatus[] = beats
        .slice(-HEARTBEAT_COUNT)
        .map((b) => (b.status === 1 ? "ok" : "warn"));

      return {
        name: monitor.name,
        status: lastStatus === 1 ? "ok" : "warn",
        uptime:
          uptimeRatio !== undefined
            ? `${(uptimeRatio * 100).toFixed(uptimeRatio >= 0.999 ? 0 : 1)}%`
            : "—",
        heartbeats,
      };
    }

    function pickInOrder(names: string[]): Service[] {
      return names
        .map((name) => monitors.find((m) => m.name === name))
        .filter((m): m is MonitorRef => m !== undefined)
        .map(toService);
    }

    return {
      main: pickInOrder(MAIN_MONITORS),
      servers: pickInOrder(SERVER_MONITORS),
    };
  } catch {
    return null;
  }
}
