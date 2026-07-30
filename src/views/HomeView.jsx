import React from 'react';
import {
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Clock,
  AlertCircle,
  Users,
  ChevronRight,
  Info,
  Newspaper,
  Scale,
  Leaf,
  Briefcase,
  DollarSign,
  Target,
  Award,
  MessageSquare,
  MapPin,
  Sparkles
} from 'lucide-react';
import {
  hstInfo,
  indikatorMakro,
  totalPenduduk,
  kecamatanList,
  realisasiApbd,
  pengaduanData,
  hargaPanganData,
  inflasiData,
  beritaTerkini,
} from '../data/mockData';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip as LeafletTooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const indicatorIcons = [
  TrendingUp, DollarSign, TrendingDown, Scale,
  Users, Leaf, Award, Briefcase
];

const getPopulationColor = (pop) => {
  if (pop > 50000) return { fill: '#1e3a8a', border: '#1e40af' };
  if (pop > 30000) return { fill: '#1d4ed8', border: '#2563eb' };
  if (pop > 20000) return { fill: '#3b82f6', border: '#60a5fa' };
  if (pop > 10000) return { fill: '#93c5fd', border: '#bfdbfe' };
  return { fill: '#dbeafe', border: '#e0f2fe' };
};

const getRadius = (pop) => {
  if (pop > 50000) return 22;
  if (pop > 30000) return 17;
  if (pop > 20000) return 14;
  if (pop > 10000) return 11;
  return 8;
};

const hstCenter = [-2.55, 115.40];

