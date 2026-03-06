"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "Leaderboard", path: "/leaderboard", icon: "🏆" },
    { name: "Matches", path: "/matches", icon: "🎱" },
    { name: "Players", path: "/players", icon: "👥" },
  ];

  return (
    <aside className="w-64 min-h-screen bg-neutral-900 border-r border-neutral-800 flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-white tracking-wider">
          Billiard<span className="text-orange-500">Hub</span>
        </h2>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link key={item.path} href={item.path}>
              <span
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-orange-500/10 text-orange-500 border border-orange-500/20 font-medium shadow-[0_0_15px_rgba(249,115,22,0.1)]"
                    : "text-neutral-400 hover:bg-neutral-800 hover:text-white border border-transparent"
                }`}
              >
                <span>{item.icon}</span>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-neutral-800">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 text-sm font-medium text-neutral-400 hover:text-red-500 transition-colors text-left flex items-center gap-2"
        >
          <span>🚪</span> Sign Out
        </button>
      </div>
    </aside>
  );
}
