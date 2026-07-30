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
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { MapContainer, TileLayer, Polygon, CircleMarker, Marker, Popup, GeoJSON, Tooltip as LeafletTooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { hstGeoJsonData } from '../data/hstBoundaryData.js';
import {
  hstInfo,
  indikatorMakro,
  totalPenduduk,
  kecamatanList,
  hstKabupatenBoundary,
  realisasiApbd,
  pengaduanData,
  hargaPanganData,
  inflasiData,
  beritaTerkini,
  misiBupatiData,
} from '../data/mockData';

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

const KEC_PALETTE = [
  '#3b82f6', // Barabai
  '#10b981', // Batu Benawa
  '#f59e0b', // Hantakan
  '#ef4444', // Haruyan
  '#8b5cf6', // Labuan Amas Selatan
  '#06b6d4', // Labuan Amas Utara
  '#ec4899', // Batang Alai Selatan
  '#f97316', // Batang Alai Timur
  '#6366f1', // Batang Alai Utara
  '#14b8a6', // Limpasu
  '#e11d48', // Pandawan
];

const getKecColor = (name) => {
  const list = [
    'BARABAI', 'BATU BENAWA', 'HANTAKAN', 'HARUYAN', 
    'LABUAN AMAS SELATAN', 'LABUAN AMAS UTARA', 
    'BATANG ALAI SELATAN', 'BATANG ALAI TIMUR', 'BATANG ALAI UTARA', 
    'LIMPASU', 'PANDAWAN'
  ];
  const idx = list.indexOf((name || '').toUpperCase());
  return idx >= 0 ? KEC_PALETTE[idx] : '#3b82f6';
};

const hstCenter = [-2.55, 115.40];

const createKecLabelIcon = (name, isSelected) => {
  return L.divIcon({
    className: 'custom-kec-label',
    html: `<div style="
      background-color: ${isSelected ? '#0284c7' : 'rgba(255, 255, 255, 0.95)'};
      color: ${isSelected ? '#ffffff' : '#0f172a'};
      border: 1px solid ${isSelected ? '#0369a1' : '#94a3b8'};
      font-size: 9px;
      font-weight: 800;
      padding: 2px 6px;
      border-radius: 6px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      white-space: nowrap;
      pointer-events: none;
      transform: translate(-50%, -50%);
    ">${name}</div>`,
    iconSize: [60, 18],
    iconAnchor: [30, 9]
  });
};

export default function HomeView({ onNavigate, onOpenAiCopilot, darkMode }) {
  const [selectedKecId, setSelectedKecId] = React.useState(1);
  const [apbdTab, setApbdTab] = React.useState('apbd');
  const [showInflasiModal, setShowInflasiModal] = React.useState(false);

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

      {/* ===== ROW 1.5: CAPAIAN 4 MISI UTAMA BUPATI KABUPATEN HULU SUNGAI TENGAH ===== */}
      <div className="flex-shrink-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1.5 w-full">
        {misiBupatiData.map((misi) => (
          <div 
            key={misi.id}
            onClick={() => onNavigate('misi-bupati')}
            className={`dashboard-card rounded-xl p-2 cursor-pointer group border ${misi.borderColor} hover:border-emerald-500/50 transition flex flex-col justify-between relative overflow-hidden`}
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full ${misi.badgeColor} uppercase tracking-wider`}>
                  {misi.misiNo}
                </span>
                <span className="text-[8px] font-bold text-slate-400 group-hover:text-emerald-400 transition flex items-center gap-0.5">
                  RPJMD HST <ChevronRight className="w-2.5 h-2.5" />
                </span>
              </div>
              <h4 className="text-[10px] font-extrabold text-slate-900 dark:text-white leading-tight group-hover:text-emerald-500 transition line-clamp-1">
                {misi.judul}
              </h4>
              <p className="text-[8px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                {misi.tujuan}
              </p>
            </div>
            <div className="mt-1.5 pt-1 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[7.5px]">
              <span className="text-slate-400 font-medium">Target RPJMD 2026</span>
              <span className="font-extrabold text-emerald-600 dark:text-emerald-400 group-hover:underline flex items-center gap-0.5">
                Buka Menu Misi <ChevronRight className="w-2 h-2" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ===== ROW 2: MAIN GRID (Left 3 cols, CENTER 6 COLS HIGHLIGHT MAP, Right 3 cols) ===== */}
      <div className="flex-1 grid grid-cols-12 gap-2 min-h-0">

        {/* LEFT COLUMN (3 cols): APBD & Pengaduan */}
        <div className="col-span-3 flex flex-col gap-2 min-h-0">
          {/* APBD Realisasi Card with Visual Chart (Ringkasan APBD, Pendapatan, & Belanja) */}
          <div className="flex-1 dashboard-card rounded-xl overflow-hidden flex flex-col min-h-0 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500/40 transition duration-200">
            {/* Header with Title & Quick OPD Button */}
            <div 
              onClick={() => onNavigate('apbd-belanja')}
              className="flex-shrink-0 bg-gradient-to-r from-blue-900 via-blue-850 to-blue-800 px-3 py-1.5 flex items-center justify-between cursor-pointer group"
            >
              <h3 className="text-[10px] font-bold text-white flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-blue-300" /> REALISASI APBD 2025
              </h3>
              <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-blue-700/80 text-blue-100 border border-blue-500/50 group-hover:bg-blue-600 transition flex items-center gap-0.5">
                Detail OPD <ChevronRight className="w-2.5 h-2.5" />
              </span>
            </div>

            {/* Content: Full-Height Graphical Visualizations (3 Donut Pie Charts + BarChart + Summary KPIs) */}
            <div 
              onClick={() => onNavigate('apbd-belanja')}
              className="flex-1 p-2 flex flex-col justify-between min-h-0 cursor-pointer space-y-2"
            >
              {/* 3 Donut Pie Charts (APBD, Pendapatan, Belanja) */}
              <div className="grid grid-cols-3 gap-1.5 flex-shrink-0">
                {/* Donut 1: APBD */}
                <div className="flex flex-col items-center bg-blue-50/70 dark:bg-blue-950/30 p-1 rounded-lg border border-blue-100 dark:border-blue-900/40">
                  <div className="w-[60px] h-[60px] relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Realisasi', value: realisasiApbd.persenRealisasi },
                            { name: 'Sisa', value: 100 - realisasiApbd.persenRealisasi }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={18}
                          outerRadius={26}
                          startAngle={90}
                          endAngle={-270}
                          dataKey="value"
                          stroke="none"
                        >
                          <Cell fill="#2563eb" />
                          <Cell fill={darkMode ? '#334155' : '#cbd5e1'} />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <span className="absolute text-[9px] font-black text-blue-700 dark:text-blue-300">
                      {realisasiApbd.persenRealisasi}%
                    </span>
                  </div>
                  <span className="text-[8px] font-bold text-blue-900 dark:text-blue-200 mt-0.5">APBD</span>
                  <span className="text-[7px] text-slate-500 dark:text-slate-400 font-semibold">{realisasiApbd.realisasi} / {realisasiApbd.totalAnggaran}</span>
                </div>

                {/* Donut 2: Pendapatan */}
                <div className="flex flex-col items-center bg-emerald-50/70 dark:bg-emerald-950/30 p-1 rounded-lg border border-emerald-100 dark:border-emerald-900/40">
                  <div className="w-[60px] h-[60px] relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Realisasi', value: realisasiApbd.pendapatan.persen },
                            { name: 'Sisa', value: 100 - realisasiApbd.pendapatan.persen }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={18}
                          outerRadius={26}
                          startAngle={90}
                          endAngle={-270}
                          dataKey="value"
                          stroke="none"
                        >
                          <Cell fill="#10b981" />
                          <Cell fill={darkMode ? '#334155' : '#cbd5e1'} />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <span className="absolute text-[9px] font-black text-emerald-700 dark:text-emerald-300">
                      {realisasiApbd.pendapatan.persen}%
                    </span>
                  </div>
                  <span className="text-[8px] font-bold text-emerald-900 dark:text-emerald-200 mt-0.5">Pendapatan</span>
                  <span className="text-[7px] text-slate-500 dark:text-slate-400 font-semibold">{realisasiApbd.pendapatan.realisasi} / {realisasiApbd.pendapatan.target}</span>
                </div>

                {/* Donut 3: Belanja */}
                <div className="flex flex-col items-center bg-indigo-50/70 dark:bg-indigo-950/30 p-1 rounded-lg border border-indigo-100 dark:border-indigo-900/40">
                  <div className="w-[60px] h-[60px] relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Realisasi', value: realisasiApbd.belanja.persen },
                            { name: 'Sisa', value: 100 - realisasiApbd.belanja.persen }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={18}
                          outerRadius={26}
                          startAngle={90}
                          endAngle={-270}
                          dataKey="value"
                          stroke="none"
                        >
                          <Cell fill="#6366f1" />
                          <Cell fill={darkMode ? '#334155' : '#cbd5e1'} />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <span className="absolute text-[9px] font-black text-indigo-700 dark:text-indigo-300">
                      {realisasiApbd.belanja.persen}%
                    </span>
                  </div>
                  <span className="text-[8px] font-bold text-indigo-900 dark:text-indigo-200 mt-0.5">Belanja</span>
                  <span className="text-[7px] text-slate-500 dark:text-slate-400 font-semibold">{realisasiApbd.belanja.realisasi} / {realisasiApbd.belanja.pagu}</span>
                </div>
              </div>

              {/* Bar Chart Anggaran vs Realisasi */}
              <div className="flex-1 w-full bg-slate-50 dark:bg-slate-900/60 p-1.5 rounded-lg border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between min-h-[90px]">
                <div className="flex items-center justify-between text-[8px] font-bold px-1 mb-1">
                  <span className="text-slate-700 dark:text-slate-300">Komparasi Target vs Realisasi (Rp Triliun)</span>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-sm bg-slate-400"></span> Target</span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-sm bg-blue-600"></span> Realisasi</span>
                  </div>
                </div>
                <div className="flex-1 w-full min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'APBD Total', Target: 2.15, Realisasi: 1.00 },
                        { name: 'Pendapatan', Target: 2.10, Realisasi: 1.12 },
                        { name: 'Belanja', Target: 2.15, Realisasi: 1.00 },
                      ]}
                      margin={{ top: 2, right: 5, left: -25, bottom: 0 }}
                      barGap={4}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? '#334155' : '#cbd5e1'} opacity={0.4} />
                      <XAxis dataKey="name" tick={{ fontSize: 8, fill: darkMode ? '#94a3b8' : '#475569' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 7, fill: darkMode ? '#94a3b8' : '#475569' }} axisLine={false} tickLine={false} domain={[0, 2.5]} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: darkMode ? '#0f172a' : '#ffffff', 
                          borderColor: darkMode ? '#334155' : '#cbd5e1', 
                          fontSize: '9px',
                          borderRadius: '6px'
                        }}
                        formatter={(val) => [`Rp ${val} T`, '']}
                      />
                      <Bar dataKey="Target" fill="#94a3b8" radius={[3, 3, 0, 0]} barSize={12} />
                      <Bar dataKey="Realisasi" fill="#2563eb" radius={[3, 3, 0, 0]} barSize={12} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Breakdown Cards Footer (No blank spaces) */}
              <div className="grid grid-cols-2 gap-1 text-[8px] flex-shrink-0">
                <div className="p-1 rounded bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-slate-500">PAD / Transfer:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{realisasiApbd.pendapatan.pad}</span>
                </div>
                <div className="p-1 rounded bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-slate-500">Belanja Operasi:</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{realisasiApbd.belanja.operasi}</span>
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
        <div className="col-span-6 dashboard-card rounded-xl overflow-hidden flex flex-col border border-blue-500/30 shadow-2xl relative">
          {/* Header Highlight Banner */}
          <div className="flex-shrink-0 bg-slate-900/90 dark:bg-slate-950 px-3 py-1.5 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-blue-600/20 text-blue-400 border border-blue-500/30">
                Polygon (Wilayah)
              </span>
              <span className="text-[9px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                3D VIEW
              </span>
              <span className="text-[9px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                Pilih Kolom
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('peta')}
                className="text-[9px] px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-extrabold shadow transition flex items-center gap-1"
              >
                Terapkan Konfigurasi Peta ↗
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col p-2 min-h-0 bg-slate-900/40">
            {/* Active Selected Kecamatan Information Bar */}
            <div className="flex-shrink-0 flex items-center justify-between p-2 rounded-lg bg-blue-950/70 border border-blue-500/30 mb-1.5 text-white">
              {(() => {
                const activeKec = kecamatanList.find(k => k.id === selectedKecId) || kecamatanList[0];
                return (
                  <>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-400" />
                      <div>
                        <p className="text-[10px] font-extrabold text-white">KECAMATAN {activeKec.nama.toUpperCase()}</p>
                        <p className="text-[8px] text-blue-300">Ibu Kota: {activeKec.ibuKota} · {activeKec.kategori}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <p className="text-[8px] text-slate-400">Populasi</p>
                        <p className="text-xs font-black text-blue-300">{activeKec.populasi.toLocaleString('id-ID')} Jiwa</p>
                      </div>
                      <div>
                        <p className="text-[8px] text-slate-400">Luas Wilayah</p>
                        <p className="text-xs font-black text-white">{activeKec.luas} km²</p>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Leaflet Map (Matching Reference Image Style with Clear Boundaries & Labels) */}
            <div className="flex-1 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-800 shadow-inner min-h-0 relative">
              <MapContainer
                center={[-2.58, 115.42]}
                zoom={10}
                minZoom={10}
                maxZoom={15}
                maxBounds={[
                  [-2.90, 115.00],
                  [-2.30, 115.90]
                ]}
                maxBoundsViscosity={1.0}
                scrollWheelZoom={false}
                zoomControl={true}
                style={{ height: '100%', width: '100%' }}
                attributionControl={false}
              >
                <TileLayer 
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* 11 Kecamatan Official GeoJSON Polygons (Exact match with murakatadigi.cloud) */}
                <GeoJSON
                  key={`geojson-${selectedKecId}`}
                  data={hstGeoJsonData}
                  style={(feature) => {
                    const name = feature?.properties?.nama || '';
                    const selKec = kecamatanList.find(k => k.id === selectedKecId);
                    const isSelected = selKec && selKec.nama.toUpperCase() === name.toUpperCase();
                    const color = getKecColor(name);
                    return {
                      color: isSelected ? '#ffffff' : '#475569',
                      weight: isSelected ? 3.5 : 1.5,
                      fillColor: color,
                      fillOpacity: isSelected ? 0.85 : 0.5,
                    };
                  }}
                  onEachFeature={(feature, layer) => {
                    const name = feature?.properties?.nama || '';
                    const kec = kecamatanList.find(k => k.nama.toUpperCase() === name.toUpperCase());
                    if (kec) {
                      layer.on({
                        click: () => setSelectedKecId(kec.id),
                        mouseover: (e) => {
                          e.target.setStyle({
                            fillOpacity: 0.75,
                            weight: 2.5,
                            color: '#ffffff',
                          });
                        },
                        mouseout: (e) => {
                          const selKec = kecamatanList.find(k => k.id === selectedKecId);
                          const isSelected = selKec && selKec.nama.toUpperCase() === name.toUpperCase();
                          const color = getKecColor(name);
                          e.target.setStyle({
                            fillOpacity: isSelected ? 0.85 : 0.5,
                            weight: isSelected ? 3.5 : 1.5,
                            color: isSelected ? '#ffffff' : '#475569',
                          });
                        }
                      });
                      layer.bindTooltip(`
                        <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11px; padding: 2px 4px;">
                          <strong style="color: #0f172a;">Kecamatan ${kec.nama}</strong><br/>
                          <span style="color: #475569;">Ibu Kota: ${kec.ibuKota}</span><br/>
                          <span style="color: #0284c7; font-weight: 700;">${kec.populasi.toLocaleString('id-ID')} Jiwa</span>
                        </div>
                      `, { direction: 'top', sticky: true, opacity: 0.95 });
                    }
                  }}
                />

                {/* Kecamatan Name Text Badge Markers */}
                {kecamatanList.map((kec) => (
                  <Marker
                    key={`label-${kec.id}`}
                    position={[kec.lat, kec.lng]}
                    icon={createKecLabelIcon(kec.nama, kec.id === selectedKecId)}
                    eventHandlers={{
                      click: () => setSelectedKecId(kec.id)
                    }}
                  />
                ))}
              </MapContainer>
            </div>

            {/* Map Legend Footer */}
            <div className="flex-shrink-0 flex items-center gap-2 mt-1.5 pt-1 border-t border-slate-800 text-[8px] flex-wrap">
              <span className="font-bold text-slate-400">LEGENDA:</span>
              {kecamatanList.slice(0, 6).map((kec) => (
                <div key={kec.id} className="flex items-center gap-0.5 cursor-pointer" onClick={() => setSelectedKecId(kec.id)}>
                  <span className="w-2.5 h-2.5 rounded-sm border border-white/50" style={{ backgroundColor: kec.color }} />
                  <span className={`${selectedKecId === kec.id ? 'text-white font-bold' : 'text-slate-400'}`}>{kec.nama}</span>
                </div>
              ))}
              <span className="text-slate-500">+5</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (3 cols): Inflasi & Harga Pangan */}
        <div className="col-span-3 flex flex-col gap-2 min-h-0">
          {/* Inflasi - Concise Informative Summary (Opens BPS Infographic Modal on Click) */}
          <div 
            onClick={() => setShowInflasiModal(true)}
            className="flex-1 dashboard-card rounded-xl overflow-hidden flex flex-col min-h-0 cursor-pointer group hover:border-emerald-500/50 transition duration-200"
          >
            <div className="flex-shrink-0 bg-gradient-to-r from-teal-900 via-emerald-900 to-teal-800 px-3 py-1.5 flex items-center justify-between">
              <h3 className="text-[10px] font-bold text-white flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-300" /> INFLASI HST ({inflasiData.bulan})
              </h3>
              <span className="text-[7px] font-extrabold px-1.5 py-0.5 rounded-full bg-emerald-800/80 text-emerald-100 border border-emerald-500/40 group-hover:bg-emerald-700 transition flex items-center gap-0.5">
                BPS <ChevronRight className="w-2.5 h-2.5" />
              </span>
            </div>

            <div className="flex-1 p-2 flex flex-col justify-between min-h-0 space-y-1.5">
              {/* 3 Summary Pills: M-to-M, Y-to-D, Y-on-Y */}
              <div className="grid grid-cols-3 gap-1 text-[8px] text-center">
                <div className="p-1 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900/60">
                  <span className="block text-[7px] text-teal-600 dark:text-teal-400 font-extrabold uppercase">M-to-M</span>
                  <span className="text-xs font-black text-teal-700 dark:text-teal-300">0,03%</span>
                </div>
                <div className="p-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60">
                  <span className="block text-[7px] text-emerald-600 dark:text-emerald-400 font-extrabold uppercase">Y-to-D</span>
                  <span className="text-xs font-black text-emerald-700 dark:text-emerald-300">1,93%</span>
                </div>
                <div className="p-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60">
                  <span className="block text-[7px] text-blue-600 dark:text-blue-400 font-extrabold uppercase">Y-on-Y</span>
                  <span className="text-xs font-black text-blue-700 dark:text-blue-300">4,54%</span>
                </div>
              </div>

              {/* Detailed Trend Line Chart with Month & Y-Axis Labels (Fills Card Space) */}
              <div className="flex-1 w-full bg-slate-50 dark:bg-slate-900/50 p-1.5 rounded-lg border border-slate-200/50 dark:border-slate-800 flex flex-col min-h-[110px]">
                <div className="flex items-center justify-between text-[8px] font-bold px-1 mb-1">
                  <span className="text-slate-700 dark:text-slate-300">Tren Inflasi Y-on-Y (8 Bulan Terakhir)</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">Terbaru: 4,54%</span>
                </div>
                <div className="flex-1 w-full min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={inflasiData.tren.slice(-8)} margin={{ top: 5, right: 8, bottom: 15, left: -22 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? "#334155" : "#cbd5e1"} opacity={0.4} />
                      <XAxis 
                        dataKey="bulan" 
                        fontSize={7} 
                        stroke={darkMode ? "#94a3b8" : "#475569"} 
                        tick={{ fontSize: 7, fill: darkMode ? '#94a3b8' : '#475569' }} 
                        axisLine={false} 
                        tickLine={false} 
                      />
                      <YAxis 
                        fontSize={7} 
                        stroke={darkMode ? "#94a3b8" : "#475569"} 
                        domain={[0, 7]} 
                        tickFormatter={(v) => `${v}%`} 
                        tick={{ fontSize: 7, fill: darkMode ? '#94a3b8' : '#475569' }} 
                        axisLine={false} 
                        tickLine={false} 
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: darkMode ? '#0f172a' : '#fff', borderColor: darkMode ? '#334155' : '#cbd5e1', borderRadius: '6px', fontSize: '9px' }} 
                        formatter={(v) => [`${v.toFixed(2)}%`, 'Inflasi Y-on-Y']} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="nilai" 
                        stroke="#10b981" 
                        strokeWidth={2.5} 
                        dot={{ r: 3, fill: '#10b981', stroke: '#fff', strokeWidth: 1.5 }} 
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Click Trigger Footer */}
              <div className="text-center pt-0.5 border-t border-slate-200 dark:border-slate-800">
                <span className="text-[8px] font-extrabold text-emerald-600 dark:text-emerald-400 group-hover:underline flex items-center justify-center gap-0.5">
                  Buka Berita Resmi BPS & Andil Kelompok <ChevronRight className="w-2.5 h-2.5" />
                </span>
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
          © 2025 Diskominfo SP HST — Dashboard Kepala Daerah Kabupaten Hulu Sungai Tengah
        </p>
      </div>

      {/* ===== BPS INFLASI DETAIL MODAL (Matching Official Infographic) ===== */}
      {showInflasiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
            
            {/* Modal Header */}
            <div className="p-4 bg-gradient-to-r from-purple-900 via-indigo-900 to-teal-900 text-white rounded-t-2xl flex items-start justify-between relative overflow-hidden">
              <div className="relative z-10">
                <span className="text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full bg-white/20 text-teal-200 border border-white/30">
                  BERITA RESMI STATISTIK BPS
                </span>
                <h2 className="text-base font-black tracking-tight mt-1 text-white">
                  PERKEMBANGAN INDEKS HARGA KONSUMEN (IHK) KABUPATEN HULU SUNGAI TENGAH JUNI 2026
                </h2>
                <p className="text-[11px] text-teal-200 mt-0.5">
                  {inflasiData.noBrs}
                </p>
              </div>
              <button 
                onClick={() => setShowInflasiModal(false)}
                className="relative z-10 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-5 flex-1 overflow-y-auto">
              
              {/* 3 Main Inflasi Badges (M-to-M, Y-to-D, Y-on-Y) */}
              <div className="grid grid-cols-3 gap-3">
                {/* M-to-M */}
                <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/30 text-center">
                  <span className="text-[10px] font-extrabold text-teal-600 dark:text-teal-400 block tracking-wider uppercase">Month-to-Month (M-to-M)</span>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <span className="text-xs font-bold text-teal-600 dark:text-teal-400">INFLASI</span>
                    <span className="text-2xl font-black text-teal-700 dark:text-teal-300">0,03%</span>
                  </div>
                </div>

                {/* Y-to-D */}
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                  <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 block tracking-wider uppercase">Year-to-Date (Y-to-D)</span>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">INFLASI</span>
                    <span className="text-2xl font-black text-emerald-700 dark:text-emerald-300">1,93%</span>
                  </div>
                </div>

                {/* Y-on-Y */}
                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-center">
                  <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 block tracking-wider uppercase">Year-on-Year (Y-on-Y)</span>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">INFLASI</span>
                    <span className="text-2xl font-black text-indigo-700 dark:text-indigo-300">4,54%</span>
                  </div>
                </div>
              </div>

              {/* SECTION 1: Andil Inflasi Y-on-Y Menurut Kelompok Pengeluaran */}
              <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-3 text-center">
                  Andil Inflasi Year-on-Year (Y-on-Y) Menurut Kelompok Pengeluaran
                </h3>
                
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  {inflasiData.kelompokPengeluaran.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{item.icon}</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{item.kelompok}</span>
                      </div>
                      <span className={`font-black text-xs px-2 py-0.5 rounded ${
                        item.andil >= 1.0 ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' :
                        item.andil >= 0.2 ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                        'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {item.andil === 0 ? '~0%' : `${item.andil.toFixed(2).replace('.', ',')}%`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 2: Tingkat Inflasi Y-on-Y (Juli 2024 - Juni 2026) Line Chart */}
              <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Tingkat Inflasi Y-on-Y Kab. Hulu Sungai Tengah (Juli 2024 – Juni 2026)
                  </h3>
                  <span className="text-[9px] font-bold text-slate-500">2022=100</span>
                </div>
                
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={inflasiData.tren} margin={{ top: 15, right: 15, bottom: 20, left: -10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#334155" : "#cbd5e1"} opacity={0.4} />
                      <XAxis dataKey="bulan" fontSize={9} stroke={darkMode ? "#94a3b8" : "#475569"} angle={-25} textAnchor="end" />
                      <YAxis domain={[-1, 8]} fontSize={9} stroke={darkMode ? "#94a3b8" : "#475569"} tickFormatter={(v) => `${v}%`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: darkMode ? '#0f172a' : '#fff', borderRadius: '8px', fontSize: '11px' }} 
                        formatter={(v) => [`${v.toFixed(2)}%`, 'Inflasi Y-on-Y']} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="nilai" 
                        stroke="#8b5cf6" 
                        strokeWidth={3} 
                        dot={{ r: 4, fill: '#06b6d4', stroke: '#fff', strokeWidth: 2 }} 
                        activeDot={{ r: 6, fill: '#8b5cf6' }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-100 dark:bg-slate-950/80 rounded-b-2xl border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px]">
              <span className="text-slate-500">
                Sumber Resmi: Badan Pusat Statistik (BPS) Kabupaten Hulu Sungai Tengah
              </span>
              <button 
                onClick={() => setShowInflasiModal(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold transition"
              >
                Tutup Window
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
