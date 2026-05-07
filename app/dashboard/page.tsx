"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/app/components/Sidebar";

/* ====================== TYPES ====================== */
interface Player {
  id: string;
  full_name: string;
  nickname?: string;
}

interface Match {
  id: string;
  match_date: string;
  status: "scheduled" | "completed";
  player1_score: number;
  player2_score: number;
  player1: Player;
  player2: Player;
  winner?: Player;
}

interface LeaderboardEntry {
  id: string;
  full_name: string;
  nickname?: string;
  matches_played: number;
  wins: number;
  losses: number;
  total_points: number;
  win_rate?: number;
}

/* ====================== HELPERS ====================== */
function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getInitial(name: string) {
  return name?.charAt(0).toUpperCase() ?? "?";
}

/* ====================== SUBCOMPONENTS ====================== */

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="relative bg-neutral-900 border border-neutral-800 rounded-2xl p-6 overflow-hidden group hover:border-orange-500/40 transition-all duration-300">
      {/* Glow accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 transition-all duration-500" />
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-lg">
          {icon}
        </div>
      </div>
      <p className="text-neutral-500 text-xs font-semibold uppercase tracking-widest mb-1">
        {label}
      </p>
      <h3 className="text-3xl font-bold text-white">{value}</h3>
      {sub && <p className="text-neutral-600 text-xs mt-1">{sub}</p>}
    </div>
  );
}

function MatchCard({ match }: { match: Match }) {
  const isCompleted = match.status === "completed";

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 hover:border-neutral-700 transition-all duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span
          className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
            isCompleted
              ? "bg-green-500/10 border-green-500/30 text-green-400"
              : "bg-orange-500/10 border-orange-500/30 text-orange-400"
          }`}
        >
          {isCompleted ? "Selesai" : "Terjadwal"}
        </span>
        <span className="text-neutral-600 text-xs">
          {formatDate(match.match_date)}
        </span>
      </div>

      {/* Scores */}
      <div className="flex items-center justify-between gap-3">
        {/* Player 1 */}
        <div className="flex-1 text-center">
          <p className="text-neutral-300 text-sm font-medium truncate">
            {match.player1.full_name}
          </p>
          {isCompleted && (
            <p
              className={`text-3xl font-black mt-1 ${
                match.winner?.id === match.player1.id
                  ? "text-white"
                  : "text-neutral-600"
              }`}
            >
              {match.player1_score}
            </p>
          )}
        </div>

        {/* VS */}
        <div className="flex-shrink-0 text-center">
          <span className="text-neutral-700 text-xs font-bold uppercase tracking-wider">
            vs
          </span>
        </div>

        {/* Player 2 */}
        <div className="flex-1 text-center">
          <p className="text-neutral-300 text-sm font-medium truncate">
            {match.player2.full_name}
          </p>
          {isCompleted && (
            <p
              className={`text-3xl font-black mt-1 ${
                match.winner?.id === match.player2.id
                  ? "text-white"
                  : "text-neutral-600"
              }`}
            >
              {match.player2_score}
            </p>
          )}
        </div>
      </div>

      {/* Winner Banner */}
      {isCompleted && match.winner && (
        <div className="mt-3 pt-3 border-t border-neutral-800 flex items-center justify-center gap-1.5">
          <span className="text-xs">🏆</span>
          <span className="text-orange-400 text-xs font-semibold">
            {match.winner.full_name} Menang
          </span>
        </div>
      )}
    </div>
  );
}

