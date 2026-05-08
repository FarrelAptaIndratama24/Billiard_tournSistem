"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";

interface LeaderboardPlayer {
  id: string;
  full_name: string;
  total_points: number;
  wins: number;
  losses: number;
  matches_played: number;
  win_rate: number;
}

export default function Home() {
  const [players, setPlayers] = useState<LeaderboardPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setMounted(true);
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch("/api/leaderboard");
        const json = await res.json();
        if (json.success) setPlayers(json.data.slice(0, 5));
      } catch (_) {
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  // Animated particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      life: number;
      maxLife: number;
    }[] = [];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.5 - 0.1,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
        life: Math.random() * 200,
        maxLife: 200 + Math.random() * 200,
      });
    }

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        if (p.life > p.maxLife || p.y < -10) {
          p.x = Math.random() * canvas.width;
          p.y = canvas.height + 10;
          p.life = 0;
        }
        const fade =
          p.life < 30
            ? p.life / 30
            : p.life > p.maxLife - 30
              ? (p.maxLife - p.life) / 30
              : 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(249,115,22,${p.opacity * fade})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const medalIcon = (index: number) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return null;
  };

  const rankColor = (index: number) => {
    if (index === 0) return "text-orange-400";
    if (index === 1) return "text-slate-300";
    if (index === 2) return "text-amber-600";
    return "text-zinc-600";
  };

  return (
    <div className="relative min-h-screen bg-[#080808] overflow-x-hidden font-sans">
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0"
        style={{ opacity: 0.7 }}
      />

      {/* Mesh gradient background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 20% -10%, rgba(249,115,22,0.12) 0%, transparent 60%),
              radial-gradient(ellipse 60% 40% at 80% 110%, rgba(234,88,12,0.08) 0%, transparent 60%),
              radial-gradient(ellipse 40% 60% at 50% 50%, rgba(17,17,17,1) 0%, transparent 100%)
            `,
          }}
        />
        {/* Diagonal stripes */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              rgba(249,115,22,1) 0px,
              rgba(249,115,22,1) 1px,
              transparent 1px,
              transparent 40px
            )`,
          }}
        />
      </div>

      {/* Top nav bar */}
      <nav
        className={`relative z-20 flex items-center justify-between px-6 sm:px-10 lg:px-16 py-5 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-orange-500 rounded-md flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
              <path
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                strokeWidth="2"
                stroke="white"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-white font-black tracking-tight text-lg">
            ARENA<span className="text-orange-500">.</span>
          </span>
        </div>
        <Link
          href="/login"
          className="text-xs font-bold tracking-[0.15em] uppercase text-zinc-400 hover:text-orange-400 transition-colors duration-200 border border-zinc-800 hover:border-orange-500/40 px-4 py-2 rounded-lg"
        >
          Login
        </Link>
      </nav>

      <div className="relative z-10 flex flex-col items-center px-5 sm:px-8 lg:px-16 pb-20">
        {/* ── HERO SECTION ── */}
        <section className="w-full max-w-6xl mx-auto pt-12 sm:pt-16 lg:pt-20 pb-16 sm:pb-24">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-16">
            {/* Left: Text content */}
            <div
              className={`flex-1 text-center lg:text-left transition-all duration-700 delay-100 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              {/* Status badge */}
              <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/25 rounded-full px-4 py-1.5 mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
                </span>
                <span className="text-orange-400 text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase">
                  Season Active
                </span>
              </div>

              {/* Main headline */}
              <h1 className="text-[clamp(3rem,10vw,7rem)] font-black leading-[0.88] tracking-tight mb-6">
                <span className="text-white block">DOM</span>
                <span
                  className="block"
                  style={{
                    WebkitTextStroke: "2px rgba(249,115,22,0.7)",
                    color: "transparent",
                    textShadow: "0 0 80px rgba(249,115,22,0.15)",
                  }}
                >
                  INATE
                </span>
                <span className="text-white block text-[clamp(1.2rem,3vw,2.5rem)] font-black tracking-[0.4em] mt-2">
                  THE GAME
                </span>
              </h1>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-6 justify-center lg:justify-start">
                <div className="h-[2px] w-16 bg-gradient-to-r from-orange-500 to-transparent" />
                <div className="w-1.5 h-1.5 rotate-45 bg-orange-500" />
                <div className="h-[2px] w-8 bg-gradient-to-r from-orange-500/40 to-transparent" />
              </div>

              <p className="text-zinc-500 text-sm sm:text-base leading-relaxed mb-10 max-w-sm mx-auto lg:mx-0">
                Lacak pertandingan, pantau klasemen, dan buktikan siapa yang
                terbaik di internal kompetisi.
              </p>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row items-center lg:items-start gap-3 justify-center lg:justify-start">
                <Link
                  href="/login"
                  className="group relative inline-flex items-center gap-3 bg-orange-500 hover:bg-orange-400 text-white font-black text-xs sm:text-sm tracking-[0.15em] uppercase px-7 py-4 rounded-xl transition-all duration-200 shadow-[0_0_40px_rgba(249,115,22,0.25)] hover:shadow-[0_0_60px_rgba(249,115,22,0.4)] w-full sm:w-auto justify-center"
                >
                  Masuk ke Arena
                  <svg
                    className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </Link>
                <span className="text-zinc-700 text-[10px] font-bold tracking-widest uppercase self-center">
                  Admin only
                </span>
              </div>
            </div>

            {/* Right: Stats cards */}
            <div
              className={`flex-shrink-0 w-full lg:w-[340px] xl:w-[380px] transition-all duration-700 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              {/* Big stat card */}
              <div className="relative bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 mb-3 overflow-hidden backdrop-blur-sm">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-orange-500 via-orange-400/50 to-transparent" />
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl" />
                <p className="text-zinc-600 text-[10px] font-bold tracking-[0.25em] uppercase mb-1">
                  Platform Stats
                </p>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {[
                    { val: "Real-time", label: "Skor" },
                    { val: "Live", label: "Klasemen" },
                    { val: "Full", label: "Statistik" },
                  ].map((s) => (
                    <div key={s.label} className="text-center">
                      <p className="text-white font-black text-lg leading-none mb-1">
                        {s.val}
                      </p>
                      <p className="text-zinc-600 text-[10px] uppercase tracking-wider">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feature pills */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: "⚡", label: "Skor Live", sub: "Update otomatis" },
                  { icon: "🏆", label: "Klasemen", sub: "Ranking real-time" },
                  { icon: "📊", label: "Statistik", sub: "Win rate & poin" },
                  { icon: "🎯", label: "Riwayat", sub: "Semua pertandingan" },
                ].map((f) => (
                  <div
                    key={f.label}
                    className="bg-zinc-900/50 border border-zinc-800/60 rounded-xl p-3.5 hover:border-orange-500/30 transition-colors duration-200 backdrop-blur-sm"
                  >
                    <span className="text-xl block mb-1.5">{f.icon}</span>
                    <p className="text-white text-xs font-bold">{f.label}</p>
                    <p className="text-zinc-600 text-[10px] mt-0.5">{f.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── LEADERBOARD PREVIEW ── */}
        <section
          className={`w-full max-w-2xl mx-auto transition-all duration-700 delay-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          {/* Section header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-1 h-5 rounded-full bg-orange-500" />
              <p className="text-orange-500 text-[11px] font-black tracking-[0.3em] uppercase">
                Top Players
              </p>
            </div>
            <Link
              href="/login"
              className="text-[11px] text-zinc-600 hover:text-orange-400 transition-colors tracking-wider uppercase font-bold flex items-center gap-1"
            >
              Lihat Semua
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>

          {/* Leaderboard card */}
          <div className="relative rounded-2xl border border-zinc-800/80 overflow-hidden bg-zinc-900/40 backdrop-blur-md shadow-2xl">
            <div className="h-[2px] bg-gradient-to-r from-orange-500 via-orange-400/60 to-transparent" />

            {loading ? (
              <div className="p-14 flex flex-col items-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-zinc-800 border-t-orange-500 animate-spin" />
                <p className="text-zinc-700 text-xs tracking-widest uppercase">
                  Memuat klasemen...
                </p>
              </div>
            ) : players.length === 0 ? (
              <div className="p-14 text-center text-zinc-700 text-sm">
                Belum ada data klasemen.
              </div>
            ) : (
              <div>
                {players.map((player, index) => (
                  <div
                    key={player.id}
                    className={`relative flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3.5 border-b border-zinc-800/40 last:border-b-0 transition-all duration-200 hover:bg-zinc-800/20 ${
                      index === 0 ? "bg-orange-500/[0.04]" : ""
                    }`}
                  >
                    {/* Rank number */}
                    <div className="flex-shrink-0 w-8 text-center">
                      {medalIcon(index) ? (
                        <span className="text-lg leading-none">
                          {medalIcon(index)}
                        </span>
                      ) : (
                        <span
                          className={`text-sm font-black tabular-nums ${rankColor(index)}`}
                        >
                          {index + 1}
                        </span>
                      )}
                    </div>

                    {/* Avatar */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0 ${
                        index === 0
                          ? "bg-orange-500/15 border border-orange-500/40 text-orange-400"
                          : index === 1
                            ? "bg-zinc-700/50 border border-zinc-600/50 text-zinc-300"
                            : "bg-zinc-800/60 border border-zinc-700/50 text-zinc-500"
                      }`}
                    >
                      {player.full_name.charAt(0).toUpperCase()}
                    </div>

                    {/* Name & stats */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-bold truncate ${
                          index === 0 ? "text-white" : "text-zinc-300"
                        }`}
                      >
                        {player.full_name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-green-500 font-semibold tabular-nums">
                          {player.wins}W
                        </span>
                        <span className="text-zinc-700 text-[10px]">·</span>
                        <span className="text-[10px] text-red-500/80 font-semibold tabular-nums">
                          {player.losses}L
                        </span>
                        <span className="text-zinc-700 text-[10px]">·</span>
                        <span className="text-[10px] text-zinc-500 tabular-nums">
                          {player.win_rate?.toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    {/* Points */}
                    <div className="text-right flex-shrink-0">
                      <p
                        className={`text-base font-black tabular-nums ${
                          index === 0 ? "text-orange-400" : "text-zinc-400"
                        }`}
                      >
                        {player.total_points}
                      </p>
                      <p className="text-[10px] text-zinc-700 font-semibold uppercase tracking-wider">
                        pts
                      </p>
                    </div>

                    {/* #1 glow bar */}
                    {index === 0 && (
                      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-orange-500 to-orange-500/20 rounded-r" />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Footer */}
            {!loading && players.length > 0 && (
              <div className="px-5 sm:px-6 py-3.5 border-t border-zinc-800/60 bg-zinc-900/30 flex items-center justify-between">
                <p className="text-[11px] text-zinc-700 font-medium">
                  Menampilkan top 5 season ini
                </p>
                <Link
                  href="/login"
                  className="text-[11px] text-orange-500 hover:text-orange-400 font-bold tracking-wide transition-colors flex items-center gap-1"
                >
                  Login untuk lanjut
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* ── BOTTOM FOOTER ── */}
        <footer
          className={`mt-20 sm:mt-24 w-full max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-zinc-900 pt-8 transition-all duration-700 delay-500 ${mounted ? "opacity-100" : "opacity-0"}`}
        >
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-orange-500 rounded flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                className="w-3 h-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                />
              </svg>
            </div>
            <span className="text-zinc-700 text-xs font-bold tracking-wider">
              ARENA<span className="text-orange-500/60">.</span> Internal
              Competition
            </span>
          </div>
          <p className="text-zinc-800 text-[10px] tracking-widest uppercase font-semibold">
            Admin Access Only
          </p>
        </footer>
      </div>
    </div>
  );
}
