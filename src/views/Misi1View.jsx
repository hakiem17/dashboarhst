import React, { useState } from 'react';
import {
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
  BarChart3,
  Users,
  Heart,
  GraduationCap,
  ShieldCheck,
  BookOpen,
  Home as HomeIcon,
  Palette,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { misi1DetailData } from '../data/mockData';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  AreaChart,
  ReferenceLine,
  Cell,
} from 'recharts';

// ===== ICON MAP for sasaran =====
const sasaranIcons = {
  s1: GraduationCap,
  s2: AlertTriangle,
  s3: Palette,
};

const sasaranColors = {
  s1: { bg: 'from-blue-600 to-cyan-600', border: 'border-blue-500/30', badge: 'bg-blue-500/20 text-blue-300', light: 'bg-blue-50 dark:bg-blue-950/30', accent: '#3b82f6' },
  s2: { bg: 'from-red-600 to-orange-600', border: 'border-red-500/30', badge: 'bg-red-500/20 text-red-300', light: 'bg-red-50 dark:bg-red-950/30', accent: '#ef4444' },
  s3: { bg: 'from-indigo-600 to-purple-600', border: 'border-indigo-500/30', badge: 'bg-indigo-500/20 text-indigo-300', light: 'bg-indigo-50 dark:bg-indigo-950/30', accent: '#6366f1' },
};

