"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

const navItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    name: "Leaderboard",
    path: "/leaderboard",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  },
  {
    name: "Matches",
    path: "/matches",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    name: "Players",
    path: "/players",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Tutup drawer saat navigasi
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // Cegah scroll body saat drawer buka
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  // PERBAIKAN: Ubah menjadi fungsi biasa agar tidak re-render seluruh DOM
  const renderNavLinks = (onClick?: () => void) => {
    return navItems.map((item) => {
      const isActive = pathname === item.path;
      return (
        <Link key={item.path} href={item.path} onClick={onClick}>
          <span
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
              isActive
                ? "bg-orange-500/10 text-orange-500 border border-orange-500/20 font-medium shadow-[0_0_15px_rgba(249,115,22,0.1)]"
                : "text-neutral-400 hover:bg-neutral-800 hover:text-white border border-transparent"
            }`}
          >
            <span className="shrink-0">{item.icon}</span>
            <span className="text-sm">{item.name}</span>
          </span>
        </Link>
      );
    });
  };

  return (
    <>
      {/* =====================
          DESKTOP SIDEBAR
          PERBAIKAN: Menggunakan sticky h-screen bukan fixed agar layout konten sebelahnya (main) rapi
      ===================== */}
      <aside className="hidden lg:flex w-64 h-screen bg-neutral-900 border-r border-neutral-800 flex-col sticky top-0 z-40">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white tracking-wider">
            <span className="text-orange-500">JTT</span>comunity
          </h2>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">{renderNavLinks()}</nav>

        <div className="p-4 border-t border-neutral-800">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2.5 text-sm font-medium text-neutral-400 hover:text-red-400 transition-colors text-left flex items-center gap-2 rounded-xl hover:bg-red-500/5"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* =====================
          MOBILE TOP BAR
      ===================== */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-neutral-900/95 backdrop-blur-sm border-b border-neutral-800 flex items-center justify-between px-4 h-14">
        <h2 className="text-lg font-bold text-white tracking-wider">
          <span className="text-orange-500">JTT</span>comunity
        </h2>
        <button
          onClick={() => setDrawerOpen(true)}
          className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          aria-label="Buka menu"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </header>

      {/* =====================
          MOBILE DRAWER OVERLAY
      ===================== */}
      {drawerOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* =====================
          MOBILE DRAWER PANEL
      ===================== */}
      <div
        className={`lg:hidden fixed top-0 left-0 h-full w-72 bg-neutral-900 border-r border-neutral-800 z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-neutral-800">
          <h2 className="text-xl font-bold text-white tracking-wider">
            Billiard<span className="text-orange-500">Hub</span>
          </h2>
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            aria-label="Tutup menu"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
          {renderNavLinks(() => setDrawerOpen(false))}
        </nav>

        <div className="p-4 border-t border-neutral-800">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2.5 text-sm font-medium text-neutral-400 hover:text-red-400 transition-colors text-left flex items-center gap-2 rounded-xl hover:bg-red-500/5"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
}
