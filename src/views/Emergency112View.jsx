import React from 'react';
import { PhoneCall, ShieldAlert, HeartPulse, Flame, Droplets, Clock, Users, Activity } from 'lucide-react';
import { emergency112Stats } from '../data/mockData';

export default function Emergency112View() {
  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/30 uppercase tracking-wider">
            Layanan Darurat Bebas Pulsa 24 Jam
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-white mt-1 flex items-center gap-2">
            <PhoneCall className="w-6 h-6 text-rose-500 dark:text-rose-400 animate-pulse" /> Dashboard Layanan Tanggap Darurat 112 HST
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Pusat Komando Kesiapsiagaan Kebencanaan, Evakuasi Banjir, dan Medis Kabupaten Hulu Sungai Tengah
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-rose-500/10 dark:bg-rose-600/30 border border-rose-500/20 dark:border-rose-500/40 text-rose-600 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span>SIAGA 1 MERATUS & BARABAI</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Panggilan Masuk</span>
          <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white">{emergency112Stats.totalCalls.toLocaleString('id-ID')} Call</h3>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">100% Bebas Pulsa</span>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Rata-Rata Response Time</span>
          <h3 className="text-2xl font-extrabold text-emerald-650 dark:text-emerald-400">{emergency112Stats.avgResponseTime}</h3>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Koordinasi BPBD, Satpol PP & Dinkes</span>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Operator Call Center Aktif</span>
          <h3 className="text-2xl font-extrabold text-amber-650 dark:text-amber-400">{emergency112Stats.activeOperators} Personel</h3>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Shift 24/7 Siaga Barabai</span>
        </div>
      </div>

      {/* Incident Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {emergency112Stats.kategoriKejadian.map((item, idx) => (
          <div key={idx} className="p-5 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-slate-800 dark:text-white">{item.nama}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">{item.jumlah} Panggilan Laporan</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-emerald-600 dark:text-emerald-300">
              {item.status}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}
