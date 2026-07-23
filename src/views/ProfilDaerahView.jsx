import React from 'react';
import { MapPin, Users, Building, ShieldCheck, CheckCircle2, Trees } from 'lucide-react';
import { hstInfo } from '../data/mockData';

export default function ProfilDaerahView() {
  return (
    <div className="space-y-6 pb-12">
      <div className="p-6 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <img src={hstInfo.logoUrl} alt="Logo HST" className="w-12 h-14 object-contain" />
          <div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30">
              #HST_MURAKATA
            </span>
            <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white mt-1">Profil Kabupaten Hulu Sungai Tengah</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Ibu Kota: Barabai • Kalimantan Selatan</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400">Luas Wilayah</span>
            <h4 className="text-lg font-bold text-slate-800 dark:text-white mt-1">{hstInfo.luasWilayah}</h4>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Pegunungan Meratus & Dataran Rawa</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400">Jumlah Penduduk</span>
            <h4 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1">{hstInfo.jumlahPenduduk}</h4>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Suku Banjar & Dayak Meratus</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400">Pembagian Administrasi</span>
            <h4 className="text-lg font-bold text-amber-600 dark:text-amber-300 mt-1">{hstInfo.jumlahKecamatan} Kecamatan</h4>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{hstInfo.jumlahDesaKelurahan}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/30 text-xs space-y-2">
          <h4 className="font-bold text-emerald-700 dark:text-emerald-300">Visi Pembangunan Hulu Sungai Tengah</h4>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            "Mewujudkan Kabupaten Hulu Sungai Tengah yang Makmur, Unggul, Rapi, Aman, Keagamaan, Adaptif, dan Bermanfaat (MURAKATA) Berbasis Pengelolaan Lingkungan Meratus dan Pertanian Berkelanjutan."
          </p>
        </div>
      </div>
    </div>
  );
}
