import React, { useState } from 'react';
import { Layers, Building2, CheckCircle2, Search, Filter } from 'lucide-react';
import { hstOpds } from '../data/mockData';

export default function SektoralView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('Semua');

  // Add mock dataset counts to make the list look realistic
  const opdListWithCounts = hstOpds.map((opd, idx) => {
    // Generate realistic dataset counts
    let count = 45 + (idx * 7) % 180;
    if (opd.nama.includes("Pertanian") || opd.nama.includes("Kesehatan") || opd.nama.includes("Pendidikan")) {
      count = 250 + (idx * 12) % 100;
    }
    return {
      ...opd,
      datasetCount: count,
      status: opd.id === "OPD-06" || opd.id === "OPD-18" ? "Walidata" : "Produsen Data"
    };
  });

  const filteredOpds = opdListWithCounts.filter(opd => {
    const matchSearch = opd.nama.toLowerCase().includes(searchQuery.toLowerCase());
    const matchGroup = selectedGroup === 'Semua' || opd.kelompok === selectedGroup;
    return matchSearch && matchGroup;
  });

  const groups = ['Semua', 'Dinas', 'Badan', 'Sekretariat', 'Kecamatan'];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-2">
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
          Produsen Data Sektoral
        </span>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
          <Layers className="w-6 h-6 text-emerald-600 dark:text-emerald-400" /> Perangkat Daerah (PD) Kabupaten Hulu Sungai Tengah
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Daftar resmi {hstOpds.length} instansi produsen data yang terintegrasi dengan portal Satu Data HST
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari dinas, badan, kecamatan..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Group Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {groups.map((group) => (
            <button
              key={group}
              onClick={() => setSelectedGroup(group)}
              className={`
                px-3 py-1.5 rounded-lg text-xs font-semibold transition
                ${selectedGroup === group 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'bg-white dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800'}
              `}
            >
              {group}
            </button>
          ))}
        </div>

      </div>

      {/* OPD Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredOpds.map((opd, i) => (
          <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs hover:border-emerald-500/30 transition shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white">{opd.nama}</h4>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">{opd.datasetCount} Dataset Terdaftar</span>
              </div>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
              opd.status === 'Walidata' 
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/30'
                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/30'
            }`}>
              {opd.status}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}
