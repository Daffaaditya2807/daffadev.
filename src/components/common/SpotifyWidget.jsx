import { useEffect, useState } from "react";

function SpotifyWidget() {
  const [trackData, setTrackData] = useState({
    title: "Loading...",
    artist: "Spotify",
    albumArt: "",
    url: "#",
    isPlaying: false,
  });

  useEffect(() => {
    let isMounted = true; // Flag untuk mencegah state update jika komponen sudah unmount

    const getAccessToken = async () => {
      const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
      const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
      const refreshToken = import.meta.env.VITE_SPOTIFY_REFRESH_TOKEN;

      const basicAuth = btoa(`${clientId}:${clientSecret}`);

      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          Authorization: `Basic ${basicAuth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        }),
      });

      const data = await response.json();
      return data.access_token;
    };

    const fetchSpotifyData = async () => {
      try {
        const token = await getAccessToken();

        // 1. Cek lagu yang sedang diputar (Currently Playing)
        const nowPlayingRes = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (nowPlayingRes.status === 200) {
          const data = await nowPlayingRes.json();
          // Pastikan is_playing true dan item tidak null
          if (data.is_playing && data.item) {
            if (isMounted) {
              setTrackData({
                title: data.item.name,
                artist: data.item.artists.map((a) => a.name).join(", "),
                albumArt: data.item.album.images[0]?.url,
                url: data.item.external_urls.spotify,
                isPlaying: true,
              });
            }
            return; // Hentikan eksekusi di sini jika ada lagu yang sedang play
          }
        }

        // 2. Fallback: Cek lagu terakhir diputar (Recently Played)
        // Akan tereksekusi jika status 204 (No Content) atau is_playing false
        const recentlyRes = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=1", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (recentlyRes.status === 200) {
          const data = await recentlyRes.json();
          if (data.items && data.items.length > 0) {
            const track = data.items[0].track;
            if (isMounted) {
              setTrackData({
                title: track.name,
                artist: track.artists.map((a) => a.name).join(", "),
                albumArt: track.album.images[0]?.url,
                url: track.external_urls.spotify,
                isPlaying: false,
              });
            }
          }
        }
      } catch (error) {
        console.error("Gagal mengambil data Spotify:", error);
        if (isMounted) {
          setTrackData((prev) => ({ ...prev, title: "Spotify Unavailable" }));
        }
      }
    };

    // Panggil fungsi saat pertama kali komponen dirender
    fetchSpotifyData();
    
    // Polling setiap 30 detik untuk update UI jika lagu berganti
    const interval = setInterval(fetchSpotifyData, 30000);
    
    // Cleanup function: hentikan interval dan matikan flag saat komponen unmount
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []); // Array dependensi kosong: Effect hanya berjalan 1x saat mount

  if (!trackData.albumArt) return null;

return (
  <a
    href={trackData.url}
    target="_blank"
    rel="noopener noreferrer"
    className="
      fixed bottom-4 right-4 z-50 md:bottom-6 md:right-6
      group flex items-center gap-3
      rounded-2xl border border-white/20
      bg-white/10 p-3
      shadow-[0_8px_32px_rgba(0,0,0,0.35)]
      backdrop-blur-2xl
      transition-all duration-300
      hover:scale-105 hover:border-white/35 hover:bg-white/15
      before:absolute before:inset-0 before:rounded-2xl
      before:bg-linear-to-br before:from-white/25 before:via-white/5 before:to-transparent
      before:opacity-70 before:pointer-events-none
      after:absolute after:inset-px after:rounded-2xl
      after:border after:border-white/10
      after:pointer-events-none
      overflow-hidden
    "
  >
    {/* Liquid blur accent */}
    <div className="absolute -left-6 -top-6 h-20 w-20 rounded-full bg-[#1DB954]/25 blur-2xl transition-all duration-300 group-hover:bg-[#1DB954]/35" />
    <div className="absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-white/10 blur-2xl" />

    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/20 shadow-md">
      <img
        src={trackData.albumArt}
        alt="Album Art"
        className="h-full w-full object-cover"
      />

      {/* Glass shine on image */}
      <div className="absolute inset-0 bg-linear-to-br from-white/20 via-transparent to-black/20" />
    </div>

    <div className="relative flex max-w-37.5 flex-col justify-center">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#1DB954] drop-shadow">
          {trackData.isPlaying ? "Now Playing" : "Last Played"}
        </span>

        {trackData.isPlaying && (
          <span className="flex h-2 items-center gap-0.5">
            <span
              className="h-full w-0.5 animate-bounce rounded-full bg-[#1DB954]"
              style={{ animationDelay: "0ms" }}
            ></span>
            <span
              className="h-full w-0.5 animate-bounce rounded-full bg-[#1DB954]"
              style={{ animationDelay: "150ms" }}
            ></span>
            <span
              className="h-full w-0.5 animate-bounce rounded-full bg-[#1DB954]"
              style={{ animationDelay: "300ms" }}
            ></span>
          </span>
        )}
      </div>

      <p className="truncate text-sm font-semibold text-white drop-shadow-sm">
        {trackData.title}
      </p>
      <p className="truncate text-xs text-white/60">
        {trackData.artist}
      </p>
    </div>
  </a>
);
}

export default SpotifyWidget;
