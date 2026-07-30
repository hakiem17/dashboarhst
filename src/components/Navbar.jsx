import React, { useState } from 'react';
import { 
  Search, 
  Sun, 
  Moon, 
  Bell, 
  UserCircle, 
  Sparkles, 
  Calendar, 
  Menu, 
  X
} from 'lucide-react';
import { hstInfo } from '../data/mockData';

export default function Navbar({ 
  darkMode, 
  setDarkMode, 
  activeYear, 
  setActiveYear, 
  onOpenAiCopilot,
  toggleSidebar,
  sidebarOpen
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifications = [
    { id: 1, text: 'Dataset BPKAD Q2 2026 telah diverifikasi Walidata', time: '10m lalu', unread: true },
    { id: 2, text: 'Peringatan BMKG: Potensi hujan sedang di Hantakan', time: '1 jam lalu', unread: true },
    { id: 3, text: '2 OPD mengunggah pembaharuan eWalidata SIPD', time: '3 jam lalu', unread: false }
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-zinc-200/80 dark:border-slate-800/80 transition-colors duration-200">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left Side: Brand Logo & Sidebar Toggle */}
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-lg text-zinc-500 dark:text-slate-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-slate-800/70 transition"
            aria-label="Toggle Sidebar"
            title={sidebarOpen ? "Sembunyikan Sidebar" : "Tampilkan Sidebar"}
          >
            {sidebarOpen ? <X className="w-5 h-5 text-slate-400" /> : <Menu className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />}
          </button>

          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/30 p-1 shadow-glow-green">
              <img 
                src={hstInfo.logoUrl} 
                alt="Logo HST" 
                className="w-full h-full object-contain filter drop-shadow" 
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = "https://placehold.co/100x100/166534/ffffff?text=HST";
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-zinc-900 dark:text-white font-sans">
                  Dashboard <span className="text-emerald-600 dark:text-emerald-400">HST</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30">
                  {hstInfo.tagline}
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-slate-400 hidden md:block">
                Kabupaten Hulu Sungai Tengah - Barabai
              </p>
            </div>
          </div>
        </div>

        {/* Middle: Global Search */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari dataset, indikator, kecamatan, atau dokumen HST..."
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-white dark:bg-slate-900/80 border border-zinc-200 dark:border-slate-700/70 rounded-full text-zinc-900 dark:text-slate-200 placeholder-zinc-400 dark:placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
            />
          </div>
        </div>

        {/* Right Side: Tools & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* AI Copilot Button */}
          <button
            onClick={onOpenAiCopilot}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-md shadow-emerald-900/30 transition transform hover:scale-105"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span className="hidden sm:inline">Murakata AI</span>
          </button>

          {/* Year Selector */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900/80 border border-zinc-200 dark:border-slate-700/70 rounded-lg px-2 py-1 text-xs text-zinc-700 dark:text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <select
              value={activeYear}
              onChange={(e) => setActiveYear(e.target.value)}
              className="bg-transparent text-zinc-800 dark:text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="2026" className="bg-white dark:bg-slate-900 text-zinc-900 dark:text-white font-semibold">2026</option>
              <option value="2025" className="bg-white dark:bg-slate-900 text-zinc-900 dark:text-white font-semibold">2025</option>
              <option value="2024" className="bg-white dark:bg-slate-900 text-zinc-900 dark:text-white font-semibold">2024</option>
            </select>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg text-zinc-500 dark:text-slate-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-slate-800/70 transition"
            title={darkMode ? "Ganti ke Mode Terang" : "Ganti ke Mode Gelap"}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-500" />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg text-zinc-500 dark:text-slate-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-slate-800/70 transition"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-zinc-200 dark:border-slate-800 rounded-xl shadow-2xl z-50 p-3">
                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-slate-800 pb-2 mb-2">
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Notifikasi Data
                  </h4>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium cursor-pointer hover:underline">
                    Tandai dibaca
                  </span>
                </div>
                <div className="space-y-2">
                  {notifications.map((n) => (
                    <div key={n.id} className={`p-2 rounded-lg text-xs ${n.unread ? 'bg-emerald-50/50 dark:bg-slate-800/80 border border-emerald-500/20' : 'bg-zinc-50 dark:bg-slate-900/50'}`}>
                      <p className="text-zinc-800 dark:text-slate-200 font-medium leading-snug">{n.text}</p>
                      <span className="text-[10px] text-zinc-400 dark:text-slate-400 mt-1 block">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Login */}
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-600/10 dark:bg-emerald-600/20 hover:bg-emerald-600/20 dark:hover:bg-emerald-600/30 border border-emerald-500/30 dark:border-emerald-500/40 text-emerald-600 dark:text-emerald-300 text-xs font-medium transition">
            <UserCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Masuk / Login</span>
          </button>

        </div>
      </div>
    </header>
  );
}
