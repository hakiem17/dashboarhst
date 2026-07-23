import React, { useState } from 'react';
import { 
  TrendingUp, 
  Info, 
  HelpCircle, 
  ChevronRight, 
  Download, 
  FileSpreadsheet,
  X,
  CheckCircle2
} from 'lucide-react';
import { macroTimelineData } from '../data/mockData';
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
  LabelList 
} from 'recharts';

export default function DataStrategisView({ darkMode }) {
  const [selectedMetadata, setSelectedMetadata] = useState(null);

  const handleMetadataClick = (title, definition, source, updateCycle) => {
    setSelectedMetadata({ title, definition, source, updateCycle });
  };

  const CustomTooltip = ({ active, payload, label, unit }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700/80 p-3 rounded-xl shadow-xl text-xs space-y-1">
          <p className="font-extrabold text-white">Tahun {label}</p>
          <p className="font-semibold text-emerald-400">
            Nilai: <span className="text-white">{payload[0].value} {unit}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Breadcrumb & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 font-sans tracking-tight">
            Indikator Makro
          </h2>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
          <span>Dashboard</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-emerald-600 dark:text-emerald-400">Indikator Makro</span>
        </div>
      </div>

      {/* Blue Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 border border-blue-500/20 shadow-lg text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-white/15 border border-white/20">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold">Indikator Makro</h3>
            <p className="text-xs text-blue-100 mt-0.5">
              Visualisasi data strategis untuk analisis dan pengambilan keputusan pembangunan Kabupaten Hulu Sungai Tengah
            </p>
          </div>
        </div>
      </div>

      {/* Grid of 8 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 1. Tingkat Kemiskinan */}
        <div className="p-5 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Tingkat Kemiskinan (Persen)</h4>
            <span className="w-2 h-2 rounded-full bg-blue-500" />
          </div>
          <div className="h-60 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={macroTimelineData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#334155" : "#e2e8f0"} opacity={darkMode ? 0.3 : 0.8} />
                <XAxis dataKey="tahun" stroke={darkMode ? "#94a3b8" : "#64748b"} />
                <YAxis stroke={darkMode ? "#94a3b8" : "#64748b"} domain={[5.0, 7.0]} />
                <Tooltip content={<CustomTooltip unit="%" />} />
                <Line type="monotone" dataKey="kemiskinan" stroke="#3b82f6" strokeWidth={3} activeDot={{ r: 6 }}>
                  <LabelList dataKey="kemiskinan" position="top" fill={darkMode ? "#94a3b8" : "#475569"} offset={8} fontSize={10} />
                </Line>
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800/60">
            <span className="text-[10px] text-slate-550 dark:text-slate-400">Sumber: BPS Kabupaten HST</span>
            <button 
              onClick={() => handleMetadataClick(
                "Tingkat Kemiskinan", 
                "Persentase penduduk yang memiliki rata-rata pengeluaran per kapita per bulan di bawah garis kemiskinan.",
                "Badan Pusat Statistik (BPS)",
                "Tahunan"
              )}
              className="px-3 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/35 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] flex items-center gap-1 border border-emerald-500/20 transition"
            >
              <Info className="w-3.5 h-3.5" /> Detail Metadata
            </button>
          </div>
        </div>

        {/* 2. Laju Pertumbuhan Ekonomi */}
        <div className="p-5 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Laju Pertumbuhan Ekonomi (Persen)</h4>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="h-60 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={macroTimelineData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#334155" : "#e2e8f0"} opacity={darkMode ? 0.3 : 0.8} />
                <XAxis dataKey="tahun" stroke={darkMode ? "#94a3b8" : "#64748b"} />
                <YAxis stroke={darkMode ? "#94a3b8" : "#64748b"} domain={[-3.0, 6.0]} />
                <Tooltip content={<CustomTooltip unit="%" />} />
                <Bar dataKey="pertumbuhanEkonomi" fill="#10b981" radius={[4, 4, 0, 0]}>
                  <LabelList dataKey="pertumbuhanEkonomi" position="top" fill={darkMode ? "#94a3b8" : "#475569"} offset={8} fontSize={10} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800/60">
            <span className="text-[10px] text-slate-550 dark:text-slate-400">Sumber: BPS Kabupaten HST</span>
            <button 
              onClick={() => handleMetadataClick(
                "Laju Pertumbuhan Ekonomi", 
                "Kenaikan nilai PDRB atas dasar harga konstan dibandingkan dengan tahun sebelumnya yang dinyatakan dalam persentase.",
                "Badan Pusat Statistik (BPS)",
                "Tahunan"
              )}
              className="px-3 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/35 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] flex items-center gap-1 border border-emerald-500/20 transition"
            >
              <Info className="w-3.5 h-3.5" /> Detail Metadata
            </button>
          </div>
        </div>

        {/* 3. Tingkat Pengangguran Terbuka */}
        <div className="p-5 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Tingkat Pengangguran Terbuka (Persen)</h4>
            <span className="w-2 h-2 rounded-full bg-rose-500" />
          </div>
          <div className="h-60 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={macroTimelineData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#334155" : "#e2e8f0"} opacity={darkMode ? 0.3 : 0.8} />
                <XAxis dataKey="tahun" stroke={darkMode ? "#94a3b8" : "#64748b"} />
                <YAxis stroke={darkMode ? "#94a3b8" : "#64748b"} domain={[2.0, 5.0]} />
                <Tooltip content={<CustomTooltip unit="%" />} />
                <Line type="monotone" dataKey="pengangguran" stroke="#f43f5e" strokeWidth={3} activeDot={{ r: 6 }}>
                  <LabelList dataKey="pengangguran" position="top" fill={darkMode ? "#94a3b8" : "#475569"} offset={8} fontSize={10} />
                </Line>
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800/60">
            <span className="text-[10px] text-slate-555 dark:text-slate-400">Sumber: BPS Kabupaten HST</span>
            <button 
              onClick={() => handleMetadataClick(
                "Tingkat Pengangguran Terbuka (TPT)", 
                "Persentase jumlah pengangguran terhadap jumlah angkatan kerja di Hulu Sungai Tengah.",
                "Badan Pusat Statistik (BPS)",
                "Tahunan"
              )}
              className="px-3 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/35 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] flex items-center gap-1 border border-emerald-500/20 transition"
            >
              <Info className="w-3.5 h-3.5" /> Detail Metadata
            </button>
          </div>
        </div>

        {/* 4. IPM */}
        <div className="p-5 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Indeks Pembangunan Manusia (Point)</h4>
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
          </div>
          <div className="h-60 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={macroTimelineData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#334155" : "#e2e8f0"} opacity={darkMode ? 0.3 : 0.8} />
                <XAxis dataKey="tahun" stroke={darkMode ? "#94a3b8" : "#64748b"} />
                <YAxis stroke={darkMode ? "#94a3b8" : "#64748b"} domain={[68.0, 72.0]} />
                <Tooltip content={<CustomTooltip unit="Point" />} />
                <Line type="monotone" dataKey="ipm" stroke="#6366f1" strokeWidth={3} activeDot={{ r: 6 }}>
                  <LabelList dataKey="ipm" position="top" fill={darkMode ? "#94a3b8" : "#475569"} offset={8} fontSize={10} />
                </Line>
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800/60">
            <span className="text-[10px] text-slate-555 dark:text-slate-400">Sumber: BPS Kabupaten HST</span>
            <button 
              onClick={() => handleMetadataClick(
                "Indeks Pembangunan Manusia (IPM)", 
                "Mengukur capaian pembangunan manusia berbasis tiga dimensi dasar: Umur Panjang & Sehat, Pengetahuan, dan Standar Hidup Layak.",
                "Badan Pusat Statistik (BPS)",
                "Tahunan"
              )}
              className="px-3 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/35 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] flex items-center gap-1 border border-emerald-500/20 transition"
            >
              <Info className="w-3.5 h-3.5" /> Detail Metadata
            </button>
          </div>
        </div>

        {/* 5. PDRB Per Kapita */}
        <div className="p-5 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">PDRB Per Kapita (Juta Rupiah)</h4>
            <span className="w-2 h-2 rounded-full bg-cyan-500" />
          </div>
          <div className="h-60 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={macroTimelineData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#334155" : "#e2e8f0"} opacity={darkMode ? 0.3 : 0.8} />
                <XAxis dataKey="tahun" stroke={darkMode ? "#94a3b8" : "#64748b"} />
                <YAxis stroke={darkMode ? "#94a3b8" : "#64748b"} domain={[20, 40]} />
                <Tooltip content={<CustomTooltip unit="Juta Rp" />} />
                <Bar dataKey="pdrbPerKapita" fill="#06b6d4" radius={[4, 4, 0, 0]}>
                  <LabelList dataKey="pdrbPerKapita" position="top" fill={darkMode ? "#94a3b8" : "#475569"} offset={8} fontSize={10} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800/60">
            <span className="text-[10px] text-slate-555 dark:text-slate-400">Sumber: BPS Kabupaten HST</span>
            <button 
              onClick={() => handleMetadataClick(
                "PDRB Per Kapita", 
                "Rata-rata pendapatan penduduk Hulu Sungai Tengah yang diperoleh dari pembagian nilai PDRB dengan total populasi.",
                "Badan Pusat Statistik (BPS)",
                "Tahunan"
              )}
              className="px-3 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/35 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] flex items-center gap-1 border border-emerald-500/20 transition"
            >
              <Info className="w-3.5 h-3.5" /> Detail Metadata
            </button>
          </div>
        </div>

        {/* 6. Rasio Gini */}
        <div className="p-5 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Rasio Gini (Indeks Ketimpangan)</h4>
            <span className="w-2 h-2 rounded-full bg-purple-500" />
          </div>
          <div className="h-60 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={macroTimelineData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#334155" : "#e2e8f0"} opacity={darkMode ? 0.3 : 0.8} />
                <XAxis dataKey="tahun" stroke={darkMode ? "#94a3b8" : "#64748b"} />
                <YAxis stroke={darkMode ? "#94a3b8" : "#64748b"} domain={[0.25, 0.35]} />
                <Tooltip content={<CustomTooltip unit="Indeks" />} />
                <Line type="monotone" dataKey="giniRatio" stroke="#a855f7" strokeWidth={3} activeDot={{ r: 6 }}>
                  <LabelList dataKey="giniRatio" position="top" fill={darkMode ? "#94a3b8" : "#475569"} offset={8} fontSize={10} />
                </Line>
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800/60">
            <span className="text-[10px] text-slate-555 dark:text-slate-400">Sumber: BPS Kabupaten HST</span>
            <button 
              onClick={() => handleMetadataClick(
                "Rasio Gini (Gini Ratio)", 
                "Indikator ketimpangan pembagian pendapatan penduduk. Skala 0 (pemerataan sempurna) hingga 1 (ketimpangan mutlak).",
                "Badan Pusat Statistik (BPS)",
                "Tahunan"
              )}
              className="px-3 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/35 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] flex items-center gap-1 border border-emerald-500/20 transition"
            >
              <Info className="w-3.5 h-3.5" /> Detail Metadata
            </button>
          </div>
        </div>

        {/* 7. IKLH */}
        <div className="p-5 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Indeks Kualitas Lingkungan Hidup (IKLH)</h4>
            <span className="w-2 h-2 rounded-full bg-lime-500" />
          </div>
          <div className="h-60 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={macroTimelineData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#334155" : "#e2e8f0"} opacity={darkMode ? 0.3 : 0.8} />
                <XAxis dataKey="tahun" stroke={darkMode ? "#94a3b8" : "#64748b"} />
                <YAxis stroke={darkMode ? "#94a3b8" : "#64748b"} domain={[60, 80]} />
                <Tooltip content={<CustomTooltip unit="Point" />} />
                <Line type="monotone" dataKey="iklh" stroke="#84cc16" strokeWidth={3} activeDot={{ r: 6 }}>
                  <LabelList dataKey="iklh" position="top" fill={darkMode ? "#94a3b8" : "#475569"} offset={8} fontSize={10} />
                </Line>
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800/60">
            <span className="text-[10px] text-slate-555 dark:text-slate-400">Sumber: Dinas Lingkungan Hidup HST</span>
            <button 
              onClick={() => handleMetadataClick(
                "Indeks Kualitas Lingkungan Hidup", 
                "Indikator komposit kualitas udara, air, dan tutupan hutan Pegunungan Meratus di Hulu Sungai Tengah.",
                "Dinas Lingkungan Hidup & Perhubungan",
                "Tahunan"
              )}
              className="px-3 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/35 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] flex items-center gap-1 border border-emerald-500/20 transition"
            >
              <Info className="w-3.5 h-3.5" /> Detail Metadata
            </button>
          </div>
        </div>

        {/* 8. Penurunan Intensitas Emisi GRK */}
        <div className="p-5 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Penurunan Intensitas Emisi Gas Rumah Kaca (%)</h4>
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
          </div>
          <div className="h-60 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={macroTimelineData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#334155" : "#e2e8f0"} opacity={darkMode ? 0.3 : 0.8} />
                <XAxis dataKey="tahun" stroke={darkMode ? "#94a3b8" : "#64748b"} />
                <YAxis stroke={darkMode ? "#94a3b8" : "#64748b"} domain={[0.0, 10.0]} />
                <Tooltip content={<CustomTooltip unit="%" />} />
                <Bar dataKey="emisiGrk" fill="#059669" radius={[4, 4, 0, 0]}>
                  <LabelList dataKey="emisiGrk" position="top" fill={darkMode ? "#94a3b8" : "#475569"} offset={8} fontSize={10} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800/60">
            <span className="text-[10px] text-slate-555 dark:text-slate-400">Sumber: Dinas LH & Perhubungan HST</span>
            <button 
              onClick={() => handleMetadataClick(
                "Penurunan Intensitas Emisi GRK", 
                "Indikator keberhasilan pengurangan tingkat emisi karbon dioksida dan gas rumah kaca sektoral Meratus.",
                "Dinas Lingkungan Hidup & Perhubungan",
                "Tahunan"
              )}
              className="px-3 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/35 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] flex items-center gap-1 border border-emerald-500/20 transition"
            >
              <Info className="w-3.5 h-3.5" /> Detail Metadata
            </button>
          </div>
        </div>

      </div>

      {/* Metadata Detail Modal */}
      {selectedMetadata && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-slate-800 dark:text-white">Detail Metadata Indikator</h3>
              <button onClick={() => setSelectedMetadata(null)} className="text-slate-400 hover:text-slate-650 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400 font-semibold">Nama Indikator:</span>
                <p className="font-bold text-emerald-600 dark:text-emerald-400 text-sm mt-0.5">{selectedMetadata.title}</p>
              </div>

              <div>
                <span className="text-slate-500 dark:text-slate-400 font-semibold">Definisi Konseptual:</span>
                <p className="text-slate-700 dark:text-slate-200 mt-1 leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  {selectedMetadata.definition}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 block">Sumber Data</span>
                  <strong className="text-slate-800 dark:text-slate-200 mt-1 block">{selectedMetadata.source}</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 block">Siklus Update</span>
                  <strong className="text-slate-800 dark:text-slate-200 mt-1 block">{selectedMetadata.updateCycle}</strong>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button 
                onClick={() => setSelectedMetadata(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold"
              >
                Tutup Metadata
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
