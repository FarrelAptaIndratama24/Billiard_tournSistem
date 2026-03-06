"use client";

import Sidebar from "@/app/components/Sidebar";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200">
      <Sidebar />

      {/* Main Content - diberi margin kiri (ml-64) selebar sidebar */}
      <main className="ml-64 p-8">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-neutral-500 mt-1">
            Pantau statistik turnamen billiard kamu.
          </p>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { label: "Total Matches", value: "142", icon: "🎱" },
            { label: "Active Players", value: "48", icon: "👥" },
            { label: "Tournaments", value: "3", icon: "🏆" },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 hover:border-orange-500/50 transition-all duration-300 group hover:shadow-[0_0_20px_rgba(249,115,22,0.05)]"
            >
              <div className="text-3xl mb-4">{stat.icon}</div>
              <p className="text-neutral-500 text-sm font-medium uppercase tracking-wider">
                {stat.label}
              </p>
              <h3 className="text-4xl font-bold text-white group-hover:text-orange-500 transition-colors mt-1">
                {stat.value}
              </h3>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
