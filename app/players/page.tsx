"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/app/components/Sidebar";

import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

/* ====================== TYPES ====================== */
interface Player {
  id: string;
  full_name: string;
  nickname: string;
  avatar_url?: string;
  wins: number;
  losses: number;
  matches_played: number;
  total_points: number;
  created_at: string;
}

type ModalMode = "create" | "edit" | null;

interface Toast {
  id: number;
  message: string;
  type: "success" | "error";
}

/* ====================== HELPERS ====================== */
function getInitial(name: string) {
  return name?.charAt(0).toUpperCase() ?? "?";
}

/* ====================== MAIN PAGE ====================== */
export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Player | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    nickname: "",
    avatar_url: "",
  });

  /* ---- Toast ---- */
  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      3000,
    );
  };

  /* ---- Fetch ---- */
  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/players");
      if (!res.ok) throw new Error("Gagal mengambil data pemain");
      const data = await res.json();
      setPlayers(Array.isArray(data) ? data : []);
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  /* ---- Open Modals ---- */
  const openCreate = () => {
    setForm({ full_name: "", nickname: "", avatar_url: "" });
    setSelectedPlayer(null);
    setModalMode("create");
  };

  const openEdit = (player: Player) => {
    setForm({
      full_name: player.full_name,
      nickname: player.nickname ?? "",
      avatar_url: player.avatar_url ?? "",
    });
    setSelectedPlayer(player);
    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedPlayer(null);
  };

  /* ---- Create ---- */
  const handleCreate = async () => {
    if (!form.full_name.trim())
      return showToast("Nama lengkap wajib diisi", "error");

    try {
      setSubmitting(true);

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        throw new Error("Anda harus login sebagai admin");
      }

      const token = session.access_token;

      const res = await fetch("/api/players", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal membuat pemain");

      showToast("Pemain berhasil ditambahkan!");
      closeModal();
      fetchPlayers();
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  /* ---- Update ---- */
  const handleUpdate = async () => {
    if (!form.full_name.trim())
      return showToast("Nama lengkap wajib diisi", "error");
    if (!selectedPlayer) return;

    try {
      setSubmitting(true);

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError || !session)
        throw new Error("Anda harus login sebagai admin");
      const token = session.access_token;

      const res = await fetch("/api/players", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ player_id: selectedPlayer.id, ...form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengupdate pemain");

      showToast("Pemain berhasil diupdate!");
      closeModal();
      fetchPlayers();
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  /* ---- Delete ---- */
  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setSubmitting(true);

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError || !session)
        throw new Error("Anda harus login sebagai admin");
      const token = session.access_token;

      const res = await fetch("/api/players", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ player_id: deleteTarget.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menghapus pemain");

      showToast("Pemain berhasil dihapus!");
      setDeleteTarget(null);
      fetchPlayers();
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  /* ====================== RENDER ====================== */
  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#0a0a0a] text-zinc-300 font-sans overflow-hidden">
      <Sidebar />

      <main
        className="flex-1 overflow-y-auto p-4 pt-20 md:p-6 lg:p-12"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#1a1a1a #0a0a0a" }}
      >
        <div className="w-full px-2">
          {/* Header */}
          <header className="mb-8 md:mb-10">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-1 h-4 rounded-full bg-orange-500" />
              <p className="text-orange-500 text-[11px] font-bold tracking-[0.25em] uppercase">
                Player Directory
              </p>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-end gap-3">
                <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                  Daftar Pemain
                </h1>
                {!loading && (
                  <p className="text-sm text-neutral-600 mb-1">
                    <span className="text-orange-500 font-bold">
                      {players.length}
                    </span>{" "}
                    players
                  </p>
                )}
              </div>

              {/* Tombol Tambah Pemain */}
              <button
                onClick={openCreate}
                className="flex items-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-orange-900/30 flex-shrink-0"
              >
                <span className="text-lg leading-none">+</span>
                <span>Tambah Pemain</span>
              </button>
            </div>

            <div className="mt-5 h-px bg-neutral-800" />
          </header>

          {/* Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mb-8">
            {[
              { label: "Total Pemain", value: players.length },
              {
                label: "Total Matches",
                value: players.reduce((s, p) => s + p.matches_played, 0),
              },
              {
                label: "Total Menang",
                value: players.reduce((s, p) => s + p.wins, 0),
              },
              {
                label: "Total Poin",
                value: players.reduce((s, p) => s + p.total_points, 0),
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 md:p-4"
              >
                <p className="text-zinc-600 text-[10px] font-semibold uppercase tracking-widest mb-1">
                  {stat.label}
                </p>
                <p className="text-xl md:text-2xl font-black text-white">
                  {loading ? "—" : stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Table */}
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-16 bg-zinc-900 rounded-xl animate-pulse border border-zinc-800/50"
                />
              ))}
            </div>
          ) : players.length === 0 ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 md:p-12 text-center">
              <p className="text-zinc-600 text-sm mb-4">
                Belum ada pemain terdaftar.
              </p>
              <button
                onClick={openCreate}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold rounded-xl transition-colors"
              >
                <span>+</span>
                <span>Tambah Pemain Pertama</span>
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-end gap-1.5 mb-2 md:hidden">
                <span className="text-zinc-600 text-[10px]">
                  Geser untuk melihat lebih
                </span>
                <span className="text-zinc-500 text-xs animate-bounce">⟷</span>
              </div>

              <div
                className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-x-auto"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "#3f3f46 #18181b",
                }}
              >
                <div className="min-w-[600px]">
                  {/* Table Head */}
                  <div className="grid grid-cols-[180px_60px_60px_60px_70px_90px] gap-4 px-4 md:px-5 py-3 border-b border-zinc-800 bg-zinc-900/80">
                    {["Pemain", "M", "W", "L", "Poin", "Aksi"].map((h) => (
                      <span
                        key={h}
                        className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest text-center first:text-left last:text-right"
                      >
                        {h}
                      </span>
                    ))}
                  </div>

                  {/* Rows */}
                  <div className="divide-y divide-zinc-800/50">
                    {players.map((player) => (
                      <div
                        key={player.id}
                        className="grid grid-cols-[180px_60px_60px_60px_70px_90px] gap-4 px-4 md:px-5 py-4 items-center hover:bg-zinc-800/30 transition-colors"
                      >
                        {/* Player Info */}
                        <div className="flex items-center gap-3 min-w-0">
                          {player.avatar_url ? (
                            <img
                              src={player.avatar_url}
                              alt={player.full_name}
                              className="w-9 h-9 rounded-full object-cover flex-shrink-0 border border-zinc-700"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-sm font-bold text-zinc-400 flex-shrink-0">
                              {getInitial(player.full_name)}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-zinc-200 break-words">
                              {player.full_name}
                            </p>
                            {player.nickname && (
                              <p className="text-xs text-zinc-600 break-words">
                                @{player.nickname}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Stats */}
                        <span className="text-zinc-400 text-sm text-center">
                          {player.matches_played}
                        </span>
                        <span className="text-green-400 text-sm font-semibold text-center">
                          {player.wins}
                        </span>
                        <span className="text-red-400 text-sm text-center">
                          {player.losses}
                        </span>
                        <div className="text-center">
                          <span className="text-orange-400 text-sm font-bold">
                            {player.total_points}
                          </span>
                          <span className="text-zinc-700 text-xs"> pts</span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-1.5 md:gap-2">
                          <button
                            onClick={() => openEdit(player)}
                            className="px-2.5 md:px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] md:text-xs font-semibold rounded-lg transition-colors border border-zinc-700/50"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteTarget(player)}
                            className="px-2.5 md:px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[10px] md:text-xs font-semibold rounded-lg transition-colors border border-red-500/20"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* ====================== MODAL CREATE / EDIT ====================== */}
      {modalMode && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 md:p-5 w-full max-w-sm shadow-2xl">
            <div className="mb-5">
              <h3 className="text-base font-bold text-white">
                {modalMode === "create" ? "Tambah Pemain" : "Edit Pemain"}
              </h3>
              <p className="text-xs text-zinc-600 mt-0.5">
                {modalMode === "create"
                  ? "Isi data pemain baru"
                  : "Ubah data pemain"}
              </p>
            </div>

            <div className="space-y-3 mb-5">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                  Nama Lengkap <span className="text-orange-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.full_name}
                  onChange={(e) =>
                    setForm({ ...form, full_name: e.target.value })
                  }
                  placeholder="Masukkan nama lengkap"
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-orange-500 rounded-lg px-3 py-2.5 text-sm text-zinc-200 outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                  Nickname
                </label>
                <input
                  type="text"
                  value={form.nickname}
                  onChange={(e) =>
                    setForm({ ...form, nickname: e.target.value })
                  }
                  placeholder="Opsional"
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-orange-500 rounded-lg px-3 py-2.5 text-sm text-zinc-200 outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                  URL Avatar
                </label>
                <input
                  type="text"
                  value={form.avatar_url}
                  onChange={(e) =>
                    setForm({ ...form, avatar_url: e.target.value })
                  }
                  placeholder="https://... (opsional)"
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-orange-500 rounded-lg px-3 py-2.5 text-sm text-zinc-200 outline-none transition-colors"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={closeModal}
                disabled={submitting}
                className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 font-semibold rounded-xl transition-colors text-sm disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={modalMode === "create" ? handleCreate : handleUpdate}
                disabled={submitting}
                className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl transition-colors text-sm disabled:opacity-50"
              >
                {submitting ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================== MODAL DELETE CONFIRM ====================== */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 md:p-5 w-full max-w-sm shadow-2xl">
            <div className="mb-5">
              <h3 className="text-base font-bold text-white">Hapus Pemain</h3>
              <p className="text-xs text-zinc-500 mt-1">
                Yakin ingin menghapus{" "}
                <span className="text-zinc-300 font-semibold">
                  {deleteTarget.full_name}
                </span>
                ? Tindakan ini tidak bisa dibatalkan.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={submitting}
                className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 font-semibold rounded-xl transition-colors text-sm disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={submitting}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-colors text-sm disabled:opacity-50"
              >
                {submitting ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================== TOAST ====================== */}
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border text-sm font-medium transition-all duration-300 pointer-events-auto ${
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
