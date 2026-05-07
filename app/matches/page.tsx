"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/app/components/Sidebar";

interface Player {
  id: string;
  full_name: string;
  nickname: string;
}

interface Match {
  id: string;
  match_date: string;
  status: "scheduled" | "completed";
  player1_score: number;
  player2_score: number;
  player1: Player;
  player2: Player;
  winner: Player | null;
}

// Helper: cek apakah waktu pertandingan sudah dimulai
const hasMatchStarted = (matchDate: string): boolean => {
  return new Date(matchDate) <= new Date();
};

// Helper: hitung sisa waktu sebelum pertandingan mulai
const getTimeUntilMatch = (matchDate: string): string => {
  const diff = new Date(matchDate).getTime() - new Date().getTime();
  if (diff <= 0) return "";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}h ${hours}j lagi`;
  if (hours > 0) return `${hours}j ${minutes}m lagi`;
  return `${minutes}m lagi`;
};

interface Toast {
  id: number;
  message: string;
  type: "success" | "error";
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [now, setNow] = useState(new Date());
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const [newMatch, setNewMatch] = useState({
    player1_name: "",
    player2_name: "",
    match_date: "",
  });

  const [updatingMatch, setUpdatingMatch] = useState<Match | null>(null);
  const [scores, setScores] = useState({ player1_score: 0, player2_score: 0 });

  // Tick setiap menit agar tombol muncul otomatis saat waktunya tiba
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/matches");
      if (!res.ok) throw new Error("Gagal mengambil data pertandingan");
      const data = await res.json();
      setMatches(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. Gabungkan input form dengan detik ":00" dan offset WITA "+08:00"
      // Contoh: "2026-03-08T02:47" -> "2026-03-08T02:47:00+08:00"
      const dateStringWITA = `${newMatch.match_date}:00+08:00`;

      // 2. Konversi ke standar absolut UTC sebelum dilempar ke database
      const utcDate = new Date(dateStringWITA).toISOString();

      const matchPayload = {
        ...newMatch,
        match_date: utcDate,
      };

      const res = await fetch("/api/matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(matchPayload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal membuat pertandingan");

      showToast("Pertandingan berhasil dibuat!");
      setNewMatch({ player1_name: "", player2_name: "", match_date: "" });
      fetchMatches();
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  const handleUpdateScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updatingMatch) return;

    try {
      const payload = {
        match_id: updatingMatch.id,
        player1_id: updatingMatch.player1.id,
        player2_id: updatingMatch.player2.id,
        player1_score: Number(scores.player1_score),
        player2_score: Number(scores.player2_score),
      };

      const res = await fetch("/api/matches", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal update skor");

      showToast("Skor berhasil diupdate!");
      setUpdatingMatch(null);
      fetchMatches();
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  return (
    // UBAH: min-h-screen menjadi h-screen overflow-hidden agar halaman utama tidak scroll
    <div className="flex h-screen overflow-hidden bg-[#0a0a0a] text-zinc-300 font-sans">
      <Sidebar />

      {/* UBAH: Menambahkan flex, flex-col, dan overflow-hidden */}
      <main className="flex-1 flex flex-col p-4 md:p-8 lg:p-12 overflow-y-auto lg:overflow-hidden">
        {/* UBAH: space-y-8 diganti menjadi gap-8 dengan flex layout agar menyesuaikan tinggi layar */}
        <div className="w-full flex flex-col lg:h-full lg:min-h-0 gap-8">
          {/* Header */}
          {/* UBAH: Menambahkan shrink-0 agar header tidak mengecil */}
          <header className="mb-10">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-1 h-4 rounded-full bg-orange-500" />
              <p className="text-orange-500 text-[11px] font-bold tracking-[0.25em] uppercase">
                Match Schedule
              </p>
            </div>
            <div className="flex items-end justify-between">
              <h1 className="text-4xl font-black text-white tracking-tight">
                Daftar Pertandingan
              </h1>
            </div>
            <div className="mt-5 h-px bg-neutral-800" />
          </header>

          {/* UBAH: lg:flex-1 lg:min-h-0 diubah menjadi flex-1 min-h-0 agar berlaku di semua ukuran layar */}
          <div className="grid grid-cols-1 lg:grid-cols-[5fr_8fr] gap-6 lg:gap-8 lg:flex-1 lg:min-h-0">
            {/* ===== Form Create Match ===== */}
            <div className="lg:col-span-1">
              <div className="bg-zinc-900/80 border border-orange-500/20 rounded-2xl p-5 md:p-6 shadow-xl shadow-orange-900/5 backdrop-blur-sm lg:sticky lg:top-6">
                <h2 className="text-lg md:text-xl font-bold text-orange-500 mb-5 flex items-center gap-2">
                  <span className="w-2 h-5 bg-orange-500 rounded-full shrink-0"></span>
                  Buat Match Baru
                </h2>
                <form onSubmit={handleCreateMatch} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1 uppercase tracking-wider">
                      Nama Player 1
                    </label>
                    <input
                      type="text"
                      required
                      value={newMatch.player1_name}
                      onChange={(e) =>
                        setNewMatch({
                          ...newMatch,
                          player1_name: e.target.value,
                        })
                      }
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-200 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-sm"
                      placeholder="Masukkan Nama Player 1"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1 uppercase tracking-wider">
                      Nama Player 2
                    </label>
                    <input
                      type="text"
                      required
                      value={newMatch.player2_name}
                      onChange={(e) =>
                        setNewMatch({
                          ...newMatch,
                          player2_name: e.target.value,
                        })
                      }
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-200 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-sm"
                      placeholder="Masukkan Nama Player 2"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1 uppercase tracking-wider">
                      Tanggal & Waktu (WITA)
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={newMatch.match_date}
                      onChange={(e) =>
                        setNewMatch({ ...newMatch, match_date: e.target.value })
                      }
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-200 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all [color-scheme:dark] text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full mt-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-600/20 transition-all transform hover:-translate-y-0.5 text-sm"
                  >
                    Jadwalkan Pertandingan
                  </button>
                </form>
              </div>
            </div>

            {/* ===== Daftar Match ===== */}
            {/* UBAH: Menghapus lg: pada overflow-y-auto agar list juga bisa di-scroll di mobile */}
            <div
              className="lg:col-span-1 space-y-4 overflow-y-auto pr-1 pb-4"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#1a1a1a #0a0a0a",
              }}
            >
              <h2 className="text-xl md:text-2xl font-bold text-white">
                Daftar Pertandingan
              </h2>

              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="animate-pulse p-5 bg-zinc-900/50 rounded-2xl border border-zinc-800/50 space-y-3"
                    >
                      <div className="h-3 bg-zinc-800 rounded w-1/3"></div>
                      <div className="h-10 bg-zinc-800 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <p className="text-red-400 bg-red-950/30 p-4 rounded-xl border border-red-900/50 text-sm">
                  {error}
                </p>
              ) : matches.length === 0 ? (
                <p className="text-zinc-500 text-center py-12 bg-zinc-900/30 rounded-2xl border border-zinc-800/50 text-sm">
                  Belum ada pertandingan yang dijadwalkan.
                </p>
              ) : (
                <div className="grid gap-3 md:gap-4">
                  {matches.map((match) => {
                    const started = hasMatchStarted(match.match_date);
                    const timeLeft = !started
                      ? getTimeUntilMatch(match.match_date)
                      : "";

                    return (
                      <div
                        key={match.id}
                        className="bg-zinc-900/60 border border-zinc-800 hover:border-orange-500/30 transition-colors rounded-2xl p-4 md:p-5"
                      >
                        {/* Baris atas: Status + Tanggal */}
                        <div className="flex items-center justify-between mb-3">
                          <span
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest ${
                              match.status === "completed"
                                ? "bg-green-500/10 text-green-400"
                                : started
                                  ? "bg-orange-500/20 text-orange-400 animate-pulse"
                                  : "bg-zinc-800 text-zinc-400"
                            }`}
                          >
                            {match.status === "completed"
                              ? "Selesai"
                              : started
                                ? "Berlangsung"
                                : "Terjadwal"}
                          </span>
                          <span className="text-xs text-zinc-500">
                            {new Date(match.match_date).toLocaleDateString(
                              "id-ID",
                              {
                                timeZone: "Asia/Makassar",
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                            {" WITA"}
                          </span>
                        </div>

                        {/* Baris tengah: Skor & VS */}
                        <div className="flex items-center justify-between gap-2">
                          {/* Player 1 */}
                          <div className="flex-1 text-center min-w-0">
                            <p className="text-xs md:text-sm font-semibold text-zinc-300 truncate px-1">
                              {match.player1?.full_name || "Player 1"}
                            </p>
                            <p className="text-3xl md:text-4xl font-black text-white mt-1">
                              {match.status === "completed"
                                ? match.player1_score
                                : "-"}
                            </p>
                          </div>

                          {/* VS */}
                          <div className="flex flex-col items-center shrink-0 px-2">
                            <span className="text-zinc-600 text-lg font-black">
                              VS
                            </span>
                          </div>

                          {/* Player 2 */}
                          <div className="flex-1 text-center min-w-0">
                            <p className="text-xs md:text-sm font-semibold text-zinc-300 truncate px-1">
                              {match.player2?.full_name || "Player 2"}
                            </p>
                            <p className="text-3xl md:text-4xl font-black text-white mt-1">
                              {match.status === "completed"
                                ? match.player2_score
                                : "-"}
                            </p>
                          </div>
                        </div>

                        {/* Baris bawah: Action */}
                        <div className="mt-4">
                          {match.status === "scheduled" && !started && (
                            <div className="w-full py-2 text-center rounded-lg bg-zinc-800/60 border border-zinc-700/50">
                              <p className="text-xs text-zinc-500">
                                ⏳ Dimulai dalam
                              </p>
                              <p className="text-sm font-bold text-zinc-300 mt-0.5">
                                {timeLeft}
                              </p>
                            </div>
                          )}

                          {match.status === "scheduled" && started && (
                            <button
                              onClick={() => {
                                setUpdatingMatch(match);
                                setScores({
                                  player1_score: 0,
                                  player2_score: 0,
                                });
                              }}
                              className="w-full py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold rounded-xl border border-orange-500/50 transition-all shadow-lg shadow-orange-600/20"
                            >
                              🏅 Update Skor
                            </button>
                          )}

                          {match.status === "completed" && match.winner && (
                            <div className="w-full py-2 text-center rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium">
                              🏆 {match.winner.full_name} Menang
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ===== Modal Update Score ===== */}
      {updatingMatch && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 w-full max-w-sm shadow-2xl">
            {/* Header */}
            <div className="mb-5">
              <h3 className="text-base font-bold text-white">Update Skor</h3>
              <p className="text-xs text-zinc-600 mt-0.5">
                {new Date(updatingMatch.match_date).toLocaleDateString(
                  "id-ID",
                  {
                    timeZone: "Asia/Makassar",
                    day: "numeric",
                    month: "long",
                    hour: "2-digit",
                    minute: "2-digit",
                  },
                )}{" "}
                WITA
              </p>
            </div>

            {/* Score Inputs */}
            <div className="flex items-center gap-3 mb-5">
              {/* Player 1 */}
              <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-center">
                <p
                  className="text-xs text-zinc-500 mb-2 truncate"
                  title={updatingMatch.player1.full_name}
                >
                  {updatingMatch.player1.full_name}
                </p>
                <input
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  min="0"
                  value={scores.player1_score}
                  onChange={(e) =>
                    setScores({
                      ...scores,
                      player1_score: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-transparent text-center text-3xl font-black text-white outline-none focus:text-orange-400 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>

              <span className="text-zinc-700 text-sm font-black flex-shrink-0">
                VS
              </span>

              {/* Player 2 */}
              <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-center">
                <p
                  className="text-xs text-zinc-500 mb-2 truncate"
                  title={updatingMatch.player2.full_name}
                >
                  {updatingMatch.player2.full_name}
                </p>
                <input
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  min="0"
                  value={scores.player2_score}
                  onChange={(e) =>
                    setScores({
                      ...scores,
                      player2_score: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-transparent text-center text-3xl font-black text-white outline-none focus:text-orange-400 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => setUpdatingMatch(null)}
                className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 font-semibold rounded-xl transition-colors text-sm"
              >
                Batal
              </button>
              <button
                onClick={handleUpdateScore}
                className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl transition-colors text-sm"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Toast Notifications ===== */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border text-sm font-medium transition-all duration-300 ${
              toast.type === "success"
                ? "bg-zinc-900 border-green-500/30 text-green-400"
                : "bg-zinc-900 border-red-500/30 text-red-400"
            }`}
          >
            <span>{toast.type === "success" ? "✓" : "✕"}</span>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
