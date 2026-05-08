import { useState, useEffect, useRef } from "react";

// ── Types ──────────────────────────────────────────────────────────────────
const API = {
  leaderboard: "/api/leaderboard",
  players: "/api/players",
  matches: "/api/matches",
};

// ── Helpers ────────────────────────────────────────────────────────────────
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, [url]);
  return { data, loading, error };
}

function useCountUp(target, duration = 1500) {
  const [val, setVal] = useState(0);
  const ref = useRef(false);
  useEffect(() => {
    if (!target || ref.current) return;
    ref.current = true;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return val;
}

// ── Skeleton ───────────────────────────────────────────────────────────────
function Skeleton({ h = "h-6", w = "w-full", rounded = "rounded-lg" }) {
  return <div className={`${h} ${w} ${rounded} bg-white/5 animate-pulse`} />;
}

// ── Icons (inline SVG, no external deps beyond lucide-react placeholder) ───
const Icon = {
  Zap: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="w-6 h-6"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Trophy: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="w-6 h-6"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
    </svg>
  ),
  Users: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="w-6 h-6"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Calendar: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="w-6 h-6"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Activity: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="w-6 h-6"
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  History: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="w-6 h-6"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  ),
  Star: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  Target: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="w-6 h-6"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  Menu: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="w-6 h-6"
    >
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  X: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="w-6 h-6"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
};

// ── Navbar ─────────────────────────────────────────────────────────────────
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  const links = ["Home", "Features", "Live Matches", "Leaderboard", "Players"];
  const scroll = (id) => {
    setOpen(false);
    const el = document.getElementById(id.toLowerCase().replace(/ /g, "-"));
    el?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-black/70 backdrop-blur-xl border-b border-orange-500/20 shadow-lg shadow-orange-500/5" : "bg-transparent"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/40">
            <Icon.Target />
          </div>
          <span className="text-white font-black text-xl tracking-tight">
            Rack<span className="text-orange-400">Pro</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <button
              key={l}
              onClick={() => scroll(l)}
              className="text-gray-400 hover:text-orange-400 text-sm font-medium transition-colors duration-200"
            >
              {l}
            </button>
          ))}
        </div>
        <div className="hidden md:block">
          <button
            onClick={() => (window.location.href = "/login")}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-bold hover:shadow-lg hover:shadow-orange-500/40 hover:scale-105 transition-all duration-200"
          >
            Login
          </button>
        </div>
        <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
          {open ? <Icon.X /> : <Icon.Menu />}
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-black/90 backdrop-blur-xl border-t border-orange-500/20 px-4 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <button
              key={l}
              onClick={() => scroll(l)}
              className="text-gray-300 hover:text-orange-400 text-sm font-medium text-left transition-colors"
            >
              {l}
            </button>
          ))}
          <button
            onClick={() => (window.location.href = "/login")}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-bold w-fit"
          >
            Login
          </button>
        </div>
      )}
    </nav>
  );
}

// ── Floating Billiard Balls ────────────────────────────────────────────────
function FloatingBalls() {
  const balls = [
    { color: "#f97316", size: 60, x: 10, y: 20, delay: 0 },
    { color: "#1d4ed8", size: 40, x: 80, y: 15, delay: 1 },
    { color: "#dc2626", size: 50, x: 70, y: 70, delay: 2 },
    { color: "#7c3aed", size: 35, x: 20, y: 75, delay: 0.5 },
    { color: "#16a34a", size: 45, x: 50, y: 85, delay: 1.5 },
    { color: "#f59e0b", size: 30, x: 90, y: 50, delay: 3 },
    { color: "#f97316", size: 55, x: 5, y: 50, delay: 2.5 },
  ];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {balls.map((b, i) => (
        <div
          key={i}
          className="absolute rounded-full opacity-20"
          style={{
            width: b.size,
            height: b.size,
            left: `${b.x}%`,
            top: `${b.y}%`,
            background: `radial-gradient(circle at 35% 35%, white 0%, ${b.color} 40%, ${b.color}88 100%)`,
            boxShadow: `0 0 ${b.size}px ${b.color}66`,
            animation: `float ${4 + i}s ease-in-out infinite`,
            animationDelay: `${b.delay}s`,
          }}
        >
          <div className="w-1/3 h-1/3 rounded-full bg-white/60 absolute top-1/4 left-1/4" />
        </div>
      ))}
      <style>{`@keyframes float{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-20px) rotate(10deg)}}`}</style>
    </div>
  );
}

