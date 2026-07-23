import React from 'react';
import { 
  CheckCircle2, 
  MapPin, 
  TrendingUp, 
  Building2, 
  FileCheck, 
  ArrowUpRight, 
  Sparkles, 
  CloudSun, 
  Activity, 
  Database 
} from 'lucide-react';
import { 
  hstInfo, 
  macroStats, 
  apbdData, 
  bmkgWeatherData, 
  recentActivities 
} from '../data/mockData';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function HomeView({ onNavigate, onOpenAiCopilot, darkMode }) {

  const quickCards = [
    {
      id: 'ewalidata',
      title: 'Admin & eWalidata SIPD',
      desc: 'Kelola data daerah, verifikasi OPD, dan sinkronisasi SIPD',
      icon: Database,
      color: 'from-cerulean-500/10 to-cerulean-700/10 dark:from-emerald-600/30 dark:to-emerald-900/40 border-cerulean-500/30 dark:border-emerald-500/40 text-cerulean-700 dark:text-emerald-400',
      btnText: 'Kelola Data'
    },
    {
      id: 'ewalidata',
      title: 'Verifikasi Data Sektoral',
      desc: 'Validasi dan audit kelayakan 1.842 dataset terdaftar',
      icon: CheckCircle2,
      color: 'from-tealAcc-500/10 to-tealAcc-700/10 dark:from-teal-600/30 dark:to-teal-900/40 border-tealAcc-500/30 dark:border-teal-500/40 text-tealAcc-700 dark:text-teal-300',
      btnText: 'Verifikasi OPD'
    },
    {
      id: 'profil',
      title: 'Profil Daerah HST',
      desc: 'Informasi demografi, wilayah, dan potensi Barabai',
      icon: MapPin,
      color: 'from-indigo-500/10 to-indigo-700/10 dark:from-indigo-600/30 dark:to-indigo-900/40 border-indigo-500/30 dark:border-indigo-500/40 text-indigo-700 dark:text-indigo-300',
      btnText: 'Lihat Profil'
    },
    {
      id: 'copilot',
      title: 'Murakata AI Assistant',
      desc: 'Tanya statistik dan dokumen publikasi dengan AI cerdas',
      icon: Sparkles,
      color: 'from-amber-500/10 to-amber-700/10 dark:from-amber-600/30 dark:to-amber-900/40 border-amber-500/30 dark:border-amber-500/40 text-amber-700 dark:text-amber-300',
      btnText: 'Tanya AI',
      isAi: true
    }
  ];

  const counters = [
    { label: 'Total OPD Terintegrasi', value: '37 Dinas', icon: Building2, change: '100% Sync' },
    { label: 'Dataset Terpublikasi', value: '1.842', icon: FileCheck, change: '+124 Bln ini' },
    { label: 'Wilayah Kecamatan', value: '11 Kec', icon: MapPin, change: '169 Desa/Kel' },
    { label: 'Indeks Pembangunan (IPM)', value: macroStats.ipm.value, icon: TrendingUp, change: macroStats.ipm.change }
  ];

  return (
    <div className="space-y-8 pb-12">

      {/* Hero Header Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-emerald-950/80 via-slate-900 to-slate-950 border border-emerald-500/30 p-6 sm:p-10 shadow-2xl">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-5">
          
          {/* HST Logo Emblem */}
          <div className="flex justify-center">
            <div className="relative p-3 rounded-2xl bg-gradient-to-b from-emerald-900/90 to-slate-950 border border-emerald-400/40 shadow-glow-green">
              <img 
                src={hstInfo.logoUrl} 
                alt="Logo Kabupaten Hulu Sungai Tengah" 
                className="w-16 h-20 object-contain filter drop-shadow-md"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/120x150/166534/ffffff?text=HST";
                }}
              />
            </div>
          </div>

          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold shadow-sm backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
            <span>#HST_MURAKATA (Mufakat Rakat Seia Sekata)</span>
          </div>

          {/* Main Title & Subtitle */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight font-sans">
              Dashboard Data <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
                Kabupaten Hulu Sungai Tengah
              </span>
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              {hstInfo.subTagline} — Barabai, Kalimantan Selatan.
            </p>
          </div>

          {/* Quick Action Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button 
              onClick={() => onNavigate('ewalidata')}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition shadow-lg shadow-emerald-950/80 flex items-center gap-2"
            >
              <Database className="w-4 h-4" /> Jelajahi Dataset HST
            </button>
            <button 
              onClick={() => onNavigate('peta')}
              className="px-5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition flex items-center gap-2"
            >
              <MapPin className="w-4 h-4 text-emerald-400" /> Peta 11 Kecamatan
            </button>
          </div>

        </div>
      </section>

      {/* Quick Access Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div 
              key={idx}
              className={`p-5 rounded-2xl bg-gradient-to-br ${card.color} bg-slate-50/90 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800/80 backdrop-blur-md flex flex-col justify-between space-y-4 group hover:scale-[1.02] hover:border-cerulean-500/30 dark:hover:border-emerald-500/30 transition cursor-pointer`}
              onClick={() => card.isAi ? onOpenAiCopilot() : onNavigate(card.id)}
            >
              <div className="flex items-start justify-between">
                <div className="p-2.5 rounded-xl bg-slate-200/50 dark:bg-slate-900/80 border border-slate-300/40 dark:border-slate-700/60 shadow-inner text-slate-700 dark:text-zinc-300">
                  <Icon className="w-6 h-6" />
                </div>
                <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition text-slate-500 dark:text-zinc-300" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-cerulean-600 dark:group-hover:text-emerald-300 transition">
                  {card.title}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-slate-400 mt-1 leading-snug">
                  {card.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800/60 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 group-hover:text-cerulean-600 dark:group-hover:text-white">
                  {card.btnText}
                </span>
                <span className="w-2 h-2 rounded-full bg-cerulean-500 dark:bg-emerald-400 animate-ping" />
              </div>
            </div>
          );
        })}
      </section>

      {/* Counters Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {counters.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className="p-4 rounded-2xl glass-panel border border-zinc-200/50 dark:border-slate-800/80 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-cerulean-500/10 dark:bg-emerald-500/10 border border-cerulean-500/20 dark:border-emerald-500/30 text-cerulean-600 dark:text-emerald-400">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-zinc-500 dark:text-slate-400 font-medium">{c.label}</p>
                <h4 className="text-xl font-extrabold text-slate-800 dark:text-white mt-0.5 tracking-tight">{c.value}</h4>
                <span className="text-[10px] text-cerulean-600 dark:text-emerald-400 font-semibold">{c.change}</span>
              </div>
            </div>
          );
        })}
      </section>

      {/* Main Grid: Chart & Macro Stats */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Recharts IPM & PDRB Trend */}
        <div className="lg:col-span-2 p-6 rounded-2xl glass-panel border border-zinc-200/50 dark:border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cerulean-600 dark:text-emerald-400" />
                Tren Pembangunan & Indeks Pembangunan Manusia (IPM)
              </h3>
              <p className="text-xs text-zinc-500 dark:text-slate-400 mt-0.5">
                Perkembangan PDRB (Rp Triliun) & IPM Kabupaten Hulu Sungai Tengah 2020-2025
              </p>
            </div>
            <button 
              onClick={() => onNavigate('strategis')}
              className="text-xs text-cerulean-600 dark:text-emerald-400 hover:text-cerulean-500 font-semibold flex items-center gap-1"
            >
              Detail <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={apbdData.trenPdrb}>
                <defs>
                  <linearGradient id="colorIpm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPdrb" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#334155" : "#e2e8f0"} opacity={darkMode ? 0.5 : 0.8} />
                <XAxis dataKey="tahun" stroke={darkMode ? "#94a3b8" : "#64748b"} fontSize={11} />
                <YAxis stroke={darkMode ? "#94a3b8" : "#64748b"} fontSize={11} domain={[60, 80]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: darkMode ? '#0f172a' : '#f8fafc', 
                    borderColor: darkMode ? '#334155' : '#cbd5e1', 
                    borderRadius: '0.75rem', 
                    fontSize: '12px', 
                    color: darkMode ? '#fff' : '#1e293b' 
                  }}
                />
                <Area type="monotone" dataKey="ipm" name="IPM HST" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorIpm)" />
                <Area type="monotone" dataKey="pdrb" name="PDRB (Triliun)" stroke="#0d9488" strokeWidth={2} fillOpacity={1} fill="url(#colorPdrb)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-zinc-200 dark:border-slate-800/80 text-center">
            <div className="p-2 rounded-xl bg-zinc-50 dark:bg-slate-900/60 border border-zinc-100 dark:border-slate-800">
              <span className="text-[10px] text-zinc-500 dark:text-slate-400">Pertumbuhan Ekonomi</span>
              <p className="text-sm font-bold text-cerulean-600 dark:text-emerald-400">{macroStats.pertumbuhanEkonomi.value}</p>
            </div>
            <div className="p-2 rounded-xl bg-zinc-50 dark:bg-slate-900/60 border border-zinc-100 dark:border-slate-800">
              <span className="text-[10px] text-zinc-500 dark:text-slate-400">Kemiskinan</span>
              <p className="text-sm font-bold text-tealAcc-600 dark:text-teal-300">{macroStats.kemiskinan.value}</p>
            </div>
            <div className="p-2 rounded-xl bg-zinc-50 dark:bg-slate-900/60 border border-zinc-100 dark:border-slate-800">
              <span className="text-[10px] text-zinc-500 dark:text-slate-400">Inflasi HST</span>
              <p className="text-sm font-bold text-amber-600 dark:text-amber-400">{macroStats.inflasi.value}</p>
            </div>
          </div>

        </div>

        {/* Right Col: Cuaca BMKG & Activity Feed */}
        <div className="space-y-6">
          
          {/* BMKG Weather Card */}
          <div className="p-5 rounded-2xl glass-panel border border-zinc-200/50 dark:border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <CloudSun className="w-4 h-4 text-amber-500 dark:text-amber-400" /> Weather BMKG Barabai
              </h4>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-300 font-bold border border-amber-500/30">
                Update Realtime
              </span>
            </div>

            <div className="space-y-2">
              {bmkgWeatherData.slice(0, 3).map((w, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-zinc-50 dark:bg-slate-900/80 border border-zinc-200 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-zinc-800 dark:text-slate-200">{w.wilayah}</p>
                    <p className="text-[10px] text-zinc-500 dark:text-slate-400">{w.kondisi} • Kelembapan {w.kelembapan}</p>
                  </div>
                  <span className="text-sm font-extrabold text-amber-600 dark:text-amber-300">{w.suhu}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => onNavigate('cuaca')}
              className="w-full text-center text-xs text-cerulean-600 dark:text-emerald-400 hover:text-cerulean-500 font-medium py-1"
            >
              Lihat Cuaca 11 Kecamatan →
            </button>
          </div>

          {/* Activity Feed */}
          <div className="p-5 rounded-2xl glass-panel border border-zinc-200/50 dark:border-slate-800/80 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Pembaruan Data Terkini
            </h4>
            <div className="space-y-2.5">
              {recentActivities.map((act) => (
                <div key={act.id} className="text-xs space-y-0.5 border-b border-zinc-200 dark:border-slate-800/60 pb-2 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cerulean-600 dark:text-emerald-400">{act.opd}</span>
                    <span className="text-[10px] text-zinc-400 dark:text-slate-500">{act.waktu}</span>
                  </div>
                  <p className="text-zinc-600 dark:text-slate-300 text-[11px] leading-snug">{act.aksi}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </section>

    </div>
  );
}
