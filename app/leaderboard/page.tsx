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

const medals = ["🥇", "🥈", "🥉"];

const rankStyle = (index: number) => {
  if (index === 0)
    return "bg-gradient-to-br from-yellow-400 to-amber-600 text-neutral-950 shadow-[0_0_16px_rgba(234,179,8,0.6)] ring-2 ring-yellow-400/40";
  if (index === 1)
    return "bg-gradient-to-br from-neutral-200 to-neutral-400 text-neutral-950 shadow-[0_0_10px_rgba(200,200,200,0.3)]";
  if (index === 2)
    return "bg-gradient-to-br from-amber-600 to-amber-900 text-white shadow-[0_0_10px_rgba(180,100,20,0.4)]";
  return "bg-neutral-800/80 text-neutral-400";
};

const rowGlow = (index: number) => {
  if (index === 0)
    return "bg-gradient-to-r from-yellow-500/5 via-transparent to-transparent";
  if (index === 1)
    return "bg-gradient-to-r from-neutral-300/5 via-transparent to-transparent";
  if (index === 2)
    return "bg-gradient-to-r from-amber-700/5 via-transparent to-transparent";
  return "";
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

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] rounded-full bg-orange-600/5 blur-[120px]" />
        <div className="absolute bottom-[5%] right-[5%] w-[400px] h-[400px] rounded-full bg-orange-500/4 blur-[100px]" />
        <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] rounded-full bg-amber-600/3 blur-[80px]" />
      </div>

      <Sidebar />

      <main className="ml-64 p-10 relative z-10">
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-orange-500 text-xs font-semibold tracking-[0.3em] uppercase mb-2">
                Season Rankings
              </p>
              <h1 className="text-4xl font-black text-white tracking-tight leading-none">
                Top Players
                <span className="ml-3 text-4xl">🏆</span>
              </h1>
              <p className="text-neutral-500 mt-2 text-sm">
                Peringkat berdasarkan total poin tertinggi
              </p>
            </div>
            <div className="text-right hidden md:block">
              <p className="text-xs text-neutral-600 uppercase tracking-widest mb-1">
                Total Players
              </p>
              <p className="text-3xl font-black text-orange-500">
                {loading ? "—" : players.length}
              </p>
            </div>
          </div>

          {/* Divider line */}
          <div className="mt-8 h-px bg-gradient-to-r from-orange-500/40 via-neutral-700/40 to-transparent" />
        </header>

        {/* Top 3 Podium Cards */}
        {!loading && !error && players.length >= 3 && (
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[players[1], players[0], players[2]].map((player, i) => {
              const realIndex = i === 0 ? 1 : i === 1 ? 0 : 2;
              const isFirst = realIndex === 0;
              return (
                <div
                  key={player.id}
                  className={`relative rounded-2xl p-6 border text-center flex flex-col items-center gap-2 transition-transform hover:-translate-y-1 ${
                    isFirst
                      ? "bg-gradient-to-b from-yellow-500/10 to-neutral-900 border-yellow-500/20 shadow-[0_0_40px_rgba(234,179,8,0.08)] -mt-4"
                      : "bg-gradient-to-b from-neutral-800/40 to-neutral-900/60 border-neutral-700/30"
                  }`}
                >
                  {isFirst && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-amber-500 text-neutral-950 text-[10px] font-black px-3 py-1 rounded-full tracking-widest uppercase shadow-lg">
                      Champion
                    </div>
                  )}
                  <span className="text-3xl mt-1">{medals[realIndex]}</span>
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg ${rankStyle(realIndex)}`}
                  >
                    {realIndex + 1}
                  </div>
                  <p
                    className={`font-bold text-sm mt-1 ${isFirst ? "text-white" : "text-neutral-300"}`}
                  >
                    {player.full_name}
                  </p>
                  <p
                    className={`text-2xl font-black ${isFirst ? "text-orange-400" : "text-orange-500/80"}`}
                  >
                    {player.total_points}
                    <span className="text-xs font-medium ml-1 text-neutral-500">
                      pts
                    </span>
                  </p>
                  <p className="text-xs text-neutral-500">
                    {player.win_rate.toFixed(1)}% Win Rate
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Table */}
        <div className="rounded-2xl overflow-hidden border border-neutral-800/60 shadow-2xl bg-neutral-900/40 backdrop-blur-sm">
          {/* Table header strip */}
          <div className="h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-transparent" />

          {loading ? (
            <div className="p-16 text-center flex flex-col items-center justify-center gap-4">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-4 border-orange-500/10" />
                <div className="absolute inset-0 rounded-full border-4 border-t-orange-500 animate-spin" />
              </div>
              <p className="text-neutral-500 text-sm">Memuat klasemen...</p>
            </div>
          ) : error ? (
            <div className="p-8 m-6 text-center text-red-400 bg-red-500/8 rounded-xl border border-red-500/15">
              <p className="text-2xl mb-2">⚠️</p>
              {error}
            </div>
          ) : players.length === 0 ? (
            <div className="p-16 text-center text-neutral-600 text-sm">
              Belum ada data pemain.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-neutral-800/60">
                    <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-neutral-500 w-20 text-center">
                      Rank
                    </th>
                    <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-neutral-500">
                      Player
                    </th>
                    <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-neutral-500 text-center">
                      Matches
                    </th>
                    <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-neutral-500 text-center">
                      Wins
                    </th>
                    <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-neutral-500 text-center">
                      Losses
                    </th>
                    <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-neutral-500 text-right">
                      Points
                    </th>
                    <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-neutral-500 text-right">
                      Win Rate
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player, index) => (
                    <tr
                      key={player.id}
                      className={`border-b border-neutral-800/30 group transition-all duration-200 hover:bg-orange-500/5 ${rowGlow(index)}`}
                    >
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${rankStyle(index)}`}
                        >
                          {index + 1}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neutral-700 to-neutral-800 flex items-center justify-center text-xs font-bold text-neutral-400 border border-neutral-700/50 flex-shrink-0">
                            {player.full_name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-neutral-200 group-hover:text-orange-400 transition-colors text-sm">
                            {player.full_name}
                          </span>
                          {index < 3 && (
                            <span className="text-base leading-none">
                              {medals[index]}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <span className="text-sm text-neutral-400 tabular-nums">
                          {player.matches_played}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <span className="text-sm text-emerald-400/80 tabular-nums font-medium">
                          {player.wins}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <span className="text-sm text-red-400/70 tabular-nums font-medium">
                          {player.losses}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-black bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent tabular-nums">
                          {player.total_points}
                        </span>
                        <span className="text-xs text-neutral-600 ml-1">
                          pts
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex flex-col items-end gap-1">
                          <span className="text-sm font-bold text-orange-500/90 tabular-nums">
                            {player.win_rate.toFixed(1)}%
                          </span>
                          {/* Mini progress bar */}
                          <div className="w-16 h-1 rounded-full bg-neutral-800 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400"
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

        {/* Footer note */}
        {!loading && !error && players.length > 0 && (
          <p className="text-center text-neutral-700 text-xs mt-6">
            Showing {players.length} players · Updated in real-time
          </p>
        )}
      </main>
    </div>
  );
}
