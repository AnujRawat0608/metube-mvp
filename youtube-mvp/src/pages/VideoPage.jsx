import { useParams } from "react-router-dom";
import { useEffect, useRef, useState, useCallback } from "react";

function VideoPage() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [related, setRelated] = useState([]);
  const [error, setError] = useState(null);

  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const hideControlsTimer = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  // ── Fetch video ──────────────────────────────────────────────────────────
  useEffect(() => {
    setVideo(null);
    setError(null);
    setVideoReady(false);
    setPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);

    fetch("http://localhost:5000/api/videos")
      .then((res) => res.json())
      .then((data) => {
        // Match by string OR number — URL params are always strings
        const selected = data.find((v) => String(v.id) === String(id));
        if (!selected) { setError("Video not found"); return; }
        setVideo(selected);
        setRelated(data.filter((v) => String(v.id) !== String(id)).slice(0, 6));
      })
      .catch(() => setError("Failed to load video"));
  }, [id]);

  // ── Auto-hide controls ───────────────────────────────────────────────────
  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    clearTimeout(hideControlsTimer.current);
    hideControlsTimer.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  }, []);

  useEffect(() => () => clearTimeout(hideControlsTimer.current), []);

  // ── Player handlers ──────────────────────────────────────────────────────
  const onTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    setCurrentTime(v.currentTime);
    setProgress((v.currentTime / v.duration) * 100);
    if (v.buffered.length > 0) {
      setBuffered((v.buffered.end(v.buffered.length - 1) / v.duration) * 100);
    }
  };

  const onLoadedMetadata = () => {
    const v = videoRef.current;
    if (v) setDuration(v.duration);
  };

  const onCanPlay = () => setVideoReady(true);

  const onVideoError = (e) => {
    console.error("Video error:", e);
    setError("Video could not be played. Make sure your Supabase bucket is set to Public.");
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v || !videoReady) return;
    if (v.paused) {
      v.play().catch((err) => {
        console.error("Play failed:", err);
        setError("Playback failed: " + err.message);
      });
    } else {
      v.pause();
    }
    resetHideTimer();
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const changeVolume = (val) => {
    const v = videoRef.current;
    if (!v) return;
    v.volume = val;
    setVolume(val);
    setMuted(val === 0);
  };

  const seek = (e) => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    v.currentTime = pct * v.duration;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const fmt = (s) => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  // ── Keyboard shortcuts ───────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === "INPUT") return;
      if (e.code === "Space") { e.preventDefault(); togglePlay(); }
      if (e.code === "KeyF") toggleFullscreen();
      if (e.code === "KeyM") toggleMute();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [videoReady]);

  // ── States ───────────────────────────────────────────────────────────────
  if (!video && !error) {
    return (
      <div className="ml-0 md:ml-20 lg:ml-56 pt-20 bg-[#0f0f0f] min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading video...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ml-0 md:ml-20 lg:ml-56 pt-20 bg-[#0f0f0f] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 font-medium">{error}</p>
          <p className="text-gray-500 text-sm mt-2">
            Go to Supabase → Storage → videos bucket → Make it Public
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="ml-0 md:ml-20 lg:ml-56 pt-16 bg-[#0f0f0f] min-h-screen text-white">
      <div className="flex flex-col lg:flex-row gap-6 p-4 lg:p-6 max-w-[1400px] mx-auto">

        {/* ── LEFT: Player + Info ── */}
        <div className="flex-1 min-w-0">

          {/* PLAYER */}
          <div
            ref={containerRef}
            className="relative w-full bg-black rounded-xl overflow-hidden"
            style={{ aspectRatio: "16/9", cursor: showControls ? "default" : "none" }}
            onMouseMove={resetHideTimer}
            onMouseLeave={() => playing && setShowControls(false)}
            onClick={togglePlay}
          >
            {/*
              KEY FIXES FOR SUPABASE:
              1. key={video.video_url}   → forces re-mount when video changes
              2. crossOrigin="anonymous" → required for Supabase Storage CORS
              3. preload="metadata"      → loads duration without buffering full video
              4. playsInline             → prevents iOS from going fullscreen automatically
            */}
            <video
              ref={videoRef}
              key={video.video_url}
              src={video.video_url}
              crossOrigin="anonymous"
              preload="metadata"
              playsInline
              className="w-full h-full object-contain"
              onTimeUpdate={onTimeUpdate}
              onLoadedMetadata={onLoadedMetadata}
              onCanPlay={onCanPlay}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onEnded={() => { setPlaying(false); setShowControls(true); }}
              onError={onVideoError}
            />

            {/* Spinner while buffering */}
            {!videoReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 pointer-events-none">
                <div className="w-10 h-10 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}

            {/* Big play icon when paused */}
            {videoReady && !playing && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-black/40 rounded-full p-5">
                  <PlayIcon className="w-10 h-10 text-white" />
                </div>
              </div>
            )}

            {/* Top gradient + title */}
            <div
              className="absolute inset-x-0 top-0 h-24 pointer-events-none transition-opacity duration-300"
              style={{
                background: "linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, transparent 100%)",
                opacity: showControls ? 1 : 0,
              }}
            />
            <div
              className="absolute top-0 left-0 right-0 px-5 pt-4 transition-opacity duration-300 pointer-events-none"
              style={{ opacity: showControls ? 1 : 0 }}
            >
              <p className="text-white font-medium text-sm drop-shadow">{video.title}</p>
            </div>

            {/* Bottom gradient */}
            <div
              className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, transparent 100%)" }}
            />

            {/* CONTROLS */}
            <div
              className="absolute bottom-0 left-0 right-0 px-4 pb-4 transition-opacity duration-300"
              style={{ opacity: showControls ? 1 : 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Progress bar */}
              <div
                className="relative w-full h-1 rounded-full cursor-pointer mb-3 group/prog"
                style={{ background: "rgba(255,255,255,0.2)" }}
                onClick={seek}
              >
                <div
                  className="absolute left-0 top-0 h-full rounded-full"
                  style={{ width: `${buffered}%`, background: "rgba(255,255,255,0.35)" }}
                />
                <div
                  className="absolute left-0 top-0 h-full rounded-full bg-red-600"
                  style={{ width: `${progress}%` }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-red-600 rounded-full opacity-0 group-hover/prog:opacity-100 transition-opacity"
                  style={{ left: `${progress}%` }}
                />
              </div>

              {/* Buttons row */}
              <div className="flex items-center gap-3">
                <button onClick={togglePlay} className="text-white hover:text-gray-300 transition-colors p-1">
                  {playing ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
                </button>

                <div
                  className="flex items-center gap-2"
                  onMouseEnter={() => setShowVolumeSlider(true)}
                  onMouseLeave={() => setShowVolumeSlider(false)}
                >
                  <button onClick={toggleMute} className="text-white hover:text-gray-300 p-1">
                    {muted || volume === 0
                      ? <MuteIcon className="w-5 h-5" />
                      : volume < 0.5
                      ? <VolumeLoIcon className="w-5 h-5" />
                      : <VolumeHiIcon className="w-5 h-5" />}
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-200"
                    style={{ width: showVolumeSlider ? "70px" : "0px" }}
                  >
                    <input
                      type="range" min="0" max="1" step="0.05"
                      value={muted ? 0 : volume}
                      onChange={(e) => changeVolume(parseFloat(e.target.value))}
                      className="w-full accent-white cursor-pointer"
                      style={{ height: "3px" }}
                    />
                  </div>
                </div>

                <span className="text-xs text-gray-300 tabular-nums">
                  {fmt(currentTime)} / {fmt(duration)}
                </span>

                <div className="flex-1" />

                <button onClick={toggleFullscreen} className="text-white hover:text-gray-300 p-1">
                  {isFullscreen
                    ? <ExitFullscreenIcon className="w-5 h-5" />
                    : <FullscreenIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* VIDEO INFO */}
          <div className="mt-4">
            <h1 className="text-xl font-semibold text-white">{video.title}</h1>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <span className="text-xs text-gray-400">Uploaded recently</span>
              <span className="text-gray-600">·</span>
              <span className="text-xs px-2 py-0.5 bg-white/10 rounded text-gray-300">HD</span>
            </div>
            <p className="text-sm text-gray-400 mt-3 leading-relaxed">{video.description}</p>

            <div className="flex gap-3 mt-4">
              <button
                onClick={togglePlay}
                disabled={!videoReady}
                className="flex items-center gap-2 bg-white text-black font-semibold px-5 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm disabled:opacity-50"
              >
                {playing ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
                {playing ? "Pause" : "Play"}
              </button>
              <button className="flex items-center gap-2 bg-white/10 text-white px-5 py-2 rounded-lg hover:bg-white/20 transition-colors text-sm">
                <PlusIcon className="w-4 h-4" />
                My List
              </button>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Related videos ── */}
        {related.length > 0 && (
          <div className="lg:w-80 xl:w-96 flex-shrink-0">
            <p className="text-sm font-medium text-gray-300 mb-3">More Videos</p>
            <div className="flex flex-col gap-3">
              {related.map((v) => (
                <a
                  key={v.id}
                  href={`/video/${v.id}`}
                  className="flex gap-3 group rounded-lg overflow-hidden hover:bg-white/5 p-1.5 transition-colors"
                >
                  <div
                    className="relative w-36 flex-shrink-0 rounded-md overflow-hidden bg-gray-800"
                    style={{ aspectRatio: "16/9" }}
                  >
                    {v.thumbnail_url ? (
                      <img src={v.thumbnail_url} alt={v.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <PlayIcon className="w-6 h-6 text-gray-500" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <PlayIcon className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-200 line-clamp-2 group-hover:text-white transition-colors">
                      {v.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{v.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Icons ────────────────────────────────────────────────────────────────────
const PlayIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
);
const PauseIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" />
  </svg>
);
const VolumeHiIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
  </svg>
);
const VolumeLoIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" />
  </svg>
);
const MuteIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
  </svg>
);
const FullscreenIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
  </svg>
);
const ExitFullscreenIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
  </svg>
);
const PlusIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export default VideoPage;