// Custom Tooltip
const CustomChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700/80 p-3 rounded-xl shadow-2xl text-xs space-y-1">
        <p className="font-extrabold text-white">Tahun {label}</p>
        {payload.map((p, i) => (
          <p key={i} className="font-semibold" style={{ color: p.color }}>
            {p.name}: <span className="text-white">{p.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Misi1View({ darkMode, onNavigate }) {
  const data = misi1DetailData;
  const [expandedSasaran, setExpandedSasaran] = useState({ s1: true, s2: true, s3: true });
  const [selectedChart, setSelectedChart] = useState(null);

  const toggleSasaran = (id) => {
    setExpandedSasaran((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Helper: calculate capaian % (achievement against 2025 target)
  const getCapaian = (ind) => {
    const target2025 = ind.target[0].nilai;
    if (target2025 === 0) return ind.realisasi === 0 ? 100 : 0;
    if (ind.arah === 'turun') {
      // For decreasing indicators: lower is better
      return Math.min(((target2025 / Math.max(ind.realisasi, 0.001)) * 100), 120).toFixed(1);
    }
    return Math.min(((ind.realisasi / target2025) * 100), 120).toFixed(1);
  };

  const getCapaianColor = (pct) => {
    const val = parseFloat(pct);
    if (val >= 95) return 'text-emerald-500';
    if (val >= 80) return 'text-amber-500';
    return 'text-red-500';
  };

  const getCapaianBg = (pct) => {
    const val = parseFloat(pct);
    if (val >= 95) return 'bg-emerald-500/10 border-emerald-500/30';
    if (val >= 80) return 'bg-amber-500/10 border-amber-500/30';
    return 'bg-red-500/10 border-red-500/30';
  };

  // All indicators flat
  const allIndicators = [
    ...data.indikatorUtama,
    ...data.sasaran.flatMap((s) => s.indikator),
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
            {data.misiNo} — Tujuan & Sasaran RPJMD
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            {data.deskripsi}
          </p>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
          <span className="cursor-pointer hover:text-emerald-500 transition" onClick={() => onNavigate && onNavigate('home')}>Dashboard</span>
          <ChevronRight className="w-3 h-3" />
          <span className="cursor-pointer hover:text-emerald-500 transition" onClick={() => onNavigate && onNavigate('misi-bupati')}>4 Misi Bupati</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-blue-600 dark:text-blue-400">Misi 1</span>
        </div>
      </div>

      {/* ===== TUJUAN PEMBANGUNAN HERO ===== */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-5 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5 -translate-y-10 translate-x-10" />
        <div className="absolute bottom-0 left-0 w-28 h-28 rounded-full bg-white/5 translate-y-8 -translate-x-8" />
        <div className="relative z-10">
          <span className="inline-block text-[9px] font-black px-2 py-0.5 rounded-full bg-white/20 mb-2 uppercase tracking-wider">
            Tujuan Pembangunan
          </span>
          <h3 className="text-base sm:text-lg font-extrabold leading-snug">
            {data.tujuan}
          </h3>
          <div className="mt-3 flex items-center gap-3 text-[10px]">
            <span className="flex items-center gap-1 bg-white/15 px-2 py-1 rounded-full">
              <Target className="w-3 h-3" /> {allIndicators.length} Indikator Kinerja
            </span>
            <span className="flex items-center gap-1 bg-white/15 px-2 py-1 rounded-full">
              <BarChart3 className="w-3 h-3" /> {data.sasaran.length} Sasaran Pembangunan
            </span>
            <span className="flex items-center gap-1 bg-white/15 px-2 py-1 rounded-full">
              <BookOpen className="w-3 h-3" /> Target RPJMD 2025–2030
            </span>
          </div>
        </div>
      </div>

      {/* ===== INDIKATOR UTAMA (IPM & Kemiskinan) ===== */}
      <div>
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <Target className="w-4 h-4 text-blue-500" />
          Indikator Ketercapaian Utama
          <span className="text-[9px] font-bold text-slate-400">(Tujuan Misi 1)</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.indikatorUtama.map((ind, idx) => {
            const capaian = getCapaian(ind);
            return (
              <div
                key={idx}
                className={`rounded-xl border ${getCapaianBg(capaian)} p-4 hover:shadow-lg transition-all`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">{ind.nama}</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Satuan: {ind.satuan}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-black ${getCapaianColor(capaian)}`}>
                      {capaian}%
                    </p>
                    <p className="text-[9px] text-slate-400">Capaian Target 2025</p>
                  </div>
                </div>

                {/* Quick Stats Row */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="bg-slate-100 dark:bg-slate-800/60 rounded-lg p-2 text-center">
                    <p className="text-[8px] text-slate-500 dark:text-slate-400">Realisasi</p>
                    <p className="text-sm font-extrabold text-slate-900 dark:text-white">{ind.realisasi}</p>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800/60 rounded-lg p-2 text-center">
                    <p className="text-[8px] text-slate-500 dark:text-slate-400">Target 2025</p>
                    <p className="text-sm font-extrabold" style={{ color: ind.color }}>{ind.target[0].nilai}</p>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800/60 rounded-lg p-2 text-center">
                    <p className="text-[8px] text-slate-500 dark:text-slate-400">Target 2030</p>
                    <p className="text-sm font-extrabold text-blue-600 dark:text-blue-400">{ind.target[5].nilai}</p>
                  </div>
                </div>

                {/* Area Chart */}
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={ind.target}>
                      <defs>
                        <linearGradient id={`grad-utama-${idx}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={ind.color} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={ind.color} stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1e293b' : '#e2e8f0'} />
                      <XAxis
                        dataKey="tahun"
                        tick={{ fontSize: 9, fill: darkMode ? '#94a3b8' : '#64748b' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 9, fill: darkMode ? '#94a3b8' : '#64748b' }}
                        axisLine={false}
                        tickLine={false}
                        domain={['auto', 'auto']}
                        width={35}
                      />
                      <Tooltip content={<CustomChartTooltip />} />
                      <ReferenceLine
                        y={ind.realisasi}
                        stroke="#f59e0b"
                        strokeDasharray="5 5"
                        strokeWidth={1.5}
                        label={{ value: `Realisasi: ${ind.realisasi}`, position: 'right', fontSize: 8, fill: '#f59e0b' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="nilai"
                        stroke={ind.color}
                        strokeWidth={2.5}
                        fill={`url(#grad-utama-${idx})`}
                        dot={{ r: 4, fill: ind.color, stroke: '#fff', strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                        name="Target RPJMD"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center gap-2 text-[8px] text-slate-400 mt-1 justify-center">
                  <span className="flex items-center gap-1"><span className="w-2 h-0.5 rounded" style={{ backgroundColor: ind.color }} /> Target RPJMD</span>
                  <span className="flex items-center gap-1"><span className="w-4 h-0 border-t border-dashed border-amber-500" /> Realisasi Terakhir</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== 3 SASARAN PEMBANGUNAN ===== */}
      {data.sasaran.map((sasaran) => {
        const Icon = sasaranIcons[sasaran.id] || Target;
        const colors = sasaranColors[sasaran.id];
        const isOpen = expandedSasaran[sasaran.id];

        return (
          <div key={sasaran.id} className={`rounded-xl border ${colors.border} overflow-hidden transition-all`}>
            {/* Sasaran Header */}
            <button
              onClick={() => toggleSasaran(sasaran.id)}
              className={`w-full bg-gradient-to-r ${colors.bg} px-4 py-3 flex items-center justify-between text-white hover:brightness-110 transition`}
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-white/15 rounded-lg">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-[9px] font-bold uppercase tracking-wider opacity-80">
                    Sasaran {sasaran.id.replace('s', '')}
                  </p>
                  <p className="text-xs font-extrabold leading-tight">{sasaran.judul}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold bg-white/15 px-2 py-0.5 rounded-full">
                  {sasaran.indikator.length} Indikator
                </span>
                {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {/* Sasaran Content */}
            {isOpen && (
              <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50">
                <div className={`grid grid-cols-1 ${sasaran.indikator.length > 3 ? 'md:grid-cols-3' : `md:grid-cols-${sasaran.indikator.length}`} gap-3`}>
                  {sasaran.indikator.map((ind, idx) => {
                    const capaian = getCapaian(ind);
                    const isGood = parseFloat(capaian) >= 95;
                    const isMid = parseFloat(capaian) >= 80 && parseFloat(capaian) < 95;

                    return (
                      <div
                        key={idx}
                        className={`rounded-xl border bg-white dark:bg-slate-900 p-3 hover:shadow-md transition-all cursor-pointer ${
                          isGood ? 'border-emerald-200 dark:border-emerald-800/40' : isMid ? 'border-amber-200 dark:border-amber-800/40' : 'border-red-200 dark:border-red-800/40'
                        }`}
                        onClick={() => setSelectedChart(selectedChart === `${sasaran.id}-${idx}` ? null : `${sasaran.id}-${idx}`)}
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-2">
                          <h5 className="text-[10px] font-extrabold text-slate-900 dark:text-white leading-tight flex-1 pr-2">
                            {ind.nama}
                          </h5>
                          <div className={`flex items-center gap-0.5 text-[9px] font-bold ${getCapaianColor(capaian)}`}>
                            {ind.arah === 'naik' && <ArrowUpRight className="w-3 h-3" />}
                            {ind.arah === 'turun' && <ArrowDownRight className="w-3 h-3" />}
                            {ind.arah === 'stabil' && <CheckCircle2 className="w-3 h-3" />}
                            {capaian}%
                          </div>
                        </div>

                        {/* Quick KPI */}
                        <div className="flex items-center gap-2 text-[9px] mb-2">
                          <div className="flex-1 text-center p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                            <p className="text-[7px] text-slate-400">Realisasi</p>
                            <p className="font-extrabold text-slate-900 dark:text-white">{ind.realisasi}</p>
                          </div>
                          <div className="flex-1 text-center p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                            <p className="text-[7px] text-slate-400">2025</p>
                            <p className="font-extrabold" style={{ color: ind.color }}>{ind.target[0].nilai}</p>
                          </div>
                          <div className="flex-1 text-center p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                            <p className="text-[7px] text-slate-400">2030</p>
                            <p className="font-extrabold text-blue-600 dark:text-blue-400">{ind.target[5].nilai}</p>
                          </div>
                        </div>

                        {/* Mini Chart */}
                        <div className="h-20">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={ind.target}>
                              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1e293b' : '#f1f5f9'} />
                              <XAxis dataKey="tahun" tick={{ fontSize: 7, fill: darkMode ? '#64748b' : '#94a3b8' }} axisLine={false} tickLine={false} />
                              <YAxis hide domain={['auto', 'auto']} />
                              <Tooltip content={<CustomChartTooltip />} />
                              {ind.realisasi > 0 && (
                                <ReferenceLine
                                  y={ind.realisasi}
                                  stroke="#f59e0b"
                                  strokeDasharray="4 4"
                                  strokeWidth={1}
                                />
                              )}
                              <Line
                                type="monotone"
                                dataKey="nilai"
                                stroke={ind.color}
                                strokeWidth={2}
                                dot={{ r: 2.5, fill: ind.color, stroke: '#fff', strokeWidth: 1 }}
                                name="Target"
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>

                        {/* Expanded Chart Modal */}
                        {selectedChart === `${sasaran.id}-${idx}` && (
                          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                            <div className="h-44">
                              <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={ind.target}>
                                  <defs>
                                    <linearGradient id={`grad-${sasaran.id}-${idx}`} x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor={ind.color} stopOpacity={0.3} />
                                      <stop offset="95%" stopColor={ind.color} stopOpacity={0.02} />
                                    </linearGradient>
                                  </defs>
                                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1e293b' : '#e2e8f0'} />
                                  <XAxis dataKey="tahun" tick={{ fontSize: 9, fill: darkMode ? '#94a3b8' : '#64748b' }} axisLine={false} tickLine={false} />
                                  <YAxis tick={{ fontSize: 9, fill: darkMode ? '#94a3b8' : '#64748b' }} axisLine={false} tickLine={false} domain={['auto', 'auto']} width={40} />
                                  <Tooltip content={<CustomChartTooltip />} />
                                  <ReferenceLine y={ind.realisasi} stroke="#f59e0b" strokeDasharray="5 5" strokeWidth={1.5} />
                                  <Area type="monotone" dataKey="nilai" stroke={ind.color} strokeWidth={2.5} fill={`url(#grad-${sasaran.id}-${idx})`} dot={{ r: 4, fill: ind.color, stroke: '#fff', strokeWidth: 2 }} name="Target RPJMD" />
                                </AreaChart>
                              </ResponsiveContainer>
                            </div>
                            {/* Full data table */}
                            <table className="w-full text-[9px] mt-2 border-collapse">
                              <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                                  <th className="text-left py-1 font-semibold">Tahun</th>
                                  {ind.target.map((t) => (
                                    <th key={t.tahun} className="text-center py-1 font-semibold">{t.tahun}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="text-slate-900 dark:text-white font-bold">
                                  <td className="py-1">Target</td>
                                  {ind.target.map((t) => (
                                    <td key={t.tahun} className="text-center py-1">{t.nilai}</td>
                                  ))}
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        )}

                        <p className="text-[7px] text-slate-400 text-center mt-1">
                          {selectedChart === `${sasaran.id}-${idx}` ? 'Klik untuk tutup detail' : 'Klik untuk buka detail'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* ===== TABEL RINGKASAN LENGKAP ===== */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="bg-slate-900 dark:bg-slate-950 px-4 py-3 flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-400" />
            Tabel Target RPJMD 2025–2030 — Misi 1
          </h3>
          <span className="text-[9px] font-bold text-slate-400">
            {allIndicators.length} Indikator
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[10px]">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 text-left">
                <th className="px-3 py-2 font-bold sticky left-0 bg-slate-100 dark:bg-slate-800/80">No</th>
                <th className="px-3 py-2 font-bold sticky left-8 bg-slate-100 dark:bg-slate-800/80 min-w-[200px]">Indikator</th>
                <th className="px-3 py-2 font-bold text-center">Satuan</th>
                <th className="px-3 py-2 font-bold text-center">Realisasi</th>
                <th className="px-3 py-2 font-bold text-center bg-blue-50 dark:bg-blue-950/30">2025</th>
                <th className="px-3 py-2 font-bold text-center">2026</th>
                <th className="px-3 py-2 font-bold text-center">2027</th>
                <th className="px-3 py-2 font-bold text-center">2028</th>
                <th className="px-3 py-2 font-bold text-center">2029</th>
                <th className="px-3 py-2 font-bold text-center bg-emerald-50 dark:bg-emerald-950/30">2030</th>
                <th className="px-3 py-2 font-bold text-center">Capaian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {/* Indikator Utama */}
              <tr className="bg-blue-50/50 dark:bg-blue-950/20">
                <td colSpan={11} className="px-3 py-1.5 text-[9px] font-black text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                  📌 Indikator Tujuan Utama
                </td>
              </tr>
              {data.indikatorUtama.map((ind, idx) => {
                const capaian = getCapaian(ind);
                return (
                  <tr key={`u-${idx}`} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition">
                    <td className="px-3 py-2 font-bold text-slate-400">{idx + 1}</td>
                    <td className="px-3 py-2 font-bold text-slate-900 dark:text-white">{ind.nama}</td>
                    <td className="px-3 py-2 text-center text-slate-500">{ind.satuan}</td>
                    <td className="px-3 py-2 text-center font-extrabold text-amber-600 dark:text-amber-400">{ind.realisasi}</td>
                    {ind.target.map((t, tidx) => (
                      <td
                        key={t.tahun}
                        className={`px-3 py-2 text-center font-bold ${
                          tidx === 0 ? 'bg-blue-50/50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300' :
                          tidx === 5 ? 'bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300' :
                          'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {t.nilai}
                      </td>
                    ))}
                    <td className={`px-3 py-2 text-center font-extrabold ${getCapaianColor(capaian)}`}>{capaian}%</td>
                  </tr>
                );
              })}

              {/* Per Sasaran */}
              {data.sasaran.map((sasaran, sIdx) => (
                <React.Fragment key={sasaran.id}>
                  <tr className={`${sasaranColors[sasaran.id].light}`}>
                    <td colSpan={11} className="px-3 py-1.5 text-[9px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      🎯 Sasaran {sIdx + 1}: {sasaran.judul}
                    </td>
                  </tr>
                  {sasaran.indikator.map((ind, idx) => {
                    const capaian = getCapaian(ind);
                    const globalIdx = data.indikatorUtama.length + data.sasaran.slice(0, sIdx).reduce((sum, s) => sum + s.indikator.length, 0) + idx + 1;
                    return (
                      <tr key={`s-${sIdx}-${idx}`} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition">
                        <td className="px-3 py-2 font-bold text-slate-400">{globalIdx}</td>
                        <td className="px-3 py-2 font-semibold text-slate-800 dark:text-slate-200">{ind.nama}</td>
                        <td className="px-3 py-2 text-center text-slate-500">{ind.satuan}</td>
                        <td className="px-3 py-2 text-center font-extrabold text-amber-600 dark:text-amber-400">{ind.realisasi}</td>
                        {ind.target.map((t, tidx) => (
                          <td
                            key={t.tahun}
                            className={`px-3 py-2 text-center font-bold ${
                              tidx === 0 ? 'bg-blue-50/50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300' :
                              tidx === 5 ? 'bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300' :
                              'text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {t.nilai}
                          </td>
                        ))}
                        <td className={`px-3 py-2 text-center font-extrabold ${getCapaianColor(capaian)}`}>{capaian}%</td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Source */}
      <div className="text-center text-[9px] text-slate-400 dark:text-slate-500 py-2">
        Sumber Data: RPJMD Kabupaten Hulu Sungai Tengah 2025–2030 · Diskominfo SP HST
      </div>
    </div>
  );
}
