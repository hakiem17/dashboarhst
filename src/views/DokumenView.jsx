import React from 'react';
import { FileText, Download, Eye, BookOpen } from 'lucide-react';

export default function DokumenView() {
  const docs = [
    { judul: "Rencana Pembangunan Jangka Menengah Daerah (RPJMD) HST 2021-2026", tipe: "Dokumen Perencanaan", uk: "12.4 MB", tgl: "15 Jan 2026" },
    { judul: "Kabupaten Hulu Sungai Tengah Dalam Angka 2026 (BPS HST)", tipe: "Publikasi BPS", uk: "18.2 MB", tgl: "10 Feb 2026" },
    { judul: "Laporan Kinerja Instansi Pemerintah (LKjIP) Pemkab HST 2025", tipe: "Laporan Akuntabilitas", uk: "8.5 MB", tgl: "22 Mar 2026" },
    { judul: "Buku Saku Indikator Makro Sosial Ekonomi HST 2025", tipe: "Buku Saku Data", uk: "4.1 MB", tgl: "05 Apr 2026" }
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="p-6 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-4">
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30">
          Pusat Unduhan & Riset
        </span>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-emerald-650 dark:text-emerald-400" /> Dokumen Publikasi & Perencanaan HST
        </h2>

        <div className="space-y-3">
          {docs.map((doc, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs shadow-sm">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-white leading-snug">{doc.judul}</h4>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">{doc.tipe} • {doc.uk} • Upload: {doc.tgl}</span>
                </div>
              </div>
              <button 
                onClick={() => alert(`Mengunduh ${doc.judul}...`)}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shrink-0"
              >
                <Download className="w-3.5 h-3.5" /> Unduh PDF
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
