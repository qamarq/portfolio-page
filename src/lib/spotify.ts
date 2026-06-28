import type { NowPlayingData } from "./types";

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_URL =
  "https://api.spotify.com/v1/me/player/currently-playing";
const RECENTLY_PLAYED_URL =
  "https://api.spotify.com/v1/me/player/recently-played?limit=1";

function timeAgo(isoString: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(isoString).getTime()) / 1000,
  );
  const hours = Math.floor(seconds / 3600);
  if (hours < 1) return `${Math.max(1, Math.floor(seconds / 60))}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function pickAlbumArt(
  images: { url: string; width: number; height: number }[],
): string | null {
  if (!images?.length) return null;
  // Prefer 300×300, fallback to largest available.
  return (
    images.find((img) => img.width === 300)?.url ??
    images.sort((a, b) => b.width - a.width)[0]?.url ??
    null
  );
}

async function getAccessToken(): Promise<string | null> {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } =
    process.env;
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) {
    return null;
  }

  const basic = Buffer.from(
    `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`,
  ).toString("base64");

  try {
    const res = await fetch(TOKEN_URL, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: SPOTIFY_REFRESH_TOKEN,
      }),
      next: { revalidate: 3500 }, // access token is valid for 3600s
    });
    if (!res.ok) return null;
    const json = await res.json();
    return (json.access_token as string) ?? null;
  } catch {
    return null;
  }
}

async function getNowPlayingImpl(): Promise<NowPlayingData | null> {
  const token = await getAccessToken();
  if (!token) return null;

  const headers = { Authorization: `Bearer ${token}` };

  try {
    const fetchedAt = Date.now();
    const res = await fetch(NOW_PLAYING_URL, {
      headers,
      cache: "no-store",
    });

    // 204 = no track playing at all; 200 with is_playing=false = paused
    if (res.status !== 200) {
      return await getRecentlyPlayed(token);
    }

    const json = await res.json();
    const track = json?.item;
    if (!track) return getRecentlyPlayed(token);

    const isLive = json.is_playing === true;

    return {
      track: track.name as string,
      artist: (track.artists as { name: string }[])
        .map((a) => a.name)
        .join(", "),
      albumArt: pickAlbumArt(track.album?.images ?? []),
      isLive,
      scrobbledAt: null,
      ...(isLive && {
        progressMs: json.progress_ms as number,
        durationMs: track.duration_ms as number,
        fetchedAt,
      }),
    };
  } catch {
    return null;
  }
}

async function getRecentlyPlayed(
  token: string,
): Promise<NowPlayingData | null> {
  try {
    const res = await fetch(RECENTLY_PLAYED_URL, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;

    const json = await res.json();
    const item = json?.items?.[0];
    if (!item) return null;

    const track = item.track;
    return {
      track: track.name as string,
      artist: (track.artists as { name: string }[])
        .map((a) => a.name)
        .join(", "),
      albumArt: pickAlbumArt(track.album?.images ?? []),
      isLive: false,
      scrobbledAt: timeAgo(item.played_at as string),
    };
  } catch {
    return null;
  }
}

export const getNowPlaying = getNowPlayingImpl;
