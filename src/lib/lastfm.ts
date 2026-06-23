import type { NowPlayingData } from "./types";

function pickImage(image: { size: string; "#text": string }[] | undefined) {
  if (!image) return null;
  const preferred =
    image.find((i) => i.size === "extralarge") ??
    image.find((i) => i.size === "large") ??
    image[image.length - 1];
  return preferred?.["#text"] || null;
}

function timeAgo(unixSeconds: number): string {
  const seconds = Math.floor(Date.now() / 1000) - unixSeconds;
  const hours = Math.floor(seconds / 3600);
  if (hours < 1) return `${Math.max(1, Math.floor(seconds / 60))}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export async function getNowPlaying(): Promise<NowPlayingData | null> {
  const apiKey = process.env.LASTFM_API_KEY;
  const username = process.env.LASTFM_USERNAME;
  if (!apiKey || !username) return null;

  try {
    const res = await fetch(
      `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=1`,
      { next: { revalidate: 30 } },
    );
    if (!res.ok) return null;

    const json = await res.json();
    const track = json?.recenttracks?.track?.[0];
    if (!track) return null;

    const isLive = track["@attr"]?.nowplaying === "true";
    const uts = track.date?.uts;

    return {
      track: track.name,
      artist: track.artist?.["#text"] ?? "",
      albumArt: pickImage(track.image),
      isLive,
      scrobbledAt: !isLive && uts ? timeAgo(Number(uts)) : null,
    };
  } catch {
    return null;
  }
}
