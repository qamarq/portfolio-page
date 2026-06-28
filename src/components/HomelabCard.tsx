import type { Service } from "@/lib/types";
import { getHomelabServices } from "@/lib/homelab";
import { SkeletonBar } from "./Skeleton";

export function HomelabCardSkeleton() {
  return (
    <div className="card">
      <p className="card-label">homelab</p>
      <div className="flex flex-col gap-2.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonBar key={i} className="h-3.5 w-full" />
        ))}
      </div>
    </div>
  );
}

function HeartbeatBars({ heartbeats }: { heartbeats: Service["heartbeats"] }) {
  return (
    <div className="flex items-center gap-0.5">
      {heartbeats.map((status, i) => (
        <span
          key={i}
          className="h-2.5 w-0.75 rounded-full"
          style={{
            background:
              status === "ok" ? "var(--status-ok)" : "var(--status-danger)",
          }}
        />
      ))}
    </div>
  );
}

function ServiceRow({ service }: { service: Service }) {
  return (
    <div className="flex items-center gap-2 text-[12px]">
      <span
        className="h-1.5 w-1.5 shrink-0 rounded-full"
        style={{
          background:
            service.status === "ok" ? "var(--status-ok)" : "var(--status-warn)",
        }}
      />
      <span className="min-w-0 flex-1 truncate text-(--text-secondary)">
        {service.name}
      </span>
      <HeartbeatBars heartbeats={service.heartbeats} />
      <span className="ml-auto shrink-0 font-mono text-[11px] text-(--text-muted)">
        {service.uptime}
      </span>
    </div>
  );
}

export async function HomelabCard() {
  const data = await getHomelabServices();

  if (!data) {
    return (
      <div className="card">
        <p className="card-label">homelab</p>
        <p className="font-mono text-xs text-(--text-muted)">no data</p>
      </div>
    );
  }

  return (
    <div className="card">
      <p className="card-label">homelab</p>
      <div className="flex flex-col gap-2.5">
        {data.main.map((service) => (
          <ServiceRow key={service.name} service={service} />
        ))}
      </div>

      {data.servers.length > 0 && (
        <div className="mt-4 border-t border-(--muted-bg) pt-3">
          <p className="mb-2.5 font-mono text-[10px] uppercase tracking-wider text-(--text-muted)">
            servers
          </p>
          <div className="flex flex-col gap-2.5">
            {data.servers.map((service) => (
              <ServiceRow key={service.name} service={service} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
