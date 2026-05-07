"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/app/components/Sidebar";

interface LeaderboardPlayer {
  id: string;
  full_name: string;
  matches_played: number;
  wins: number;
  losses: number;
  total_points: number;
  win_rate: number;
}

const rankBadge = (index: number) => {
  if (index === 0)
    return "bg-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.5)]";
  if (index === 1) return "bg-neutral-200 text-neutral-900";
  if (index === 2) return "bg-amber-700 text-white";
  return "bg-neutral-800 text-neutral-500";
};

export default function LeaderboardPage() {
  const [players, setPlayers] = useState<LeaderboardPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch("/api/leaderboard");
        const json = await res.json();
        if (!res.ok || !json.success)
          throw new Error(json.message || "Gagal mengambil data leaderboard");
        setPlayers(json.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const podiumOrder = [
    {
      realIndex: 1,
      label: "2ND",
      rankColor: "text-neutral-400",
      borderColor: "border-neutral-700/40",
      bgColor: "bg-neutral-900/60",
      numberColor: "text-neutral-300",
      barHeight: "h-10",
      mobileOrder: "order-2 md:order-none",
    },
    {
      realIndex: 0,
      label: "1ST",
      rankColor: "text-orange-500",
      borderColor: "border-orange-500/40",
      bgColor: "bg-neutral-900/80",
      numberColor: "text-white",
      barHeight: "h-16",
      mobileOrder: "order-1 md:order-none",
    },
    {
      realIndex: 2,
      label: "3RD",
      rankColor: "text-amber-600",
      borderColor: "border-amber-700/40",
      bgColor: "bg-neutral-900/60",
      numberColor: "text-neutral-300",
      barHeight: "h-10",
      mobileOrder: "order-3 md:order-none",
    },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#0a0a0a] text-neutral-200">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-orange-600/5 blur-[100px]" />
      </div>

      <Sidebar />

      <main className="flex-1 w-full px-4 py-6 md:px-6 md:py-10 lg:px-12 lg:py-12 relative z-10 overflow-x-hidden">
        {/* Header */}
        <header className="mb-8 md:mb-10">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-1 h-4 rounded-full bg-orange-500" />
            <p className="text-orange-500 text-[11px] font-bold tracking-[0.25em] uppercase">
              Season Rankings
            </p>
          </div>
          <div className="flex items-end justify-between">
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Leaderboard
            </h1>
            {!loading && (
              <p className="text-sm text-neutral-600">
                <span className="text-orange-500 font-bold">
                  {players.length}
                </span>{" "}
                players
              </p>
            )}
          </div>
          <div className="mt-5 h-px bg-neutral-800" />
        </header>

        {/* Top 3 Podium */}
        {!loading && !error && players.length >= 3 && (
          <div className="flex flex-col md:grid md:grid-cols-3 gap-3 md:gap-4 mb-8 items-stretch md:items-end">
            {podiumOrder.map(
              ({
                realIndex,
                label,
                rankColor,
                borderColor,
                bgColor,
                numberColor,
                barHeight,
                mobileOrder,
              }) => {
                const player = players[realIndex];
                const isFirst = realIndex === 0;
                return (
                  <div
                    key={player.id}
                    className={`relative rounded-xl border ${borderColor} ${bgColor} overflow-hidden transition-transform duration-200 hover:-translate-y-0.5 ${mobileOrder}`}
                  >
                    {/* Top accent line */}
                    <div
                      className={`h-0.5 w-full ${
                        isFirst
                          ? "bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500/30"
                          : realIndex === 1
                            ? "bg-neutral-600/60"
                            : "bg-amber-700/60"
                      }`}
                    />

                    <div className="p-4 md:p-5 flex flex-col items-center gap-3">
                      {/* Giant rank number */}
                      <div className="relative flex flex-col items-center">
                        <span
                          className={`text-5xl md:text-[64px] font-black leading-none tabular-nums ${rankColor} ${isFirst ? "drop-shadow-[0_0_30px_rgba(249,115,22,0.4)]" : ""}`}
                        >
                          {realIndex + 1}
                        </span>
                        <span
                          className={`text-[10px] font-black tracking-[0.3em] -mt-1 ${rankColor}`}
                        >
                          {label}
                        </span>
                      </div>

                      {/* Divider */}
                      <div className="w-8 h-px bg-neutral-700" />

                      {/* Avatar */}
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-lg border ${
                          isFirst
                            ? "bg-orange-500/10 border-orange-500/30 text-orange-400"
                            : realIndex === 1
                              ? "bg-neutral-800 border-neutral-700 text-neutral-400"
                              : "bg-amber-700/10 border-amber-700/30 text-amber-600"
                        }`}
                      >
                        {player.full_name.charAt(0).toUpperCase()}
                      </div>

                      {/* Name */}
                      <div className="text-center">
                        <p
                          className={`font-bold text-sm leading-tight ${numberColor}`}
                        >
                          {player.full_name}
                        </p>
                      </div>

                      {/* Points */}
                      <div
                        className={`w-full rounded-lg py-2.5 text-center ${
                          isFirst ? "bg-orange-500/10" : "bg-neutral-800/60"
                        }`}
                      >
                        <p
                          className={`text-xl font-black tabular-nums ${isFirst ? "text-orange-400" : "text-neutral-400"}`}
                        >
                          {player.total_points}
                          <span className="text-xs font-normal text-neutral-600 ml-1">
                            pts
                          </span>
                        </p>
                        <p className="text-[10px] text-neutral-600 mt-0.5">
                          {player.win_rate.toFixed(1)}% win rate
                        </p>
                      </div>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        )}

        {/* Table */}
        <div className="rounded-xl border border-neutral-800 overflow-hidden bg-neutral-900/40">
          <div className="h-[2px] bg-gradient-to-r from-orange-500 via-orange-400/40 to-transparent" />

          {loading ? (
            <div className="p-10 md:p-20 flex flex-col items-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-neutral-800 border-t-orange-500 animate-spin" />
              <p className="text-neutral-600 text-sm">Memuat klasemen...</p>
            </div>
          ) : error ? (
            <div className="m-4 md:m-6 p-4 md:p-6 rounded-lg bg-red-500/5 border border-red-500/10 text-red-400 text-sm text-center">
              ⚠️ {error}
            </div>
          ) : players.length === 0 ? (
            <div className="p-10 md:p-20 text-center text-neutral-600 text-sm">
              Belum ada data pemain.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                <thead>
                  <tr className="border-b border-neutral-800">
                    {[
                      "#",
                      "Player",
                      "Matches",
                      "W",
                      "L",
                      "Points",
                      "Win Rate",
                    ].map((h, i) => (
                      <th
                        key={h}
                        className={`px-4 md:px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-600 ${
                          i === 0
                            ? "w-10 md:w-14 text-center"
                            : i === 1
                              ? ""
                              : i >= 5
                                ? "text-right"
                                : "text-center"
                        }`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {players.map((player, index) => (
                    <tr
                      key={player.id}
                      className={`border-b border-neutral-800/40 group transition-colors duration-150 hover:bg-white/[0.02] ${
                        index === 0 ? "bg-orange-500/[0.03]" : ""
                      }`}
                    >
                      <td className="px-4 md:px-5 py-3.5 text-center">
                        <span
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold ${rankBadge(index)}`}
                        >
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-4 md:px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-neutral-800 border border-neutral-700/50 flex items-center justify-center text-xs font-bold text-neutral-500 flex-shrink-0">
                            {player.full_name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-sm text-neutral-300 group-hover:text-white transition-colors">
                            {player.full_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 md:px-5 py-3.5 text-center text-sm text-neutral-500 tabular-nums">
                        {player.matches_played}
                      </td>
                      <td className="px-4 md:px-5 py-3.5 text-center text-sm text-emerald-500 tabular-nums font-medium">
                        {player.wins}
                      </td>
                      <td className="px-4 md:px-5 py-3.5 text-center text-sm text-red-500/70 tabular-nums font-medium">
                        {player.losses}
                      </td>
                      <td className="px-4 md:px-5 py-3.5 text-right tabular-nums">
                        <span className="text-sm font-black text-orange-400">
                          {player.total_points}
                        </span>
                        <span className="text-xs text-neutral-700 ml-1">
                          pts
                        </span>
                      </td>
                      <td className="px-4 md:px-5 py-3.5 text-right">
                        <div className="inline-flex flex-col items-end gap-1.5">
                          <span className="text-sm font-bold text-neutral-300 tabular-nums">
                            {player.win_rate.toFixed(1)}%
                          </span>
                          <div className="w-14 h-0.5 rounded-full bg-neutral-800">
                            <div
                              className="h-full rounded-full bg-orange-500"
                              style={{
                                width: `${Math.min(player.win_rate, 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {!loading && !error && players.length > 0 && (
          <p className="text-center text-neutral-800 text-xs mt-5">
            {players.length} players · live
          </p>
        )}
      </main>
    </div>
  );
}
