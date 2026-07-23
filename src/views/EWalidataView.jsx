import React, { useState } from 'react';
import { 
  Database, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  FileEdit, 
  Download, 
  Eye, 
  PlusCircle, 
  Building2, 
  Calendar,
  FileSpreadsheet,
  ShieldCheck,
  X
} from 'lucide-react';
import { eWalidataDatasets } from '../data/mockData';

export default function EWalidataView() {
  const [datasets, setDatasets] = useState(eWalidataDatasets);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Semua');
  const [previewDataset, setPreviewDataset] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // New dataset form state
  const [newDatasetName, setNewDatasetName] = useState('');
  const [newOpd, setNewOpd] = useState('Dinas Pertanian HST');
  const [newKategori, setNewKategori] = useState('Pertanian & Pangan');

  const filteredDatasets = datasets.filter(d => {
    const matchQuery = d.namaDataset.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       d.opd.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       d.kategori.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = selectedStatus === 'Semua' || d.status === selectedStatus;
    return matchQuery && matchStatus;
  });

  const handleCreateDataset = (e) => {
    e.preventDefault();
    if (!newDatasetName) return;

    const newEntry = {
      id: `DS-HST-00${datasets.length + 1}`,
      namaDataset: newDatasetName,
      opd: newOpd,
      kategori: newKategori,
      tahun: "2026",
      format: "XLSX, CSV",
      status: "Draft OPD",
      tanggalUpdate: "Hari ini",
      walidata: "Diskominfo HST",
      downloadCount: 0
    };

    setDatasets([newEntry, ...datasets]);
    setNewDatasetName('');
    setShowUploadModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
            Sistem Informasi Pembangunan Daerah (SIPD)
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-white mt-1 flex items-center gap-2">
            <Database className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            eWalidata & Verifikasi Data Sektoral HST
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Portal pengelolaan, pemeriksaan, dan verifikasi validitas data sektoral OPD Kabupaten Hulu Sungai Tengah
          </p>
        </div>

        <button 
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/60 transition flex items-center gap-2 self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" /> Unggah Dataset Baru
        </button>
      </div>

      {/* Stats Cards Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] text-slate-550 dark:text-slate-400">Total Dataset Terdaftar</span>
          <h4 className="text-xl font-extrabold text-slate-800 dark:text-white mt-1">1.842 Dataset</h4>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">34 Produsen Data OPD</span>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] text-slate-550 dark:text-slate-400">Terverifikasi Walidata</span>
          <h4 className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">1.620 (87.9%)</h4>
          <span className="text-[10px] text-slate-550 dark:text-slate-400">Siap Dipublikasikan</span>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] text-slate-550 dark:text-slate-400">Dalam Pemeriksaan</span>
          <h4 className="text-xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">154 (8.4%)</h4>
          <span className="text-[10px] text-slate-550 dark:text-slate-400 font-medium">Review Bappeda/Diskominfo</span>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] text-slate-550 dark:text-slate-400">Draft / Revisi OPD</span>
          <h4 className="text-xl font-extrabold text-indigo-600 dark:text-indigo-300 mt-1">68 (3.7%)</h4>
          <span className="text-[10px] text-slate-550 dark:text-slate-400 font-medium">Menunggu Upload Ulang</span>
        </div>
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
            placeholder="Cari dataset, kata kunci, atau OPD..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {['Semua', 'Terverifikasi', 'Diperiksa Walidata', 'Draft OPD'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`
                px-3 py-1.5 rounded-lg text-xs font-semibold transition
                ${selectedStatus === status 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'bg-white dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800'}
              `}
            >
              {status}
            </button>
          ))}
        </div>

      </div>

      {/* Dataset Table */}
      <div className="rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-900/90 text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <th className="py-3.5 px-4">ID & Nama Dataset</th>
                <th className="py-3.5 px-4">Produsen Data (OPD)</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Format & Tahun</th>
                <th className="py-3.5 px-4">Status Verifikasi</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80 text-xs">
              {filteredDatasets.map((dataset) => (
                <tr key={dataset.id} className="hover:bg-slate-55/50 dark:hover:bg-slate-900/50 transition border-b border-slate-100 dark:border-slate-800/40">
                  
                  {/* ID & Title */}
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-mono text-emerald-650 dark:text-emerald-400 font-bold block">{dataset.id}</span>
                    <span className="font-bold text-slate-800 dark:text-white leading-snug">{dataset.namaDataset}</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Updated: {dataset.tanggalUpdate}</span>
                  </td>

                  {/* OPD */}
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" /> {dataset.opd}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Walidata: {dataset.walidata}</span>
                  </td>

                  {/* Kategori */}
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-300 font-medium text-[11px] border border-slate-200 dark:border-slate-700">
                      {dataset.kategori}
                    </span>
                  </td>

                  {/* Format & Tahun */}
                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                    <span className="font-mono text-emerald-600 dark:text-emerald-300">{dataset.format}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Tahun {dataset.tahun}</span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4">
                    {dataset.status === 'Terverifikasi' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 dark:text-emerald-400" /> Terverifikasi
                      </span>
                    )}
                    {dataset.status === 'Diperiksa Walidata' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30 text-[11px] font-bold">
                        <Clock className="w-3 h-3 text-amber-500 dark:text-amber-400" /> Diperiksa
                      </span>
                    )}
                    {dataset.status === 'Draft OPD' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border border-indigo-500/30 text-[11px] font-bold">
                        <FileEdit className="w-3 h-3 text-indigo-500 dark:text-indigo-400" /> Draft OPD
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setPreviewDataset(dataset)}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                        title="Lihat Pratinjau"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => alert(`Mengunduh ${dataset.namaDataset} (Format ${dataset.format})...`)}
                        className="p-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 transition"
                        title="Unduh Dataset"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dataset Preview Modal */}
      {previewDataset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">{previewDataset.id}</span>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mt-0.5 leading-snug">{previewDataset.namaDataset}</h3>
              </div>
              <button onClick={() => setPreviewDataset(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1">
                <p className="text-slate-500 dark:text-slate-400">Produsen Data: <strong className="text-slate-800 dark:text-slate-200">{previewDataset.opd}</strong></p>
                <p className="text-slate-500 dark:text-slate-400">Walidata Penanggung Jawab: <strong className="text-slate-800 dark:text-slate-200">{previewDataset.walidata}</strong></p>
                <p className="text-slate-500 dark:text-slate-400">Kategori & Tahun: <strong className="text-emerald-600 dark:text-emerald-300">{previewDataset.kategori} ({previewDataset.tahun})</strong></p>
                <p className="text-slate-500 dark:text-slate-400">Format File: <strong className="text-cerulean-600 dark:text-amber-300">{previewDataset.format}</strong></p>
                <p className="text-slate-500 dark:text-slate-400">Total Pengunduhan: <strong className="text-slate-800 dark:text-slate-200">{previewDataset.downloadCount} kali</strong></p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 flex items-center justify-between">
                <span>Status Verifikasi Walidata:</span>
                <span className="font-extrabold">{previewDataset.status}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button 
                onClick={() => setPreviewDataset(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Tutup
              </button>
              <button 
                onClick={() => {
                  alert(`File ${previewDataset.namaDataset} berhasil diunduh!`);
                  setPreviewDataset(null);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Unduh Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Dataset Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <form onSubmit={handleCreateDataset} className="w-full max-w-md glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Unggah Dataset SIPD HST
              </h3>
              <button type="button" onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-650 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Nama Dataset Sektoral</label>
                <input 
                  type="text"
                  required
                  value={newDatasetName}
                  onChange={(e) => setNewDatasetName(e.target.value)}
                  placeholder="Contoh: Laporan Evaluasi Pupuk Bersubsidi 2026"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Produsen Data (OPD)</label>
                <select
                  value={newOpd}
                  onChange={(e) => setNewOpd(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Dinas Pertanian HST">Dinas Pertanian HST</option>
                  <option value="Dinas Kesehatan HST">Dinas Kesehatan HST</option>
                  <option value="Dinas Pendidikan HST">Dinas Pendidikan HST</option>
                  <option value="Dinas Lingkungan Hidup HST">Dinas Lingkungan Hidup HST</option>
                  <option value="Bappeda Litbang HST">Bappeda Litbang HST</option>
                  <option value="BPKAD HST">BPKAD HST</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Kategori Dataset</label>
                <select
                  value={newKategori}
                  onChange={(e) => setNewKategori(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Pertanian & Pangan">Pertanian & Pangan</option>
                  <option value="Kesehatan">Kesehatan</option>
                  <option value="Pendidikan">Pendidikan</option>
                  <option value="Keuangan Daerah">Keuangan Daerah</option>
                  <option value="Lingkungan & Meratus">Lingkungan & Meratus</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button 
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-300 text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Batal
              </button>
              <button 
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
              >
                Simpan & Ajukan
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
