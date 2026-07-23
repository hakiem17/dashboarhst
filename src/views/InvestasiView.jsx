import React from 'react';
import { Briefcase, MapPin, DollarSign, ExternalLink, Sparkles, Trees } from 'lucide-react';
import { potensiInvestasi } from '../data/mockData';

export default function InvestasiView() {
  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800">
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
          Peluang Investasi & Ekowisata Meratus
        </span>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-white mt-1 flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-emerald-650 dark:text-emerald-400" /> Galeri Investasi & Komoditas Unggulan HST
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Potensi Ekowisata Alam Pegunungan Meratus, Hilirisasi Pertanian, dan Kemudahan Perizinan OSS di Hulu Sungai Tengah
        </p>
      </div>

      {/* Investment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {potensiInvestasi.map((item) => (
          <div key={item.id} className="rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col justify-between group hover:border-emerald-500/50 transition">
            
            <div className="relative h-48 overflow-hidden bg-slate-900">
              <img 
                src={item.imageUrl} 
                alt={item.judul}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/600x400/0f172a/ffffff?text=Investasi+HST";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              <span className="absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600/90 text-white shadow">
                {item.kategori}
              </span>
            </div>

            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-base text-slate-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition leading-snug">
                  {item.judul}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-650 dark:text-emerald-400 shrink-0" /> {item.lokasi}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed bg-slate-100 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  {item.potensi}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Estimasi Investasi:</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">{item.estimasiNilai}</span>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