function LeaderboardTable({ data }: { data: LeaderboardEntry[] }) {
  return (
    // PERBAIKAN: Ubah overflow-hidden menjadi overflow-x-auto agar tabel bisa digeser ke samping di mode mobile
    <div className="overflow-x-auto rounded-xl border border-neutral-800">
      {/* Tambahkan min-w agar struktur kolom tidak menyusut paksa dan tetap rapi saat di-scroll */}
      <div className="min-w-[600px]">
        {/* Table Header */}
        <div className="grid grid-cols-[40px_1fr_60px_60px_60px_80px_80px] gap-4 px-4 py-3 bg-neutral-900/60 border-b border-neutral-800">
          {["#", "Player", "M", "W", "L", "Pts", "Win%"].map((h, i) => (
            <span
              key={i}
              className="text-neutral-600 text-[10px] font-bold uppercase tracking-widest text-center first:text-left"
            >
              {h}
            </span>
          ))}
        </div>

        {/* Rows */}
        <div className="divide-y divide-neutral-800/60">
          {data.map((player, idx) => {
            const winRate =
              player.win_rate ??
              (player.matches_played > 0
                ? (player.wins / player.matches_played) * 100
                : 0);
            const isTop = idx === 0;

            return (
              <div
                key={player.id}
                className={`grid grid-cols-[40px_1fr_60px_60px_60px_80px_80px] gap-4 px-4 py-3.5 items-center transition-colors hover:bg-neutral-800/30 ${
                  isTop ? "bg-orange-500/5" : ""
                }`}
              >
                {/* Rank */}
                <div className="flex items-center justify-center">
                  {idx === 0 ? (
                    <span className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center text-black text-xs font-black">
                      1
                    </span>
                  ) : idx === 1 ? (
                    <span className="w-7 h-7 rounded-full bg-neutral-600 flex items-center justify-center text-white text-xs font-bold">
                      2
                    </span>
                  ) : idx === 2 ? (
                    <span className="w-7 h-7 rounded-full bg-amber-700 flex items-center justify-center text-white text-xs font-bold">
                      3
                    </span>
                  ) : (
                    <span className="text-neutral-600 text-sm font-medium text-center w-7 block">
                      {idx + 1}
                    </span>
                  )}
                </div>

                {/* Player */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                      isTop
                        ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                        : "bg-neutral-800 text-neutral-400 border border-neutral-700"
                    }`}
                  >
                    {getInitial(player.full_name)}
                  </div>
                  <span
                    className={`text-sm font-semibold truncate ${
                      isTop ? "text-orange-400" : "text-neutral-200"
                    }`}
                  >
                    {player.full_name}
                  </span>
                </div>

                {/* Matches */}
                <span className="text-neutral-400 text-sm text-center">
                  {player.matches_played}
                </span>

                {/* Wins */}
                <span className="text-green-400 text-sm font-semibold text-center">
                  {player.wins}
                </span>

                {/* Losses */}
                <span className="text-red-400 text-sm text-center">
                  {player.losses}
                </span>

                {/* Points */}
                <div className="text-center">
                  <span
                    className={`text-sm font-bold ${
                      isTop ? "text-orange-400" : "text-neutral-300"
                    }`}
                  >
                    {player.total_points}
                  </span>
                  <span className="text-neutral-600 text-xs"> pts</span>
                </div>

                {/* Win Rate */}
                <div className="text-center">
                  <span
                    className={`text-sm font-bold ${
                      isTop ? "text-orange-400" : "text-neutral-300"
                    }`}
                  >
                    {winRate.toFixed(1)}%
                  </span>
                  <div className="mt-1 h-0.5 bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isTop ? "bg-orange-500" : "bg-neutral-600"
                      }`}
                      style={{ width: `${winRate}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="px-4 py-3 border-t border-neutral-800 bg-neutral-900/40">
          <p className="text-neutral-700 text-xs text-center">
            Showing {data.length} players · Updated in real-time
          </p>
        </div>
      </div>
    </div>
  );
}

/* ====================== MAIN PAGE ====================== */
export default function DashboardPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      try {
        const [matchRes, leaderRes, playerRes] = await Promise.all([
          fetch("/api/matches"),
          fetch("/api/leaderboard"),
          fetch("/api/players"),
        ]);

        const matchData = await matchRes.json();
        const leaderData = await leaderRes.json();
        const playerData = await playerRes.json();

        setMatches(Array.isArray(matchData) ? matchData : []);
        setLeaderboard(
          Array.isArray(leaderData) ? leaderData : (leaderData?.data ?? []),
        );
        setPlayers(Array.isArray(playerData) ? playerData : []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, []);

  const completedMatches = matches.filter((m) => m.status === "completed");
  const activePlayers = players.length;
  const totalMatches = matches.length;

  return (
    // PERBAIKAN 1: Tambahkan class `flex` pada container utama
    <div className="flex min-h-screen bg-neutral-950 text-neutral-200">
      <Sidebar />

      {/* PERBAIKAN 2: Gunakan flex-1, hapus ml-64, dan sesuaikan padding mobile/desktop */}
      <main className="flex-1 w-full p-6 pt-20 lg:pt-8 lg:p-8 overflow-x-hidden">
        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-1 h-4 rounded-full bg-orange-500" />
            <p className="text-orange-500 text-[11px] font-bold tracking-[0.25em] uppercase">
              System Overview
            </p>
          </div>
          <div className="flex items-end justify-between">
            <h1 className="text-4xl font-black text-white tracking-tight">
              Dashboard
            </h1>
          </div>
          <div className="mt-5 h-px bg-neutral-800" />
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <StatCard
            icon="🎱"
            label="Total Matches"
            value={loading ? "—" : totalMatches}
            sub={`${completedMatches.length} selesai`}
          />
          <StatCard
            icon="👥"
            label="Active Players"
            value={loading ? "—" : activePlayers}
            sub="Terdaftar di sistem"
          />
        </div>

        {/* Main Grid: Matches + Leaderboard */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.6fr] gap-6">
          {/* Daftar Pertandingan */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white">
                Daftar Pertandingan
              </h2>
              <span className="text-neutral-600 text-xs">
                {matches.length} total
              </span>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-28 bg-neutral-900 rounded-xl animate-pulse border border-neutral-800"
                  />
                ))}
              </div>
            ) : matches.length === 0 ? (
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 text-center">
                <p className="text-neutral-600 text-sm">
                  Belum ada pertandingan
                </p>
              </div>
            ) : (
              <div
                // PERBAIKAN: Ubah max-h-[600px] menjadi lg:max-h-[600px].
                // Ini membuat daftar pertandingan tidak menjebak scroll pada mode mobile (biar bisa scroll halaman ke bawah dengan lancar).
                className="space-y-3 lg:max-h-[600px] overflow-y-auto pr-1"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "#404040 #171717",
                }}
              >
                {matches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            )}
          </section>

          {/* Leaderboard */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white">Leaderboard</h2>
              <span className="text-neutral-600 text-xs">
                {leaderboard.length} pemain
              </span>
            </div>

            {loading ? (
              <div className="h-64 bg-neutral-900 rounded-xl animate-pulse border border-neutral-800" />
            ) : leaderboard.length === 0 ? (
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 text-center">
                <p className="text-neutral-600 text-sm">
                  Belum ada data leaderboard
                </p>
              </div>
            ) : (
              <LeaderboardTable data={leaderboard} />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
