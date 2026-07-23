import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  ShoppingBag, 
  Scale, 
  Search, 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Calendar,
  Building2,
  FileSpreadsheet,
  ArrowUpDown,
  History,
  TrendingUp as IconInflasi,
  ShieldCheck
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  BarChart, 
  Bar, 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Cell,
  Legend
} from 'recharts';

// 18 Bahan Pokok Penting (Bapokting) HST Data
const BAPOKTING_DATA = [
  { id: 1, nama: "Beras Siam Unus Lokal Barabai", kategori: "Beras", satuan: "Kg", hargaKemarin: 15500, hargaHariIni: 15500, stok: "Melimpah" },
  { id: 2, nama: "Beras Lopo Ijo (Premium)", kategori: "Beras", satuan: "Kg", hargaKemarin: 17000, hargaHariIni: 17000, stok: "Melimpah" },
  { id: 3, nama: "Cabai Rawit Hantakan (Taji)", kategori: "Cabai/Bawang", satuan: "Kg", hargaKemarin: 65000, hargaHariIni: 69500, stok: "Cukup" },
  { id: 4, nama: "Cabai Merah Besar", kategori: "Cabai/Bawang", satuan: "Kg", hargaKemarin: 42000, hargaHariIni: 40000, stok: "Cukup" },
  { id: 5, nama: "Bawang Merah", kategori: "Cabai/Bawang", satuan: "Kg", hargaKemarin: 38000, hargaHariIni: 38500, stok: "Melimpah" },
  { id: 6, nama: "Bawang Putih", kategori: "Cabai/Bawang", satuan: "Kg", hargaKemarin: 40000, hargaHariIni: 40000, stok: "Melimpah" },
  { id: 7, nama: "Daging Sapi Segar (Murni)", kategori: "Daging/Telur", satuan: "Kg", hargaKemarin: 145000, hargaHariIni: 145000, stok: "Cukup" },
  { id: 8, nama: "Daging Ayam Ras", kategori: "Daging/Telur", satuan: "Kg", hargaKemarin: 37000, hargaHariIni: 35000, stok: "Melimpah" },
  { id: 9, nama: "Telur Ayam Ras", kategori: "Daging/Telur", satuan: "Butir", hargaKemarin: 2100, hargaHariIni: 2100, stok: "Melimpah" },
  { id: 10, nama: "Minyak Goreng Kita (Kemasan)", kategori: "Minyak/Gula", satuan: "Liter", hargaKemarin: 16000, hargaHariIni: 16500, stok: "Cukup" },
  { id: 11, nama: "Minyak Goreng Curah", kategori: "Minyak/Gula", satuan: "Liter", hargaKemarin: 15000, hargaHariIni: 15000, stok: "Terbatas" },
  { id: 12, nama: "Gula Pasir Kemasan", kategori: "Minyak/Gula", satuan: "Kg", hargaKemarin: 18000, hargaHariIni: 18000, stok: "Melimpah" },
  { id: 13, nama: "Tepung Terigu Segitiga Biru", kategori: "Lainnya", satuan: "Kg", hargaKemarin: 13000, hargaHariIni: 13000, stok: "Melimpah" },
  { id: 14, nama: "Daging Ayam Kampung", kategori: "Daging/Telur", satuan: "Kg", hargaKemarin: 75000, hargaHariIni: 75000, stok: "Cukup" },
  { id: 15, nama: "Kacang Kedelai Impor", kategori: "Lainnya", satuan: "Kg", hargaKemarin: 14500, hargaHariIni: 14700, stok: "Terbatas" },
  { id: 16, nama: "Susu Kental Manis Frisian Flag", kategori: "Lainnya", satuan: "Kaleng", hargaKemarin: 12500, hargaHariIni: 12500, stok: "Melimpah" },
  { id: 17, nama: "Garam Dapur Beryodium", kategori: "Lainnya", satuan: "Bungkus", hargaKemarin: 3000, hargaHariIni: 3000, stok: "Melimpah" },
  { id: 18, nama: "Gas LPG 3 Kg (Melon)", kategori: "Lainnya", satuan: "Tabung", hargaKemarin: 18500, hargaHariIni: 20000, stok: "Terbatas" }
];