// ── Hero ───────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(249,115,22,0.15)_0%,_transparent_70%)]" />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(249,115,22,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,0.03) 1px,transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />
      <FloatingBalls />
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold mb-8 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
          LIVE TOURNAMENT PLATFORM
        </div>
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white leading-tight mb-6">
          Manage Billiard
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
            Tournaments
          </span>
          <br />
          in Real-Time
        </h1>
        <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Live match tracking, real-time leaderboards, player rankings, and
          instant score updates — all in one premium platform built for serious
          billiard competition.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => (window.location.href = "/login")}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-base hover:shadow-2xl hover:shadow-orange-500/40 hover:scale-105 transition-all duration-300"
          >
            🏆 Create Tournament
          </button>
          <button
            onClick={() => (window.location.href = "/login")}
            className="px-8 py-4 rounded-full bg-white/5 border border-orange-500/30 text-white font-bold text-base hover:bg-orange-500/10 hover:border-orange-500/60 hover:scale-105 transition-all duration-300 backdrop-blur-sm"
          >
            ▶ Watch Live Matches
          </button>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600">
        <span className="text-xs">SCROLL DOWN</span>
        <div className="w-px h-12 bg-gradient-to-b from-orange-500/50 to-transparent animate-pulse" />
      </div>
    </section>
  );
}

// ── Features ───────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: "Activity",
    title: "Realtime Match Tracking",
    desc: "Follow every shot live. Scores update instantly across all devices with sub-second latency.",
  },
  {
    icon: "Trophy",
    title: "Automatic Leaderboard",
    desc: "Rankings recalculate automatically after every match. No manual entry required.",
  },
  {
    icon: "Star",
    title: "Player Ranking System",
    desc: "ELO-based ranking system that accurately reflects player skill over time.",
  },
  {
    icon: "Calendar",
    title: "Tournament Scheduling",
    desc: "Bracket generation, round-robin scheduling, and time slot management — all automated.",
  },
  {
    icon: "Zap",
    title: "Live Score Updates",
    desc: "Push notifications and live score overlays keep spectators engaged throughout.",
  },
  {
    icon: "History",
    title: "Match History",
    desc: "Full historical archive of every match, set, and frame with detailed analytics.",
  },
];

