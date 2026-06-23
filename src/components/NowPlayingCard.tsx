import Image from "next/image";
import { getNowPlaying } from "@/lib/lastfm";

export async function NowPlayingCard() {
  const data = await getNowPlaying();

  if (!data) {
    return (
      <div className="card">
        <p className="card-label">now playing</p>
        <p className="font-mono text-xs text-(--text-muted)">no data</p>
      </div>
    );
  }

  const { track, artist, albumArt, isLive, scrobbledAt } = data;

  return (
    <div className="card">
      <p className="card-label">now playing</p>

      <div className="flex items-center gap-3">
        {albumArt ? (
          <Image
            src={albumArt}
            alt={track}
            width={48}
            height={48}
            className="h-12 w-12 shrink-0 rounded-md object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-[var(--tag-purple-bg)] text-[var(--purple)]">
            ♪
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-[13px] text-[var(--text-primary)]">
            {track}
          </p>
          <p className="truncate text-[12px] text-(--text-muted)">{artist}</p>
        </div>
        <span className="ml-auto shrink-0 font-mono text-[10px] text-(--text-muted)">
          {isLive ? (
            <span className="text-[var(--accent)]">live</span>
          ) : (
            scrobbledAt
          )}
        </span>
      </div>
    </div>
  );
}