// Historical Trend Data for Selected Commodities (last 7 days)
const TREND_HISTORI = {
  "Beras Siam Unus Lokal Barabai": [
    { tanggal: "17 Juli", harga: 15500 },
    { tanggal: "18 Juli", harga: 15500 },
    { tanggal: "19 Juli", harga: 15500 },
    { tanggal: "20 Juli", harga: 15500 },
    { tanggal: "21 Juli", harga: 15500 },
    { tanggal: "22 Juli", harga: 15500 },
    { tanggal: "23 Juli", harga: 15500 }
  ],
  "Cabai Rawit Hantakan (Taji)": [
    { tanggal: "17 Juli", harga: 62000 },
    { tanggal: "18 Juli", harga: 63000 },
    { tanggal: "19 Juli", harga: 63000 },
    { tanggal: "20 Juli", harga: 64500 },
    { tanggal: "21 Juli", harga: 65000 },
    { tanggal: "22 Juli", harga: 65000 },
    { tanggal: "23 Juli", harga: 69500 }
  ],
  "Daging Ayam Ras": [
    { tanggal: "17 Juli", harga: 38500 },
    { tanggal: "18 Juli", harga: 38000 },
    { tanggal: "19 Juli", harga: 38000 },
    { tanggal: "20 Juli", harga: 37500 },
    { tanggal: "21 Juli", harga: 37000 },
    { tanggal: "22 Juli", harga: 37000 },
    { tanggal: "23 Juli", harga: 35000 }
  ],
  "Minyak Goreng Kita (Kemasan)": [
    { tanggal: "17 Juli", harga: 16000 },
    { tanggal: "18 Juli", harga: 16000 },
    { tanggal: "19 Juli", harga: 16000 },
    { tanggal: "20 Juli", harga: 16000 },
    { tanggal: "21 Juli", harga: 16000 },
    { tanggal: "22 Juli", harga: 16000 },
    { tanggal: "23 Juli", harga: 16500 }
  ]
};

// Monthly Inflation Data 2026 (m-to-m and y-on-y)
const INFLASI_BULANAN = [
  { bulan: "Jan", mtm: 0.12, yoy: 2.45 },
  { bulan: "Feb", mtm: 0.18, yoy: 2.51 },
  { bulan: "Mar", mtm: 0.32, yoy: 2.68 },
  { bulan: "Apr", mtm: 0.45, yoy: 2.82 },
  { bulan: "Mei", mtm: 0.15, yoy: 2.70 },
  { bulan: "Jun", mtm: 0.24, yoy: 2.65 }
];

// Inflation comparison across South Kalimantan districts (y-on-y)
const INFLASI_REGIONAL = [
  { daerah: "Banjarmasin", inflasi: 2.82, color: "#94a3b8" },
  { daerah: "Banjarbaru", inflasi: 2.71, color: "#94a3b8" },
  { daerah: "Hulu Sungai Tengah", inflasi: 2.65, color: "#10b981" },
  { daerah: "Hulu Sungai Selatan", inflasi: 2.94, color: "#94a3b8" },
  { daerah: "Hulu Sungai Utara", inflasi: 3.12, color: "#f43f5e" }
];

// Market Interventions by TPID
const INTERVENSI_TPID = [
  { id: 1, kegiatan: "Operasi Pasar Murah Ramadhan", lokasi: "Kecamatan Barabai", komoditas: "Beras, Minyak, Gula", status: "Selesai", tanggal: "12 Mar 2026" },
  { id: 2, kegiatan: "Sidak Gudang Sembako & Distributor", lokasi: "Kecamatan Labuan Amas Selatan", komoditas: "Minyak Goreng Kita", status: "Terpantau Aman", tanggal: "20 Apr 2026" },
  { id: 3, kegiatan: "Bantuan Transportasi Distribusi Cabai", lokasi: "Kecamatan Hantakan", komoditas: "Cabai Rawit Merah", status: "Berjalan", tanggal: "22 Jul 2026" },
  { id: 4, kegiatan: "Operasi Pasar LPG 3 Kg Bersubsidi", lokasi: "Kecamatan Pandawan", komoditas: "Gas LPG 3 Kg", status: "Selesai", tanggal: "Kemarin" }
];