export default function HomeView({ onNavigate, onOpenAiCopilot, darkMode }) {

  const fmt = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] gap-2 overflow-hidden">

      {/* ===== ROW 1: Indikator Makro ===== */}
      <div className="flex-shrink-0 grid grid-cols-4 sm:grid-cols-8 gap-1.5 w-full">
        {indikatorMakro.map((item, idx) => (
          <div
            key={idx}
            className="indicator-card dashboard-card rounded-lg px-2.5 py-1.5 cursor-pointer group"
            onClick={() => onNavigate('strategis')}
          >
            <div className="flex items-center gap-1.5 mb-0.5">
              <span
                className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-extrabold text-white flex-shrink-0"
                style={{ backgroundColor: item.color }}
              >
                {item.no}
              </span>
              <span className="text-[8px] font-semibold text-slate-500 dark:text-slate-400 leading-tight line-clamp-2">
                {item.label}
              </span>
            </div>
            <div className="flex items-baseline gap-0.5">
              {item.prefix && <span className="text-[9px] font-semibold text-slate-400">{item.prefix}</span>}
              <span className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">{item.value}</span>
            </div>
            <p className="text-[8px] text-slate-400 dark:text-slate-500 mt-0.5">{item.target}</p>
            <div className="flex items-center mt-0.5">
              {item.trend === 'up' && <TrendingUp className="w-3 h-3 text-emerald-500" />}
              {item.trend === 'down-good' && <TrendingDown className="w-3 h-3 text-emerald-500" />}
              {item.trend === 'stable' && <Minus className="w-3 h-3 text-slate-400" />}
              <span className="text-[8px] text-blue-500 dark:text-blue-400 font-semibold ml-auto">Detail →</span>
            </div>
          </div>
        ))}
      </div>

      {/* ===== ROW 2: MAIN GRID (Left 3 cols, CENTER 6 COLS HIGHLIGHT MAP, Right 3 cols) ===== */}
      <div className="flex-1 grid grid-cols-12 gap-2 min-h-0">

        {/* LEFT COLUMN (3 cols): APBD & Pengaduan */}
        <div className="col-span-3 flex flex-col gap-2 min-h-0">
          {/* APBD Realisasi */}
          <div className="flex-1 dashboard-card rounded-xl overflow-hidden flex flex-col min-h-0">
            <div className="flex-shrink-0 bg-gradient-to-r from-blue-900 to-blue-800 px-3 py-1.5">
              <h3 className="text-[10px] font-bold text-white flex items-center gap-1.5">
                <DollarSign className="w-3 h-3" /> REALISASI APBD 2025
              </h3>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center p-2.5 min-h-0">
              <div className="w-[100px] h-[100px] rounded-full flex items-center justify-center relative flex-shrink-0"
                style={{ background: `conic-gradient(#1d4ed8 0% ${realisasiApbd.persenRealisasi}%, ${darkMode ? '#334155' : '#e2e8f0'} ${realisasiApbd.persenRealisasi}% 100%)` }}>
                <div className="w-[70px] h-[70px] rounded-full bg-white dark:bg-slate-900 flex flex-col items-center justify-center z-10">
                  <span className="text-base font-extrabold text-blue-800 dark:text-blue-300">{realisasiApbd.persenRealisasi}%</span>
                  <span className="text-[7px] text-slate-500 dark:text-slate-400 font-semibold">Realisasi</span>
                </div>
              </div>
              <div className="w-full space-y-1 mt-2 text-[10px]">
                <div className="flex items-center justify-between px-2 py-1 rounded bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-slate-500">Anggaran:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{realisasiApbd.totalAnggaran}</span>
                </div>
                <div className="flex items-center justify-between px-2 py-1 rounded bg-blue-50 dark:bg-blue-950/40">
                  <span className="text-blue-600 dark:text-blue-300 font-semibold">Realisasi:</span>
                  <span className="font-extrabold text-blue-700 dark:text-blue-200">{realisasiApbd.realisasi}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pengaduan Masyarakat */}
          <div className="flex-1 dashboard-card rounded-xl overflow-hidden flex flex-col min-h-0">
            <div className="flex-shrink-0 bg-gradient-to-r from-blue-900 to-blue-800 px-3 py-1.5">
              <h3 className="text-[10px] font-bold text-white flex items-center gap-1.5">
                <MessageSquare className="w-3 h-3" /> PENGADUAN MASYARAKAT
              </h3>
            </div>
            <div className="flex-1 p-2 flex flex-col justify-center space-y-1.5 min-h-0">
              <div className="flex items-center gap-2 p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-800/50">
                <div className="p-1 rounded bg-blue-600 text-white"><MessageSquare className="w-3 h-3" /></div>
                <div>
                  <p className="text-[8px] text-slate-500 dark:text-slate-400">Total Masuk</p>
                  <p className="text-base font-extrabold text-blue-900 dark:text-blue-300 leading-none">{pengaduanData.total.toLocaleString('id-ID')}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-1 text-[9px] text-center">
                <div className="p-1 rounded bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40">
                  <span className="block text-[8px] text-emerald-600 font-bold">Selesai</span>
                  <span className="font-extrabold text-emerald-700 dark:text-emerald-300">{pengaduanData.selesai}</span>
                </div>
                <div className="p-1 rounded bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40">
                  <span className="block text-[8px] text-amber-600 font-bold">Proses</span>
                  <span className="font-extrabold text-amber-700 dark:text-amber-300">{pengaduanData.proses}</span>
                </div>
                <div className="p-1 rounded bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/40">
                  <span className="block text-[8px] text-red-600 font-bold">Belum</span>
                  <span className="font-extrabold text-red-700 dark:text-red-300">{pengaduanData.belumDitindaklanjuti}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN (6 COLS HIGHLIGHT MAP CENTER): PETA KABUPATEN HST */}
        <div className="col-span-6 dashboard-card rounded-xl overflow-hidden flex flex-col border-2 border-blue-500/30 shadow-2xl relative">
          {/* Header Highlight Banner */}
          <div className="flex-shrink-0 bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 px-4 py-2 flex items-center justify-between border-b border-blue-500/30">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
              </span>
              <h3 className="text-xs font-extrabold text-white tracking-wide flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-400" /> PETA KABUPATEN HULU SUNGAI TENGAH
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 uppercase tracking-wider">
                GIS CENTER
              </span>
              <button
                onClick={() => onNavigate('peta')}
                className="text-[9px] px-2.5 py-0.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold transition shadow-sm"
              >
                Peta Lengkap ↗
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col p-2.5 min-h-0 bg-slate-900/40 backdrop-blur-md">
            {/* Population Bar Overlay */}
            <div className="flex-shrink-0 flex items-center justify-between p-2 rounded-lg bg-blue-950/80 border border-blue-500/30 mb-2 shadow-inner">
              <div className="flex items-baseline gap-2">
                <span className="text-[9px] font-extrabold text-blue-300 tracking-wider">TOTAL PENDUDUK HST:</span>
                <span className="text-xl font-black text-white tracking-tight">{totalPenduduk.total}</span>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm" />
                  <span className="text-[9px] text-slate-300">Laki-laki: <strong className="text-white">{totalPenduduk.lakiLaki}</strong></span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-pink-400 shadow-sm" />
                  <span className="text-[9px] text-slate-300">Perempuan: <strong className="text-white">{totalPenduduk.perempuan}</strong></span>
                </div>
              </div>
            </div>

            {/* Interactive Leaflet Map (HIGHLITED IN CENTER) */}
            <div className="flex-1 rounded-xl overflow-hidden border border-blue-500/40 shadow-inner min-h-0 relative">
              <MapContainer
                center={hstCenter}
                zoom={10}
                scrollWheelZoom={false}
                zoomControl={true}
                style={{ height: '100%', width: '100%' }}
                attributionControl={false}
              >
                <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                {kecamatanList.map((kec) => {
                  const c = getPopulationColor(kec.populasi);
                  const r = getRadius(kec.populasi);
                  return (
                    <CircleMarker key={kec.id} center={[kec.lat, kec.lng]} radius={r}
                      pathOptions={{ fillColor: c.fill, fillOpacity: 0.8, color: c.border, weight: 2 }}>
                      <LeafletTooltip direction="top" offset={[0, -r]} opacity={0.95}>
                        <div style={{ fontSize: '11px', lineHeight: '1.4' }}>
                          <strong>Kec. {kec.nama}</strong><br />
                          <span style={{ color: '#1d4ed8', fontWeight: 'bold' }}>{kec.populasi.toLocaleString('id-ID')} Jiwa</span>
                        </div>
                      </LeafletTooltip>
                      <Popup>
                        <div style={{ fontSize: '12px', lineHeight: '1.5', minWidth: '150px' }}>
                          <strong style={{ fontSize: '13px', color: '#1e3a8a' }}>Kec. {kec.nama}</strong>
                          <div style={{ marginTop: '4px', color: '#334155' }}>
                            <div>👥 Populasi: <strong>{kec.populasi.toLocaleString('id-ID')}</strong> Jiwa</div>
                            <div>📐 Luas: <strong>{kec.luas}</strong> km²</div>
                            <div>🏘️ {kec.desaCount} Desa/Kelurahan</div>
                            <div>🏥 {kec.faskes} Faskes · 🏫 {kec.sekolah} Sekolah</div>
                          </div>
                        </div>
                      </Popup>
                    </CircleMarker>
                  );
                })}
              </MapContainer>
            </div>

            {/* Map Legend Footer */}
            <div className="flex-shrink-0 flex items-center justify-between mt-2 pt-1.5 border-t border-slate-700/60 text-[9px]">
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-400">Rasio Populasi:</span>
                {[
                  { color: '#1e3a8a', l: '>50rb' }, { color: '#1d4ed8', l: '30-50rb' },
                  { color: '#3b82f6', l: '20-30rb' }, { color: '#93c5fd', l: '10-20rb' },
                  { color: '#dbeafe', l: '<10rb' },
                ].map((x, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full border border-slate-600" style={{ backgroundColor: x.color }} />
                    <span className="text-slate-300 font-medium">{x.l}</span>
                  </div>
                ))}
              </div>
              <span className="text-slate-400 italic">Sumber: {totalPenduduk.sumber}</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (3 cols): Inflasi & Harga Pangan */}
        <div className="col-span-3 flex flex-col gap-2 min-h-0">
          {/* Inflasi */}
          <div className="flex-1 dashboard-card rounded-xl overflow-hidden flex flex-col min-h-0">
            <div className="flex-shrink-0 bg-gradient-to-r from-blue-900 to-blue-800 px-3 py-1.5 flex items-center justify-between">
              <h3 className="text-[10px] font-bold text-white flex items-center gap-1.5">
                <TrendingUp className="w-3 h-3" /> INFLASI KAB. (y-on-y)
              </h3>
            </div>
            <div className="flex-1 p-2 flex flex-col min-h-0">
              <div className="flex items-baseline gap-2 mb-0.5">
                <span className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {inflasiData.current.toFixed(2).replace('.', ',')}%
                </span>
                <span className="trend-badge bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400">
                  <ArrowDownRight className="w-2.5 h-2.5" /> {inflasiData.change.toFixed(2).replace('.', ',')}
                </span>
              </div>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={inflasiData.tren} margin={{ top: 5, right: 5, bottom: 0, left: -15 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#334155" : "#e2e8f0"} opacity={0.5} />
                    <XAxis dataKey="bulan" fontSize={8} stroke={darkMode ? "#94a3b8" : "#64748b"} tick={{ fontSize: 8 }} />
                    <YAxis fontSize={8} stroke={darkMode ? "#94a3b8" : "#64748b"} domain={[2, 3]} tickFormatter={(v) => `${v.toFixed(1)}%`} tick={{ fontSize: 8 }} />
                    <Tooltip contentStyle={{ backgroundColor: darkMode ? '#0f172a' : '#fff', borderRadius: '6px', fontSize: '10px' }} formatter={(v) => [`${v.toFixed(2)}%`, 'Inflasi']} />
                    <Line type="monotone" dataKey="nilai" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: '#3b82f6', stroke: '#fff' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Harga Pangan Hari Ini */}
          <div className="flex-1 dashboard-card rounded-xl overflow-hidden flex flex-col min-h-0">
            <div className="flex-shrink-0 bg-gradient-to-r from-blue-900 to-blue-800 px-3 py-1.5 flex items-center justify-between">
              <h3 className="text-[10px] font-bold text-white flex items-center gap-1.5">
                <Target className="w-3 h-3" /> HARGA PANGAN HARI INI
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto min-h-0">
              <table className="w-full text-[9px]">
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {hargaPanganData.slice(0, 5).map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                      <td className="px-2 py-1 text-slate-700 dark:text-slate-300">{item.icon} {item.komoditas}</td>
                      <td className="px-2 py-1 text-right font-bold text-slate-800 dark:text-slate-200">{fmt(item.harga)}</td>
                      <td className="px-2 py-1 text-right font-bold">
                        {item.perubahan === 0 ? (
                          <span className="price-stable">0</span>
                        ) : item.perubahan > 0 ? (
                          <span className="price-up">+{fmt(item.perubahan)}</span>
                        ) : (
                          <span className="price-down">{fmt(item.perubahan)}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      {/* ===== ROW 3: Berita & Informasi Terkini (Bottom Ticker Row) ===== */}
      <div className="flex-shrink-0 dashboard-card rounded-xl overflow-hidden flex items-center px-3 py-1.5 gap-3">
        <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-extrabold text-[10px] uppercase shrink-0 border-r border-slate-700/50 pr-3">
          <Newspaper className="w-3.5 h-3.5" /> BERITA TERKINI
        </div>
        <div className="flex-1 grid grid-cols-4 gap-3 overflow-hidden">
          {beritaTerkini.map((item) => (
            <div key={item.id} className="flex items-center gap-2 truncate group cursor-pointer" onClick={() => onNavigate('dokumen')}>
              <img
                src={item.thumbnail}
                alt={item.judul}
                className="w-8 h-8 rounded object-cover shrink-0 group-hover:scale-105 transition"
                onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/64x64/1e3a5f/ffffff?text=${item.id}`; }}
              />
              <div className="min-w-0">
                <h4 className="text-[10px] font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-blue-500 transition leading-tight">
                  {item.judul}
                </h4>
                <span className="text-[8px] text-slate-400 block">{item.tanggal}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 text-center py-0.5">
        <p className="text-[8px] text-slate-400 dark:text-slate-500">
          © 2025 Diskominfo HST — Dashboard Kepala Daerah Kabupaten Hulu Sungai Tengah
        </p>
      </div>

    </div>
  );
}
