"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface LeaderboardPlayer {
  id: string;
  full_name: string;
  total_points: number;
  wins: number;
  losses: number;
  matches_played: number;
  win_rate: number;
}

const rankStyle = (index: number) => {
  if (index === 0)
    return "text-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.4)]";
  if (index === 1) return "text-neutral-300";
  if (index === 2) return "text-amber-600";
  return "text-neutral-600";
};

const rowAccent = (index: number) => {
  if (index === 0) return "border-orange-500/20 bg-orange-500/[0.04]";
  return "border-neutral-800/50 bg-transparent";
};

export default function Home() {
  const [players, setPlayers] = useState<LeaderboardPlayer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(rgba(249,115,22,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.8) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-5%] left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-orange-600/7 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[5%] w-[350px] h-[300px] bg-orange-500/4 blur-[100px] rounded-full" />
      </div>

      {/* Corner decoration */}
      <div className="absolute top-0 left-0 w-24 h-24 border-l-2 border-t-2 border-orange-500/15" />
      <div className="absolute top-0 right-0 w-24 h-24 border-r-2 border-t-2 border-orange-500/15" />

      <div className="relative z-10 flex flex-col items-center px-6 py-16 lg:py-24">
        {/* ── HERO ── */}
        <section className="flex flex-col items-center text-center max-w-2xl mx-auto mb-20 lg:mb-28">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 border border-orange-500/20 bg-orange-500/5 rounded-full px-4 py-1.5 mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-orange-400 text-xs font-bold tracking-[0.2em] uppercase">
              Season Active
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tight leading-[0.95] mb-6">
            DOMINATE
            <br />
            <span
              className="text-transparent"
              style={{ WebkitTextStroke: "2px rgba(249,115,22,0.6)" }}
            >
              THE GAME
            </span>
          </h1>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-orange-500/50" />
            <div className="w-1.5 h-1.5 rotate-45 bg-orange-500" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-orange-500/50" />
          </div>

          <p className="text-neutral-500 text-base sm:text-lg leading-relaxed mb-10 max-w-md">
            Lacak pertandingan, pantau klasemen, dan buktikan siapa yang
            terbaik. Platform kompetisi internal yang serius.
          </p>

          <Link
            href="/login"
            className="group relative inline-flex items-center gap-3 bg-orange-500 hover:bg-orange-400 text-white font-black text-sm tracking-[0.15em] uppercase px-8 py-4 rounded-xl transition-all duration-200 shadow-[0_0_40px_rgba(249,115,22,0.3)] hover:shadow-[0_0_60px_rgba(249,115,22,0.45)]"
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

          <p className="text-neutral-700 text-xs mt-5 tracking-widest uppercase">
            Admin access only
          </p>
        </section>

        {/* ── LEADERBOARD PREVIEW ── */}
        <section className="w-full max-w-lg mx-auto">
          {/* Section label */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-1 h-4 rounded-full bg-orange-500" />
              <p className="text-orange-500 text-[11px] font-bold tracking-[0.25em] uppercase">
                Top Players
              </p>
            </div>
            <Link
              href="/login"
              className="text-[11px] text-neutral-600 hover:text-orange-400 transition-colors tracking-wider uppercase font-semibold"
            >
              Lihat Semua →
            </Link>
          </div>

          {/* Card */}
          <div className="rounded-xl border border-neutral-800 overflow-hidden bg-neutral-900/40 backdrop-blur-sm">
            <div className="h-[2px] bg-gradient-to-r from-orange-500 via-orange-400/40 to-transparent" />

            {loading ? (
              <div className="p-10 flex flex-col items-center gap-3">
                <div className="w-7 h-7 rounded-full border-2 border-neutral-800 border-t-orange-500 animate-spin" />
                <p className="text-neutral-700 text-xs">Memuat klasemen...</p>
              </div>
            ) : players.length === 0 ? (
              <div className="p-10 text-center text-neutral-700 text-sm">
                Belum ada data.
              </div>
            ) : (
              <div>
                {players.map((player, index) => (
                  <div
                    key={player.id}
                    className={`flex items-center gap-4 px-5 py-3.5 border-b last:border-b-0 transition-colors ${rowAccent(index)}`}
                  >
                    {/* Rank */}
                    <span
                      className={`text-xl font-black tabular-nums w-6 text-center flex-shrink-0 ${rankStyle(index)}`}
                    >
                      {index + 1}
                    </span>

                    {/* Avatar */}
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        index === 0
                          ? "bg-orange-500/10 border border-orange-500/30 text-orange-400"
                          : "bg-neutral-800 border border-neutral-700/50 text-neutral-500"
                      }`}
                    >
                      {player.full_name.charAt(0).toUpperCase()}
                    </div>

                    {/* Name */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-semibold truncate ${index === 0 ? "text-white" : "text-neutral-300"}`}
                      >
                        {player.full_name}
                      </p>
                      <p className="text-[11px] text-neutral-600 tabular-nums">
                        {player.wins}W · {player.losses}L ·{" "}
                        {player.win_rate?.toFixed(1)}%
                      </p>
                    </div>

                    {/* Points */}
                    <div className="text-right flex-shrink-0">
                      <p
                        className={`text-sm font-black tabular-nums ${index === 0 ? "text-orange-400" : "text-neutral-400"}`}
                      >
                        {player.total_points}
                      </p>
                      <p className="text-[10px] text-neutral-700">pts</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Footer */}
            {!loading && players.length > 0 && (
              <div className="px-5 py-3 border-t border-neutral-800/60 flex items-center justify-between">
                <p className="text-[11px] text-neutral-700">
                  Top 5 dari season ini
                </p>
                <Link
                  href="/login"
                  className="text-[11px] text-orange-500 hover:text-orange-400 font-bold tracking-wide transition-colors"
                >
                  Login untuk lebih →
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* ── BOTTOM STRIP ── */}
        <div className="mt-20 flex items-center justify-center gap-8 sm:gap-16">
          {[
            { value: "Real-time", label: "Skor" },
            { value: "Live", label: "Klasemen" },
            { value: "Full", label: "Statistik" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-orange-500/60" />
              <p className="text-[11px] text-neutral-600">
                <span className="text-neutral-400 font-semibold">
                  {item.label}
                </span>{" "}
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