export default function TpidView({ activeSubView, darkMode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('Semua');
  const [selectedTrendCommodity, setSelectedTrendCommodity] = useState('Cabai Rawit Hantakan (Taji)');

  const getPriceChange = (kemarin, hariIni) => {
    return hariIni - kemarin;
  };

  const getPriceChangePercentage = (kemarin, hariIni) => {
    const diff = hariIni - kemarin;
    return ((diff / kemarin) * 100).toFixed(1);
  };

  // Filter bapokting data
  const filteredBapokting = BAPOKTING_DATA.filter(item => {
    const matchSearch = item.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        item.kategori.toLowerCase().includes(searchQuery.toLowerCase());
    const matchKategori = selectedKategori === 'Semua' || item.kategori === selectedKategori;
    return matchSearch && matchKategori;
  });

  const categories = ['Semua', 'Beras', 'Cabai/Bawang', 'Daging/Telur', 'Minyak/Gula', 'Lainnya'];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Breadcrumb & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 font-sans tracking-tight">
            {activeSubView === 'tpid-harga' ? 'Harga Harian Bahan Pokok (Bapokting)' : 'Tren Inflasi & Pengendalian TPID'}
          </h2>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-450 font-semibold">
          <span>Dashboard</span>
          <ChevronRight className="w-3 h-3" />
          <span>Harga Pangan & TPID</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-emerald-600 dark:text-emerald-400">
            {activeSubView === 'tpid-harga' ? 'Harga Harian Bapokting' : 'Tren Inflasi Daerah'}
          </span>
        </div>
      </div>

      {/* View 1: Harga Harian Bapokting */}
      {activeSubView === 'tpid-harga' && (
        <div className="space-y-6">
          
          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-cerulean-600 dark:text-cerulean-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold">Komoditas Dipantau</span>
                <strong className="text-base font-extrabold text-slate-800 dark:text-white block mt-0.5">{BAPOKTING_DATA.length} Bahan Pokok</strong>
                <span className="text-[9px] text-slate-400 dark:text-slate-500">Pasar Keramat Barabai</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-455">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-555 dark:text-slate-400 block font-semibold">Kenaikan Tertinggi</span>
                <strong className="text-base font-extrabold text-rose-650 dark:text-rose-400 block mt-0.5">Cabai Rawit (+6.9%)</strong>
                <span className="text-[9px] text-rose-500 dark:text-rose-500/90 font-medium">Naik Rp4.500/Kg</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-455">
                <TrendingDown className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-555 dark:text-slate-400 block font-semibold">Penurunan Terbesar</span>
                <strong className="text-base font-extrabold text-emerald-650 dark:text-emerald-400 block mt-0.5">Ayam Ras (-5.4%)</strong>
                <span className="text-[9px] text-emerald-600 dark:text-emerald-400/90 font-medium">Turun Rp2.000/Kg</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-455">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-555 dark:text-slate-400 block font-semibold">Indeks Stok Pangan</span>
                <strong className="text-base font-extrabold text-emerald-650 dark:text-emerald-400 block mt-0.5">Sangat Aman</strong>
                <span className="text-[9px] text-slate-400 dark:text-slate-500">Kecukupan Suplai 92%</span>
              </div>
            </div>
          </div>

          {/* Interactive Line Chart for Selected Bapokting */}
          <div className="p-5 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-1.5">
                  <History className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Tren Harga 7 Hari Terakhir
                </h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Perkembangan fluktuasi harga komoditas pokok terpilih di HST</p>
              </div>

              <div>
                <select
                  value={selectedTrendCommodity}
                  onChange={(e) => setSelectedTrendCommodity(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-850 dark:text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="Cabai Rawit Hantakan (Taji)">Cabai Rawit Hantakan (Taji)</option>
                  <option value="Beras Siam Unus Lokal Barabai">Beras Siam Unus Lokal Barabai</option>
                  <option value="Daging Ayam Ras">Daging Ayam Ras</option>
                  <option value="Minyak Goreng Kita (Kemasan)">Minyak Goreng Kita (Kemasan)</option>
                </select>
              </div>
            </div>

            <div className="h-64 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={TREND_HISTORI[selectedTrendCommodity] || []} margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#334155" : "#e2e8f0"} opacity={darkMode ? 0.3 : 0.8} />
                  <XAxis dataKey="tanggal" stroke={darkMode ? "#94a3b8" : "#64748b"} />
                  <YAxis stroke={darkMode ? "#94a3b8" : "#64748b"} />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", color: "#fff" }} />
                  <Line type="monotone" dataKey="harga" name="Harga (Rp)" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Commodity Price Table */}
          <div className="p-5 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-white">Daftar Harga Eceran Bahan Pokok Kabupaten HST</h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Sumber Data: Dinas Perdagangan & TPID Hulu Sungai Tengah</p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative w-full sm:w-48">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-450" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari komoditas..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedKategori(cat)}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition shrink-0 ${
                        selectedKategori === cat 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-455 hover:bg-slate-200 dark:hover:bg-slate-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-900 text-slate-650 dark:text-slate-400 font-bold uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
                    <th className="p-3 w-12 text-center">No</th>
                    <th className="p-3">Nama Bahan Pokok</th>
                    <th className="p-3">Satuan</th>
                    <th className="p-3 text-right">Harga Kemarin</th>
                    <th className="p-3 text-right">Harga Hari Ini</th>
                    <th className="p-3 text-center">Perubahan</th>
                    <th className="p-3 text-center">Status Pasokan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
                  {filteredBapokting.map((item, idx) => {
                    const diff = getPriceChange(item.hargaKemarin, item.hargaHariIni);
                    const pct = getPriceChangePercentage(item.hargaKemarin, item.hargaHariIni);
                    
                    return (
                      <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 text-slate-700 dark:text-slate-350 border-b border-slate-100 dark:border-slate-800/40">
                        <td className="p-3 text-center text-slate-500 font-bold">{idx + 1}</td>
                        <td className="p-3 font-semibold text-slate-800 dark:text-white">{item.nama}</td>
                        <td className="p-3 font-medium text-slate-500">{item.satuan}</td>
                        <td className="p-3 text-right font-mono font-bold text-slate-550 dark:text-slate-400">Rp{item.hargaKemarin.toLocaleString('id-ID')}</td>
                        <td className="p-3 text-right font-mono font-bold text-slate-800 dark:text-white">Rp{item.hargaHariIni.toLocaleString('id-ID')}</td>
                        <td className="p-3 text-center">
                          {diff > 0 ? (
                            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-350 text-[10px] font-bold border border-rose-500/30">
                              <TrendingUp className="w-3 h-3" /> +{pct}% (Rp{diff.toLocaleString('id-ID')})
                            </span>
                          ) : diff < 0 ? (
                            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-350 text-[10px] font-bold border border-emerald-500/30">
                              <TrendingDown className="w-3 h-3" /> {pct}% (Rp{Math.abs(diff).toLocaleString('id-ID')})
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-450 text-[10px] font-bold border border-slate-200 dark:border-slate-700">
                              Stabil
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            item.stok === 'Melimpah' 
                              ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-450 border-emerald-500/30'
                              : item.stok === 'Cukup'
                              ? 'bg-blue-500/20 text-blue-600 dark:text-blue-455 border-blue-500/30'
                              : 'bg-amber-500/20 text-amber-600 dark:text-amber-455 border-amber-500/30'
                          }`}>
                            {item.stok}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredBapokting.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-4 text-center text-slate-500">Tidak ada komoditas pangan yang cocok.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* View 2: Tren Inflasi Daerah */}
      {activeSubView === 'tpid-inflasi' && (
        <div className="space-y-6">
          
          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400">
                <IconInflasi className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold">Inflasi Bulanan (m-to-m)</span>
                <strong className="text-base font-extrabold text-slate-800 dark:text-white block mt-0.5">0.24%</strong>
                <span className="text-[9px] text-slate-400 dark:text-slate-500">Update Juni 2026</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-455">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-555 dark:text-slate-400 block font-semibold">Inflasi Tahunan (y-on-y)</span>
                <strong className="text-base font-extrabold text-emerald-650 dark:text-emerald-400 block mt-0.5">2.65%</strong>
                <span className="text-[9px] text-emerald-500 dark:text-emerald-400/90 font-medium">Target APBD: &lt; 3.0%</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-cerulean-600 dark:text-cerulean-400">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-555 dark:text-slate-400 block font-semibold">Indeks Harga Konsumen</span>
                <strong className="text-base font-extrabold text-slate-800 dark:text-white block mt-0.5">114.8 Point</strong>
                <span className="text-[9px] text-slate-450">Base Year 2020</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-455">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-555 dark:text-slate-400 block font-semibold">Status TPID HST</span>
                <strong className="text-base font-extrabold text-emerald-650 dark:text-emerald-400 block mt-0.5">Terjaga (Hijau)</strong>
                <span className="text-[9px] text-slate-400 dark:text-slate-500">Laju Kenaikan Sangat Rendah</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Area Chart: Monthly Inflation Trend */}
            <div className="p-5 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-white">Laju Inflasi Bulanan (m-to-m) HST 2026</h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Perkembangan fluktuasi IHK bulanan di Kabupaten Hulu Sungai Tengah</p>
              </div>

              <div className="h-64 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={INFLASI_BULANAN} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorMtm" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#334155" : "#e2e8f0"} opacity={darkMode ? 0.3 : 0.8} />
                    <XAxis dataKey="bulan" stroke={darkMode ? "#94a3b8" : "#64748b"} />
                    <YAxis stroke={darkMode ? "#94a3b8" : "#64748b"} />
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", color: "#fff" }} />
                    <Area type="monotone" dataKey="mtm" name="Inflasi m-to-m (%)" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorMtm)" strokeWidth={2.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bar Chart: Regional Inflation Comparison */}
            <div className="p-5 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-white">Perbandingan Inflasi Tahunan (y-on-y) Regional Kalsel</h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Posisi tingkat inflasi HST dibandingkan kabupaten/kota tetangga (Juni 2026)</p>
              </div>

              <div className="h-64 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={INFLASI_REGIONAL} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#334155" : "#e2e8f0"} opacity={darkMode ? 0.3 : 0.8} />
                    <XAxis dataKey="daerah" stroke={darkMode ? "#94a3b8" : "#64748b"} fontSize={9} />
                    <YAxis stroke={darkMode ? "#94a3b8" : "#64748b"} />
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", color: "#fff" }} />
                    <Bar dataKey="inflasi" name="Inflasi y-on-y (%)">
                      {INFLASI_REGIONAL.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || '#94a3b8'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* TPID Market Intervention Logs */}
          <div className="p-5 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-white">Log Kegiatan Pengendalian Inflasi (TPID HST)</h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Intervensi kebijakan 4K (Ketersediaan pasokan, Keterjangkauan harga, Kelancaran distribusi, Komunikasi efektif)</p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-900 text-slate-650 dark:text-slate-400 font-bold uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
                    <th className="p-3 w-12 text-center">No</th>
                    <th className="p-3">Nama Kegiatan</th>
                    <th className="p-3">Fokus Wilayah</th>
                    <th className="p-3">Target Komoditas</th>
                    <th className="p-3 text-center">Status Kegiatan</th>
                    <th className="p-3 text-right">Tanggal Pelaksanaan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
                  {INTERVENSI_TPID.map((act, idx) => (
                    <tr key={act.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 text-slate-700 dark:text-slate-350 border-b border-slate-100 dark:border-slate-800/40">
                      <td className="p-3 text-center text-slate-500 font-bold">{idx + 1}</td>
                      <td className="p-3 font-semibold text-slate-800 dark:text-white">{act.kegiatan}</td>
                      <td className="p-3 font-semibold text-slate-700 dark:text-slate-300">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          {act.lokasi}
                        </span>
                      </td>
                      <td className="p-3 font-semibold">
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold border border-slate-200 dark:border-slate-700 text-slate-650 dark:text-slate-400">
                          {act.komoditas}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          act.status === 'Selesai' 
                            ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border-emerald-500/30'
                            : 'bg-blue-500/20 text-blue-600 dark:text-blue-300 border-blue-500/30'
                        }`}>
                          {act.status}
                        </span>
                      </td>
                      <td className="p-3 text-right text-slate-500">{act.tanggal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
