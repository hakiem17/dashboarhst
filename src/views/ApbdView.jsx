import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { apbdData } from '../data/mockData';
import { ChevronRight, ExternalLink } from 'lucide-react';

export default function ApbdView({ activeSubView }) {
  
  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR', 
      maximumFractionDigits: 0 
    }).format(val);
  };

  // Color matching function for progress bars based on percentage
  const getProgressColor = (percent) => {
    if (percent < 25) return 'bg-rose-500';
    if (percent >= 25 && percent < 50) return 'bg-amber-600';
    if (percent >= 50 && percent < 75) return 'bg-blue-600';
    if (percent >= 75 && percent <= 100) return 'bg-emerald-600';
    return 'bg-purple-600';
  };

  const getProgressTextColor = (percent) => {
    if (percent < 25) return 'text-rose-500 dark:text-rose-400';
    if (percent >= 25 && percent < 50) return 'text-amber-600 dark:text-amber-400';
    if (percent >= 50 && percent < 75) return 'text-blue-500 dark:text-blue-400';
    if (percent >= 75 && percent <= 100) return 'text-emerald-500 dark:text-emerald-400';
    return 'text-purple-500 dark:text-purple-400';
  };

  // Recharts Chart Colors & Data Definitions
  const COLORS_APBD = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];
  const dataApbdSummary = [
    { name: 'Pembiayaan', value: 0.87 },
    { name: 'Belanja', value: 50.00 },
    { name: 'Pendapatan', value: 49.13 },
    { name: 'Silpa', value: 0.00 }
  ];

  const COLORS_PENDAPATAN = ['#06b6d4', '#3b82f6', '#10b981'];
  const dataPendapatanSummary = [
    { name: 'Pendapatan Asli Daerah', value: 6.87 },
    { name: 'Pendapatan Transfer', value: 93.13 },
    { name: 'Lain-lain Pendapatan yang Sah', value: 0.00 }
  ];

  const dataDetailPendapatan = [
    { name: 'PAD', value: 6.87 },
    { name: 'Dana Transfer', value: 86.37 },
    { name: 'Lain-lain', value: 6.76 }
  ];

  const dataDetailBelanja = [
    { name: 'Belanja Operasi', value: 45.10 },
    { name: 'Belanja Modal', value: 24.01 },
    { name: 'Belanja Tak Terduga', value: 0.78 },
    { name: 'Belanja Transfer', value: 30.11 }
  ];

  return (
    <div className="space-y-6 pb-12">

      {/* Top Breadcrumb & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 font-sans tracking-tight">
            {activeSubView === 'apbd-ringkasan' && "Ringkasan APBD"}
            {activeSubView === 'apbd-belanja' && "Realisasi Belanja"}
            {activeSubView === 'apbd-pendapatan' && "Realisasi Pendapatan"}
          </h2>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-zinc-500 dark:text-zinc-400 font-semibold">
          <span>Dashboard</span>
          <ChevronRight className="w-3 h-3" />
          <span>APBD Tahun Berjalan</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-emerald-600 dark:text-emerald-400">
            {activeSubView === 'apbd-ringkasan' && "Ringkasan APBD"}
            {activeSubView === 'apbd-belanja' && "Realisasi Belanja OPD"}
            {activeSubView === 'apbd-pendapatan' && "Realisasi Pendapatan OPD"}
          </span>
        </div>
      </div>

      {/* 1. VIEW: RINGKASAN APBD */}
      {activeSubView === 'apbd-ringkasan' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl glass-panel border border-slate-800/20 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <span className="text-slate-600 dark:text-slate-300 font-bold">Pilih Tahun Anggaran</span>
            <select className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white font-semibold focus:outline-none">
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
          </div>

          {/* First Row of Doughnuts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Doughnut 1: Ringkasan APBD */}
            <div className="p-6 rounded-2xl glass-panel border border-slate-800/20 dark:border-slate-800 space-y-4">
              <h3 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Ringkasan APBD Tahun 2026</h3>
              <div className="h-60 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dataApbdSummary}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ value }) => `${value.toFixed(2).replace('.', ',')} %`}
                    >
                      {dataApbdSummary.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={COLORS_APBD[idx]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 pt-2 border-t border-slate-800/20 dark:border-slate-800">
                Sumber : SIPOLA - BPKPD Kabupaten Hulu Sungai Tengah
              </p>
            </div>

            {/* Doughnut 2: Ringkasan Pendapatan */}
            <div className="p-6 rounded-2xl glass-panel border border-slate-800/20 dark:border-slate-800 space-y-4">
              <h3 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Ringkasan Pendapatan Tahun 2026</h3>
              <div className="h-60 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dataPendapatanSummary}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ value }) => `${value.toFixed(2).replace('.', ',')} %`}
                    >
                      {dataPendapatanSummary.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={COLORS_PENDAPATAN[idx]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 pt-2 border-t border-slate-800/20 dark:border-slate-800">
                Sumber : SIPOLA - BPKPD Kabupaten Hulu Sungai Tengah
              </p>
            </div>

          </div>

          {/* Second Row of Doughnuts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Doughnut 3: Detail Pendapatan */}
            <div className="p-6 rounded-2xl glass-panel border border-slate-800/20 dark:border-slate-800 space-y-4">
              <h3 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Detail Ringkasan Pendapatan Tahun 2026</h3>
              <div className="h-60 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dataDetailPendapatan}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ value }) => `${value.toFixed(2).replace('.', ',')} %`}
                    >
                      {dataDetailPendapatan.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={COLORS_PENDAPATAN[idx]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Doughnut 4: Detail Belanja */}
            <div className="p-6 rounded-2xl glass-panel border border-slate-800/20 dark:border-slate-800 space-y-4">
              <h3 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Detail Ringkasan Belanja Tahun 2026</h3>
              <div className="h-60 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dataDetailBelanja}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ value }) => `${value.toFixed(2).replace('.', ',')} %`}
                    >
                      {dataDetailBelanja.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={COLORS_APBD[idx]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 2. VIEW: REALISASI BELANJA OPD */}
      {activeSubView === 'apbd-belanja' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl glass-panel border border-slate-800/20 dark:border-slate-800 space-y-4">
            
            {/* Source Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/20 dark:border-slate-800/80 pb-3">
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                Sumber : SIPOLA HST — 
                <a 
                  href="https://bpkpd.hulusungaitengahkab.go.id/#/" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5"
                >
                  https://bpkpd.hulusungaitengahkab.go.id/#/ <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </span>

              {/* Year Select */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-600 dark:text-slate-300 font-bold">Pilih Tahun Anggaran</span>
                <select className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white font-semibold">
                  <option value="2026">2026</option>
                </select>
              </div>
            </div>

            {/* Color Legend bar */}
            <div className="text-[10px] flex flex-wrap items-center gap-3 pt-1">
              <span className="font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Keterangan Warna Grafik :</span>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1.5 rounded-full bg-rose-500" />
                <span className="text-zinc-700 dark:text-zinc-300">Realisasi Dibawah 25%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1.5 rounded-full bg-amber-500" />
                <span className="text-zinc-700 dark:text-zinc-300">Realisasi 25% - 50%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1.5 rounded-full bg-blue-500" />
                <span className="text-zinc-700 dark:text-zinc-300">Realisasi 50% - 75%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-zinc-700 dark:text-zinc-300">Realisasi 75% - 100%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1.5 rounded-full bg-purple-500" />
                <span className="text-zinc-700 dark:text-zinc-300">Diatas 100%</span>
              </div>
            </div>

            {/* Overall Total Progress Bar */}
            <div className="pt-4 space-y-2 border-t border-slate-800/20 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-extrabold">
                <span className="text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  TOTAL SERAPAN ANGGARAN OPD = {apbdData.persentaseRealisasiBelanja}%
                </span>
                <span className="text-zinc-700 dark:text-zinc-300 font-mono">
                  Realisasi / Pagu = {formatRupiah(apbdData.totalRealisasiBelanja)} / {formatRupiah(apbdData.totalPaguBelanja)}
                </span>
              </div>
              <div className="w-full h-7 bg-slate-200/60 dark:bg-slate-900 rounded-lg overflow-hidden border border-slate-300/80 dark:border-slate-800 p-0.5">
                <div 
                  className={`h-full rounded ${getProgressColor(apbdData.persentaseRealisasiBelanja)} flex items-center justify-center`}
                  style={{ width: `${apbdData.persentaseRealisasiBelanja}%` }}
                >
                  <span className="text-[10px] font-extrabold text-white">
                    {apbdData.persentaseRealisasiBelanja}%
                  </span>
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="pt-6">
              <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100">Realisasi Belanja per OPD (Tahun 2026)</h3>
            </div>

            {/* Progress Bars for all listed OPDs */}
            <div className="space-y-5 pt-2">
              {apbdData.belanjaOpd.map((opd, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-bold">
                    <span className="text-zinc-800 dark:text-zinc-200">
                      {opd.no}. {opd.nama} — <span className={`${getProgressTextColor(opd.persen)}`}>{opd.persen}%</span>
                    </span>
                    <span className="text-zinc-500 dark:text-zinc-400 font-mono text-[11px] font-normal">
                      Realisasi / Pagu = {formatRupiah(opd.realisasi)} / {formatRupiah(opd.pagu)}
                    </span>
                  </div>
                  <div className="w-full h-5 bg-slate-200/60 dark:bg-slate-900 rounded border border-slate-300/80 dark:border-slate-800 p-0.5">
                    <div 
                      className={`h-full rounded-sm ${getProgressColor(opd.persen)} flex items-center justify-center`}
                      style={{ width: `${opd.persen}%` }}
                    >
                      <span className="text-[9px] font-extrabold text-white">
                        {opd.persen}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* 3. VIEW: REALISASI PENDAPATAN OPD */}
      {activeSubView === 'apbd-pendapatan' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl glass-panel border border-slate-800/20 dark:border-slate-800 space-y-4">
            
            {/* Source Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/20 dark:border-slate-800/80 pb-3">
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                Sumber : SIPOLA HST — 
                <a 
                  href="https://bpkpd.hulusungaitengahkab.go.id/#/" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5"
                >
                  https://bpkpd.hulusungaitengahkab.go.id/#/ <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </span>

              {/* Year Select */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-zinc-700 dark:text-zinc-300 font-bold">Pilih Tahun Anggaran</span>
                <select className="px-2 py-1 bg-white dark:bg-slate-900 border border-zinc-300 dark:border-slate-700 rounded-lg text-zinc-900 dark:text-white font-semibold">
                  <option value="2026">2026</option>
                </select>
              </div>
            </div>

            {/* Color Legend bar */}
            <div className="text-[10px] flex flex-wrap items-center gap-3 pt-1">
              <span className="font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Keterangan Warna Grafik :</span>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1.5 rounded-full bg-rose-500" />
                <span className="text-zinc-700 dark:text-zinc-300">Realisasi Dibawah 25%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1.5 rounded-full bg-amber-500" />
                <span className="text-zinc-700 dark:text-zinc-300">Realisasi 25% - 50%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1.5 rounded-full bg-blue-500" />
                <span className="text-zinc-700 dark:text-zinc-300">Realisasi 50% - 75%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-zinc-700 dark:text-zinc-300">Realisasi 75% - 100%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1.5 rounded-full bg-purple-500" />
                <span className="text-zinc-700 dark:text-zinc-300">Diatas 100%</span>
              </div>
            </div>

            {/* Overall Total Progress Bar */}
            <div className="pt-4 space-y-2 border-t border-slate-800/20 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-extrabold">
                <span className="text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  REALISASI TOTAL PAD = {apbdData.persentaseRealisasiPendapatan}%
                </span>
                <span className="text-zinc-700 dark:text-zinc-300 font-mono">
                  Realisasi / Pagu = {formatRupiah(apbdData.totalRealisasiPendapatan)} / {formatRupiah(apbdData.totalPaguPendapatan)}
                </span>
              </div>
              <div className="w-full h-7 bg-slate-200/60 dark:bg-slate-900 rounded-lg overflow-hidden border border-slate-300/80 dark:border-slate-800 p-0.5">
                <div 
                  className={`h-full rounded ${getProgressColor(apbdData.persentaseRealisasiPendapatan)} flex items-center justify-center`}
                  style={{ width: `${apbdData.persentaseRealisasiPendapatan}%` }}
                >
                  <span className="text-[10px] font-extrabold text-white">
                    {apbdData.persentaseRealisasiPendapatan}%
                  </span>
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="pt-6">
              <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100">Realisasi Pendapatan per OPD (Tahun 2026)</h3>
            </div>

            {/* Progress Bars for all listed Revenue OPDs */}
            <div className="space-y-5 pt-2">
              {apbdData.pendapatanOpd.map((opd, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-bold">
                    <span className="text-zinc-800 dark:text-zinc-200">
                      {opd.nama} — <span className={`${getProgressTextColor(opd.persen)}`}>{opd.persen}%</span>
                    </span>
                    <span className="text-zinc-500 dark:text-zinc-400 font-mono text-[11px] font-normal">
                      Realisasi / Pagu = {formatRupiah(opd.realisasi)} / {formatRupiah(opd.pagu)}
                    </span>
                  </div>
                  <div className="w-full h-5 bg-slate-200/60 dark:bg-slate-900 rounded border border-slate-300/80 dark:border-slate-800 p-0.5">
                    <div 
                      className={`h-full rounded-sm ${getProgressColor(opd.persen)} flex items-center justify-center`}
                      style={{ width: `${opd.persen}%` }}
                    >
                      <span className="text-[9px] font-extrabold text-white">
                        {opd.persen}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