function Features() {
  return (
    <section id="features" className="py-24 px-4 bg-black relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-orange-400 text-sm font-bold tracking-widest uppercase mb-3">
            Platform Features
          </p>
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">
            Built for Champions
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Everything you need to run professional billiard tournaments, from
            registration to the final rack.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => {
            const Ic = Icon[f.icon] || Icon.Zap;
            return (
              <div
                key={i}
                className="group relative rounded-2xl bg-white/3 border border-white/8 p-6 hover:border-orange-500/40 hover:bg-orange-500/5 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm"
              >
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ boxShadow: "0 0 30px rgba(249,115,22,0.1) inset" }}
                />
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/20 flex items-center justify-center text-orange-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Ic />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Live Matches ───────────────────────────────────────────────────────────
function MatchCard({ match }) {
  const isLive =
    match.status === "live" ||
    match.status === "ongoing" ||
    match.status === "in_progress";
  const isDone = match.status === "completed" || match.status === "finished";
  const p1 = match.player1 || {};
  const p2 = match.player2 || {};
  const p1name = p1.nickname || p1.full_name || p1.name || "Player 1";
  const p2name = p2.nickname || p2.full_name || p2.name || "Player 2";
  const s1 = match.score1 ?? match.player1_score ?? "-";
  const s2 = match.score2 ?? match.player2_score ?? "-";
  const winner =
    match.winner_id === p1.id
      ? p1name
      : match.winner_id === p2.id
        ? p2name
        : match.winner;

  return (
    <div
      className={`relative rounded-2xl bg-gradient-to-br from-white/5 to-white/2 border backdrop-blur-sm overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${isLive ? "border-orange-500/50 shadow-lg shadow-orange-500/10" : "border-white/10 hover:border-white/20"}`}
    >
      {isLive && (
        <div
          className="absolute inset-0 rounded-2xl animate-pulse"
          style={{ boxShadow: "0 0 40px rgba(249,115,22,0.08) inset" }}
        />
      )}
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          {isLive ? (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />{" "}
              LIVE
            </span>
          ) : isDone ? (
            <span className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold">
              COMPLETED
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-bold">
              UPCOMING
            </span>
          )}
          {match.date && (
            <span className="text-gray-600 text-xs">
              {new Date(match.date).toLocaleDateString()}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 text-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500/30 to-orange-700/20 border border-orange-500/30 flex items-center justify-center text-orange-300 font-black text-lg mx-auto mb-2">
              {p1name.charAt(0).toUpperCase()}
            </div>
            <p className="text-white font-bold text-sm truncate">{p1name}</p>
            {winner && (
              <p className="text-xs text-gray-600 mt-0.5">
                {winner === p1name ? "🏆 Winner" : ""}
              </p>
            )}
          </div>
          <div className="text-center px-4">
            <div className="flex items-center gap-3">
              <span
                className={`text-3xl font-black ${winner === p1name ? "text-orange-400" : "text-white"}`}
              >
                {s1}
              </span>
              <span className="text-gray-600 text-lg font-bold">:</span>
              <span
                className={`text-3xl font-black ${winner === p2name ? "text-orange-400" : "text-white"}`}
              >
                {s2}
              </span>
            </div>
            <p className="text-gray-600 text-xs mt-1">VS</p>
          </div>
          <div className="flex-1 text-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/30 to-blue-700/20 border border-blue-500/30 flex items-center justify-center text-blue-300 font-black text-lg mx-auto mb-2">
              {p2name.charAt(0).toUpperCase()}
            </div>
            <p className="text-white font-bold text-sm truncate">{p2name}</p>
            {winner && (
              <p className="text-xs text-gray-600 mt-0.5">
                {winner === p2name ? "🏆 Winner" : ""}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function LiveMatches() {
  const { data, loading, error } = useFetch(API.matches);
  const matches = Array.isArray(data)
    ? data
    : data?.matches || data?.data || [];

  return (
    <section
      id="live-matches"
      className="py-24 px-4 bg-gradient-to-b from-black via-orange-950/5 to-black relative"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-orange-400 text-sm font-bold tracking-widest uppercase mb-3">
            Real-Time Action
          </p>
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">
            Live Matches
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Track every match as it happens with live scores and real-time
            updates.
          </p>
        </div>
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white/3 border border-white/8 p-5 space-y-4"
              >
                <Skeleton h="h-6" w="w-20" />
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 space-y-2 flex flex-col items-center">
                    <Skeleton h="h-12" w="w-12" rounded="rounded-full" />
                    <Skeleton h="h-4" w="w-16" />
                  </div>
                  <Skeleton h="h-10" w="w-20" />
                  <div className="flex-1 space-y-2 flex flex-col items-center">
                    <Skeleton h="h-12" w="w-12" rounded="rounded-full" />
                    <Skeleton h="h-4" w="w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {error && (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg mb-2">⚠️ Could not load matches</p>
            <p className="text-sm text-orange-500/60">{error}</p>
          </div>
        )}
        {!loading && !error && matches.length === 0 && (
          <div className="text-center py-16 text-gray-600">
            <p className="text-5xl mb-4">🎱</p>
            <p>No matches found from API</p>
          </div>
        )}
        {!loading && !error && matches.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((m, i) => (
              <MatchCard key={m.id || i} match={m} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ── Leaderboard ────────────────────────────────────────────────────────────
const RANK_GLOW = [
  "shadow-yellow-400/30",
  "shadow-gray-400/30",
  "shadow-orange-700/30",
];
const RANK_BORDER = [
  "border-yellow-400/50",
  "border-gray-300/40",
  "border-orange-700/40",
];
const RANK_TEXT = ["text-yellow-400", "text-gray-300", "text-orange-600"];
const RANK_EMOJI = ["🥇", "🥈", "🥉"];

function Leaderboard() {
  const { data, loading, error } = useFetch(API.leaderboard);
  const players = Array.isArray(data)
    ? data
    : data?.leaderboard || data?.data || [];

  return (
    <section id="leaderboard" className="py-24 px-4 bg-black relative">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-orange-400 text-sm font-bold tracking-widest uppercase mb-3">
            Rankings
          </p>
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">
            Leaderboard
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            The best players in the tournament ranked by performance and total
            points.
          </p>
        </div>
        {loading && (
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="rounded-xl bg-white/3 border border-white/8 p-4 flex items-center gap-4"
              >
                <Skeleton h="h-8" w="w-8" rounded="rounded-full" />
                <Skeleton h="h-6" w="w-32" />
                <div className="ml-auto flex gap-6">
                  <Skeleton h="h-5" w="w-12" />
                  <Skeleton h="h-5" w="w-12" />
                </div>
              </div>
            ))}
          </div>
        )}
        {error && (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg mb-2">⚠️ Could not load leaderboard</p>
            <p className="text-sm text-orange-500/60">{error}</p>
          </div>
        )}
        {!loading && !error && players.length === 0 && (
          <div className="text-center py-16 text-gray-600">
            <p>No leaderboard data from API</p>
          </div>
        )}
        {!loading && !error && players.length > 0 && (
          <div className="space-y-3">
            {/* Header */}
            <div className="grid grid-cols-12 gap-2 px-4 pb-2 text-gray-600 text-xs font-semibold uppercase tracking-widest">
              <span className="col-span-1">#</span>
              <span className="col-span-4">Player</span>
              <span className="col-span-2 text-center">W</span>
              <span className="col-span-2 text-center">L</span>
              <span className="col-span-2 text-center">MP</span>
              <span className="col-span-1 text-right">PTS</span>
            </div>
            {players.map((p, i) => {
              const isTop3 = i < 3;
              const name = p.full_name || p.name || p.nickname || "Unknown";
              const wins = p.wins ?? p.total_wins ?? 0;
              const losses = p.losses ?? p.total_losses ?? 0;
              const mp = p.matches_played ?? p.total_matches ?? wins + losses;
              const pts = p.total_points ?? p.points ?? 0;
              return (
                <div
                  key={p.id || i}
                  className={`relative grid grid-cols-12 gap-2 items-center px-4 py-3 rounded-xl border backdrop-blur-sm transition-all duration-300 hover:-translate-x-1 ${isTop3 ? `bg-gradient-to-r from-white/5 to-transparent ${RANK_BORDER[i]} shadow-lg ${RANK_GLOW[i]}` : "bg-white/3 border-white/8 hover:border-orange-500/30"}`}
                >
                  {isTop3 && (
                    <div
                      className="absolute inset-0 rounded-xl opacity-30"
                      style={{
                        boxShadow: `0 0 20px ${i === 0 ? "rgba(234,179,8,0.2)" : i === 1 ? "rgba(156,163,175,0.2)" : "rgba(194,65,12,0.2)"} inset`,
                      }}
                    />
                  )}
                  <span
                    className={`col-span-1 font-black text-lg ${isTop3 ? RANK_TEXT[i] : "text-gray-600"}`}
                  >
                    {isTop3 ? RANK_EMOJI[i] : i + 1}
                  </span>
                  <div className="col-span-4 flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 ${isTop3 ? `bg-gradient-to-br from-orange-500/30 to-orange-700/20 border ${RANK_BORDER[i]} ${RANK_TEXT[i]}` : "bg-white/8 text-gray-400"}`}
                    >
                      {name.charAt(0).toUpperCase()}
                    </div>
                    <span
                      className={`font-bold text-sm truncate ${isTop3 ? "text-white" : "text-gray-300"}`}
                    >
                      {name}
                    </span>
                  </div>
                  <span className="col-span-2 text-center text-green-400 font-bold text-sm">
                    {wins}
                  </span>
                  <span className="col-span-2 text-center text-red-400 font-semibold text-sm">
                    {losses}
                  </span>
                  <span className="col-span-2 text-center text-gray-400 text-sm">
                    {mp}
                  </span>
                  <span
                    className={`col-span-1 text-right font-black text-sm ${isTop3 ? RANK_TEXT[i] : "text-orange-400"}`}
                  >
                    {pts}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

// ── Players ────────────────────────────────────────────────────────────────
function PlayerCard({ p }) {
  const name = p.full_name || p.name || "Unknown";
  const nick = p.nickname || p.username || name;
  const wins = p.wins ?? p.total_wins ?? 0;
  const losses = p.losses ?? p.total_losses ?? 0;
  const mp = p.matches_played ?? p.total_matches ?? wins + losses;
  const pts = p.total_points ?? p.points ?? 0;
  const avatar = p.avatar || p.photo || p.profile_picture;
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="group rounded-2xl bg-gradient-to-br from-white/5 to-white/2 border border-white/8 p-5 hover:border-orange-500/40 hover:bg-orange-500/3 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/10 backdrop-blur-sm">
      <div className="flex flex-col items-center text-center mb-4">
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="w-16 h-16 rounded-full object-cover border-2 border-orange-500/30 mb-3 group-hover:border-orange-500/60 transition-colors"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500/30 to-orange-700/20 border-2 border-orange-500/30 flex items-center justify-center text-orange-300 font-black text-xl mb-3 group-hover:border-orange-500/60 transition-all group-hover:scale-110">
            {initials}
          </div>
        )}
        <h3 className="text-white font-bold text-base">{name}</h3>
        <p className="text-orange-400 text-xs font-semibold mt-0.5">@{nick}</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[
          ["Wins", "text-green-400", wins],
          ["Losses", "text-red-400", losses],
          ["Matches", "text-blue-400", mp],
          ["Points", "text-orange-400", pts],
        ].map(([label, color, val]) => (
          <div key={label} className="bg-black/30 rounded-xl p-2.5 text-center">
            <p className={`font-black text-lg ${color}`}>{val}</p>
            <p className="text-gray-600 text-xs font-medium">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Players() {
  const { data, loading, error } = useFetch(API.players);
  const players = Array.isArray(data)
    ? data
    : data?.players || data?.data || [];

  return (
    <section
      id="players"
      className="py-24 px-4 bg-gradient-to-b from-black via-orange-950/5 to-black"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-orange-400 text-sm font-bold tracking-widest uppercase mb-3">
            The Competitors
          </p>
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">
            All Players
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Meet the players competing in this tournament season.
          </p>
        </div>
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white/3 border border-white/8 p-5 space-y-4 flex flex-col items-center"
              >
                <Skeleton h="h-16" w="w-16" rounded="rounded-full" />
                <Skeleton h="h-5" w="w-24" />
                <div className="grid grid-cols-2 gap-2 w-full">
                  {[...Array(4)].map((_, j) => (
                    <Skeleton key={j} h="h-14" rounded="rounded-xl" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        {error && (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg mb-2">⚠️ Could not load players</p>
            <p className="text-sm text-orange-500/60">{error}</p>
          </div>
        )}
        {!loading && !error && players.length === 0 && (
          <div className="text-center py-16 text-gray-600">
            <p>No player data from API</p>
          </div>
        )}
        {!loading && !error && players.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {players.map((p, i) => (
              <PlayerCard key={p.id || i} p={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ── Stats ──────────────────────────────────────────────────────────────────
function StatBox({ label, value, color, emoji }) {
  const count = useCountUp(value);
  return (
    <div className="rounded-2xl bg-white/3 border border-white/8 p-6 text-center hover:border-orange-500/30 transition-all duration-300 hover:bg-orange-500/3 backdrop-blur-sm group">
      <div className="text-4xl mb-2">{emoji}</div>
      <p className={`text-4xl sm:text-5xl font-black mb-2 ${color}`}>
        {count.toLocaleString()}
      </p>
      <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">
        {label}
      </p>
    </div>
  );
}

function Statistics() {
  const { data: mData, loading: mLoad } = useFetch(API.matches);
  const { data: pData, loading: pLoad } = useFetch(API.players);
  const matches = Array.isArray(mData)
    ? mData
    : mData?.matches || mData?.data || [];
  const players = Array.isArray(pData)
    ? pData
    : pData?.players || pData?.data || [];

  const totalMatches = matches.length;
  const completed = matches.filter((m) =>
    ["completed", "finished"].includes(m.status),
  ).length;
  const active = matches.filter((m) =>
    ["live", "ongoing", "in_progress"].includes(m.status),
  ).length;
  const totalPlayers = players.length;

  const loading = mLoad || pLoad;

  return (
    <section className="py-24 px-4 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(249,115,22,0.08)_0%,_transparent_60%)]" />
      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-16">
          <p className="text-orange-400 text-sm font-bold tracking-widest uppercase mb-3">
            By The Numbers
          </p>
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">
            Tournament Statistics
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Live numbers calculated directly from API data.
          </p>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white/3 border border-white/8 p-6 text-center space-y-3 flex flex-col items-center"
              >
                <Skeleton h="h-8" w="w-12" />
                <Skeleton h="h-12" w="w-16" />
                <Skeleton h="h-4" w="w-24" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            <StatBox
              label="Total Players"
              value={totalPlayers}
              color="text-orange-400"
              emoji="👤"
            />
            <StatBox
              label="Total Matches"
              value={totalMatches}
              color="text-blue-400"
              emoji="🎱"
            />
            <StatBox
              label="Completed"
              value={completed}
              color="text-green-400"
              emoji="✅"
            />
            <StatBox
              label="Active Now"
              value={active}
              color="text-red-400"
              emoji="🔴"
            />
          </div>
        )}
      </div>
    </section>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-white/8 bg-black py-10 px-4 text-center">
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
          <Icon.Target />
        </div>
        <span className="text-white font-black">
          Rack<span className="text-orange-400">Pro</span>
        </span>
      </div>
      <p className="text-gray-600 text-sm">
        © 2025 RackPro. Premium Billiard Tournament Management.
      </p>
      <div className="flex justify-center gap-6 mt-4">
        {["Privacy", "Terms", "Support"].map((l) => (
          <button
            key={l}
            className="text-gray-600 hover:text-orange-400 text-xs transition-colors"
          >
            {l}
          </button>
        ))}
      </div>
    </footer>
  );
}

// ── App ────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased">
      <style>{`
        * { scroll-behavior: smooth; }
        body { background: #000; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: #f97316; border-radius: 2px; }
      `}</style>
      <Navbar />
      <Hero />
      <Features />
      <Statistics />
      <LiveMatches />
      <Leaderboard />
      <Players />
      <Footer />
    </div>
  );
}
