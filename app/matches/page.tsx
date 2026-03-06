"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/app/components/Sidebar"; // Pastikan path ini sesuai

// Tipe data berdasarkan response API Anda
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

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newMatch, setNewMatch] = useState({
    player1_id: "",
    player2_id: "",
    match_date: "",
  });

  const [updatingMatch, setUpdatingMatch] = useState<Match | null>(null);
  const [scores, setScores] = useState({ player1_score: 0, player2_score: 0 });

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
      const res = await fetch("/api/matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMatch),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal membuat pertandingan");

      alert("Pertandingan berhasil dibuat!");
      setNewMatch({ player1_id: "", player2_id: "", match_date: "" });
      fetchMatches();
    } catch (err: any) {
      alert(err.message);
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

      alert("Skor berhasil diupdate!");
      setUpdatingMatch(null);
      fetchMatches();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    // Wrapper utama diubah menjadi flex h-screen
    <div className="flex h-screen bg-[#0a0a0a] text-zinc-300 font-sans overflow-hidden">
      {/* Memanggil Sidebar */}
      <Sidebar />

      {/* Konten Utama - Scrollable */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-12">
        <div className="max-w-6xl mx-auto space-y-10">
          {/* Header */}
          <header className="border-b border-orange-500/30 pb-6">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 tracking-tight">
              Sistem Pertandingan
            </h1>
            <p className="text-zinc-500 mt-2 text-sm">
              Kelola jadwal dan skor pertandingan dengan mudah.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Kolom Kiri: Form Create Match */}
            <div className="lg:col-span-1">
              <div className="bg-zinc-900/80 border border-orange-500/20 rounded-2xl p-6 shadow-xl shadow-orange-900/5 backdrop-blur-sm sticky top-6">
                <h2 className="text-xl font-bold text-orange-500 mb-6 flex items-center gap-2">
                  <span className="w-2 h-6 bg-orange-500 rounded-full"></span>
                  Buat Match Baru
                </h2>
                <form onSubmit={handleCreateMatch} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1 uppercase tracking-wider">
                      ID Player 1
                    </label>
                    <input
                      type="text"
                      required
                      value={newMatch.player1_id}
                      onChange={(e) =>
                        setNewMatch({ ...newMatch, player1_id: e.target.value })
                      }
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-200 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                      placeholder="Masukkan UUID Player 1"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1 uppercase tracking-wider">
                      ID Player 2
                    </label>
                    <input
                      type="text"
                      required
                      value={newMatch.player2_id}
                      onChange={(e) =>
                        setNewMatch({ ...newMatch, player2_id: e.target.value })
                      }
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-200 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                      placeholder="Masukkan UUID Player 2"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1 uppercase tracking-wider">
                      Tanggal & Waktu
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={newMatch.match_date}
                      onChange={(e) =>
                        setNewMatch({ ...newMatch, match_date: e.target.value })
                      }
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-200 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all [color-scheme:dark]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full mt-4 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-600/20 transition-all transform hover:-translate-y-0.5"
                  >
                    Jadwalkan Pertandingan
                  </button>
                </form>
              </div>
            </div>

            {/* Kolom Kanan: Daftar Match */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                Daftar Pertandingan
              </h2>

              {loading ? (
                <div className="animate-pulse flex space-x-4 p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800/50">
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-zinc-800 rounded"></div>
                      <div className="h-4 bg-zinc-800 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              ) : error ? (
                <p className="text-red-400 bg-red-950/30 p-4 rounded-xl border border-red-900/50">
                  {error}
                </p>
              ) : matches.length === 0 ? (
                <p className="text-zinc-500 text-center py-10 bg-zinc-900/30 rounded-2xl border border-zinc-800/50">
                  Belum ada pertandingan yang dijadwalkan.
                </p>
              ) : (
                <div className="grid gap-4">
                  {matches.map((match) => (
                    <div
                      key={match.id}
                      className="bg-zinc-900/60 border border-zinc-800 hover:border-orange-500/30 transition-colors rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-6"
                    >
                      {/* Info Player & Skor */}
                      <div className="flex items-center gap-6 w-full sm:w-auto">
                        <div className="text-center w-20">
                          <p className="text-sm font-semibold text-zinc-400 truncate">
                            {match.player1?.nickname || "P1"}
                          </p>
                          <p className="text-3xl font-black text-white">
                            {match.status === "completed"
                              ? match.player1_score
                              : "-"}
                          </p>
                        </div>

                        <div className="flex flex-col items-center justify-center px-2">
                          <span className="text-[10px] font-bold text-orange-500 bg-orange-500/10 px-2.5 py-1 rounded-full uppercase tracking-widest mb-1">
                            {match.status}
                          </span>
                          <span className="text-zinc-600 text-sm font-bold">
                            VS
                          </span>
                          <span className="text-xs text-zinc-500 mt-1 whitespace-nowrap">
                            {new Date(match.match_date).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </span>
                        </div>

                        <div className="text-center w-20">
                          <p className="text-sm font-semibold text-zinc-400 truncate">
                            {match.player2?.nickname || "P2"}
                          </p>
                          <p className="text-3xl font-black text-white">
                            {match.status === "completed"
                              ? match.player2_score
                              : "-"}
                          </p>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="flex justify-end w-full sm:w-auto">
                        {match.status === "scheduled" && (
                          <button
                            onClick={() => {
                              setUpdatingMatch(match);
                              setScores({ player1_score: 0, player2_score: 0 });
                            }}
                            className="w-full sm:w-auto px-5 py-2 bg-zinc-800 hover:bg-orange-600 text-zinc-300 hover:text-white text-sm font-semibold rounded-lg border border-zinc-700 hover:border-orange-500 transition-all whitespace-nowrap"
                          >
                            Update Skor
                          </button>
                        )}
                        {match.status === "completed" && match.winner && (
                          <div className="w-full sm:w-auto px-4 py-2 text-center rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium whitespace-nowrap">
                            🏆 {match.winner.nickname} Menang
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modal Update Score */}
      {updatingMatch && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-orange-500/30 rounded-2xl p-6 md:p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              Update Skor
            </h3>

            <div className="flex justify-between items-center mb-8 px-4">
              <div className="text-center flex-1">
                <p className="text-sm text-zinc-400 mb-2 truncate">
                  {updatingMatch.player1.nickname}
                </p>
                <input
                  type="number"
                  min="0"
                  value={scores.player1_score}
                  onChange={(e) =>
                    setScores({
                      ...scores,
                      player1_score: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-20 bg-zinc-950 border-2 border-zinc-800 focus:border-orange-500 text-center text-3xl font-bold text-white rounded-xl py-3 outline-none transition-colors"
                />
              </div>

              <div className="text-zinc-600 font-black text-2xl px-4">VS</div>

              <div className="text-center flex-1">
                <p className="text-sm text-zinc-400 mb-2 truncate">
                  {updatingMatch.player2.nickname}
                </p>
                <input
                  type="number"
                  min="0"
                  value={scores.player2_score}
                  onChange={(e) =>
                    setScores({
                      ...scores,
                      player2_score: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-20 bg-zinc-950 border-2 border-zinc-800 focus:border-orange-500 text-center text-3xl font-bold text-white rounded-xl py-3 outline-none transition-colors"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setUpdatingMatch(null)}
                className="flex-1 py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleUpdateScore}
                className="flex-1 py-3 px-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl shadow-lg shadow-orange-600/20 transition-colors"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
