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

      {/* ===== ROW 1: Header + Indikator Makro ===== */}
      <div className="flex-shrink-0 flex items-stretch gap-2">
        {/* Mini Header */}
        <div className="flex-shrink-0 flex items-center gap-3 rounded-xl bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 px-4 py-2 shadow-lg">
          <div className="p-1.5 rounded-lg bg-white/10 border border-white/20">
            <img
              src={hstInfo.logoUrl}
              alt="Logo HST"
              className="w-7 h-8 object-contain"
              onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/56x64/1e3a5f/ffffff?text=HST"; }}
            />
          </div>
          <div>
            <h1 className="text-xs font-extrabold text-white tracking-tight leading-tight">DASHBOARD KEPALA DAERAH</h1>
            <p className="text-[9px] text-blue-200 font-medium">KAB. HULU SUNGAI TENGAH</p>
          </div>
        </div>

        {/* Indikator Makro Cards */}
        <div className="flex-1 flex gap-1.5 overflow-x-auto indicator-scroll">
          {indikatorMakro.map((item, idx) => (
            <div
              key={idx}
              className="indicator-card dashboard-card rounded-lg px-2.5 py-2 cursor-pointer group flex-shrink-0 min-w-[120px] flex-1"
              onClick={() => onNavigate('strategis')}
            >
              <div className="flex items-center gap-1.5 mb-1">
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
              <div className="flex items-center mt-1">
                {item.trend === 'up' && <TrendingUp className="w-3 h-3 text-emerald-500" />}
                {item.trend === 'down-good' && <TrendingDown className="w-3 h-3 text-emerald-500" />}
                {item.trend === 'stable' && <Minus className="w-3 h-3 text-slate-400" />}
                <span className="text-[8px] text-blue-500 dark:text-blue-400 font-semibold ml-auto">Detail →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== ROW 2: Peta + APBD + Pengaduan ===== */}
      <div className="flex-1 grid grid-cols-12 gap-2 min-h-0">

        {/* LEFT: Peta Kabupaten (5 cols) */}
        <div className="col-span-5 dashboard-card rounded-xl overflow-hidden flex flex-col">
          <div className="flex-shrink-0 bg-gradient-to-r from-blue-900 to-blue-800 px-3 py-1.5 flex items-center justify-between">
            <h3 className="text-[10px] font-bold text-white flex items-center gap-1.5">
              <MapPin className="w-3 h-3" /> PETA KAB. HULU SUNGAI TENGAH
            </h3>
            <button onClick={() => onNavigate('peta')} className="text-[8px] px-1.5 py-0.5 rounded-full bg-blue-700/80 text-blue-200 font-semibold border border-blue-600/50 hover:bg-blue-600/80 transition">
              Peta Lengkap ↗
            </button>
          </div>
          <div className="flex-1 flex flex-col p-2 min-h-0">
            {/* Pop summary */}
            <div className="flex-shrink-0 p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 mb-2">
              <div className="flex items-baseline gap-2">
                <div>
                  <p className="text-[9px] font-bold text-slate-600 dark:text-slate-400">TOTAL PENDUDUK</p>
                  <p className="text-lg font-extrabold text-blue-900 dark:text-blue-300 tracking-tight leading-tight">{totalPenduduk.total}</p>
                </div>
                <div className="flex gap-3 ml-auto">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-[8px] text-slate-500 dark:text-slate-400">L: <b>{totalPenduduk.lakiLaki}</b></span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-pink-400" />
                    <span className="text-[8px] text-slate-500 dark:text-slate-400">P: <b>{totalPenduduk.perempuan}</b></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="flex-1 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700/50 min-h-0">
              <MapContainer
                center={hstCenter}
                zoom={10}
                scrollWheelZoom={false}
                zoomControl={false}
                style={{ height: '100%', width: '100%' }}
                attributionControl={false}
              >
                <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                {kecamatanList.map((kec) => {
                  const c = getPopulationColor(kec.populasi);
                  const r = getRadius(kec.populasi);
                  return (
                    <CircleMarker key={kec.id} center={[kec.lat, kec.lng]} radius={r}
                      pathOptions={{ fillColor: c.fill, fillOpacity: 0.75, color: c.border, weight: 2 }}>
                      <LeafletTooltip direction="top" offset={[0, -r]} opacity={0.95}>
                        <div style={{ fontSize: '10px', lineHeight: '1.3' }}>
                          <strong>Kec. {kec.nama}</strong><br />
                          <span style={{ color: '#1d4ed8' }}>{kec.populasi.toLocaleString('id-ID')} Jiwa</span>
                        </div>
                      </LeafletTooltip>
                      <Popup>
                        <div style={{ fontSize: '11px', lineHeight: '1.4', minWidth: '140px' }}>
                          <strong>Kec. {kec.nama}</strong>
                          <div style={{ marginTop: '3px', color: '#334155' }}>
                            <div>👥 {kec.populasi.toLocaleString('id-ID')} Jiwa</div>
                            <div>📐 {kec.luas} km² · {kec.desaCount} Desa</div>
                            <div>🏥 {kec.faskes} Faskes · 🏫 {kec.sekolah} Sekolah</div>
                          </div>
                        </div>
                      </Popup>
                    </CircleMarker>
                  );
                })}
              </MapContainer>
            </div>

            {/* Legend */}
            <div className="flex-shrink-0 flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1.5 pt-1 border-t border-slate-200 dark:border-slate-700/50">
              {[
                { color: '#1e3a8a', l: '>50rb' }, { color: '#1d4ed8', l: '30-50rb' },
                { color: '#3b82f6', l: '20-30rb' }, { color: '#93c5fd', l: '10-20rb' },
                { color: '#dbeafe', l: '<10rb' },
              ].map((x, i) => (
                <div key={i} className="flex items-center gap-0.5">
                  <span className="w-2.5 h-2.5 rounded-full border border-slate-300 dark:border-slate-600" style={{ backgroundColor: x.color }} />
                  <span className="text-[8px] text-slate-400">{x.l}</span>
                </div>
              ))}
              <span className="text-[7px] text-slate-400 italic ml-auto">Sumber: {totalPenduduk.sumber}</span>
            </div>
          </div>
        </div>

        {/* MIDDLE: Realisasi APBD (4 cols) */}
        <div className="col-span-4 dashboard-card rounded-xl overflow-hidden flex flex-col">
          <div className="flex-shrink-0 bg-gradient-to-r from-blue-900 to-blue-800 px-3 py-1.5">
            <h3 className="text-[10px] font-bold text-white flex items-center gap-1.5">
              <DollarSign className="w-3 h-3" /> REALISASI ANGGARAN APBD 2025
            </h3>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center p-3 min-h-0">
            {/* Donut */}
            <div className="w-[130px] h-[130px] rounded-full flex items-center justify-center relative flex-shrink-0"
              style={{ background: `conic-gradient(#1d4ed8 0% ${realisasiApbd.persenRealisasi}%, ${darkMode ? '#334155' : '#e2e8f0'} ${realisasiApbd.persenRealisasi}% 100%)` }}>
              <div className="w-[90px] h-[90px] rounded-full bg-white dark:bg-slate-900 flex flex-col items-center justify-center z-10">
                <span className="text-xl font-extrabold text-blue-800 dark:text-blue-300">{realisasiApbd.persenRealisasi}%</span>
                <span className="text-[8px] text-slate-500 dark:text-slate-400 font-semibold">Realisasi</span>
              </div>
            </div>

            {/* Details */}
            <div className="w-full space-y-1.5 mt-3">
              {[
                { label: 'Total Anggaran', value: realisasiApbd.totalAnggaran, accent: false },
                { label: 'Realisasi', value: realisasiApbd.realisasi, accent: true },
                { label: 'Sisa Anggaran', value: realisasiApbd.sisaAnggaran, accent: false },
              ].map((row, i) => (
                <div key={i} className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-xs ${
                  row.accent
                    ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-800/50'
                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700/50'
                }`}>
                  <span className={row.accent ? 'text-blue-700 dark:text-blue-300' : 'text-slate-600 dark:text-slate-400'}>{row.label}</span>
                  <span className={`font-bold ${row.accent ? 'text-blue-800 dark:text-blue-200' : 'text-slate-900 dark:text-white'}`}>{row.value}</span>
                </div>
              ))}
            </div>
            <button onClick={() => onNavigate('apbd-ringkasan')} className="mt-2 text-[10px] text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-0.5 hover:text-blue-500 transition">
              Lihat Detail <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* RIGHT: Pengaduan Masyarakat (3 cols) */}
        <div className="col-span-3 dashboard-card rounded-xl overflow-hidden flex flex-col">
          <div className="flex-shrink-0 bg-gradient-to-r from-blue-900 to-blue-800 px-3 py-1.5">
            <h3 className="text-[10px] font-bold text-white flex items-center gap-1.5">
              <MessageSquare className="w-3 h-3" /> PENGADUAN MASYARAKAT
            </h3>
          </div>
          <div className="flex-1 p-2.5 flex flex-col justify-center space-y-2 min-h-0">
            {/* Total */}
            <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-800/50">
              <div className="p-1.5 rounded-md bg-blue-600 text-white"><MessageSquare className="w-3.5 h-3.5" /></div>
              <div>
                <p className="text-[8px] text-slate-500 dark:text-slate-400 font-medium">Total Pengaduan</p>
                <p className="text-lg font-extrabold text-blue-900 dark:text-blue-300 leading-tight">{pengaduanData.total.toLocaleString('id-ID')}</p>
              </div>
            </div>
            {/* Status */}
            {[
              { icon: CheckCircle2, label: 'Selesai', value: pengaduanData.selesai.toLocaleString('id-ID'), bg: 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-800/40', iconColor: 'text-emerald-500', valueColor: 'text-emerald-700 dark:text-emerald-400' },
              { icon: Clock, label: 'Proses', value: pengaduanData.proses, bg: 'bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-800/40', iconColor: 'text-amber-500', valueColor: 'text-amber-700 dark:text-amber-400' },
              { icon: AlertCircle, label: 'Belum Ditindaklanjuti', value: pengaduanData.belumDitindaklanjuti, bg: 'bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-800/40', iconColor: 'text-red-500', valueColor: 'text-red-700 dark:text-red-400' },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className={`flex items-center justify-between px-2.5 py-2 rounded-lg border ${s.bg}`}>
                  <div className="flex items-center gap-1.5">
                    <Icon className={`w-3 h-3 ${s.iconColor}`} />
                    <span className="text-[10px] text-slate-700 dark:text-slate-300">{s.label}</span>
                  </div>
                  <span className={`text-sm font-extrabold ${s.valueColor}`}>{s.value}</span>
                </div>
              );
            })}
            <button onClick={() => onNavigate('home')} className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-0.5 hover:text-blue-500 transition pt-0.5">
              Lihat Detail <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* ===== ROW 3: Harga Pangan + Inflasi + Berita ===== */}
      <div className="flex-shrink-0 grid grid-cols-12 gap-2" style={{ height: '38%' }}>

        {/* Harga Pangan (5 cols) */}
        <div className="col-span-5 dashboard-card rounded-xl overflow-hidden flex flex-col">
          <div className="flex-shrink-0 bg-gradient-to-r from-blue-900 to-blue-800 px-3 py-1.5 flex items-center justify-between">
            <h3 className="text-[10px] font-bold text-white flex items-center gap-1.5">
              <Target className="w-3 h-3" /> HARGA PANGAN HARI INI
            </h3>
            <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-blue-700/80 text-blue-200 font-semibold border border-blue-600/50">Lihat Semua ↗</span>
          </div>
          <div className="flex-1 overflow-y-auto min-h-0">
            <table className="w-full text-[10px]">
              <thead className="sticky top-0">
                <tr className="bg-slate-50 dark:bg-slate-800/80">
                  <th className="text-left font-bold text-slate-500 dark:text-slate-400 px-2.5 py-1.5">Komoditas</th>
                  <th className="text-right font-bold text-slate-500 dark:text-slate-400 px-2.5 py-1.5">Harga (Rp)</th>
                  <th className="text-right font-bold text-slate-500 dark:text-slate-400 px-2.5 py-1.5">Perubahan</th>
                </tr>
              </thead>
              <tbody>
                {hargaPanganData.map((item, idx) => (
                  <tr key={idx} className="border-t border-slate-100 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                    <td className="px-2.5 py-1.5 text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <span className="text-xs">{item.icon}</span>{item.komoditas}
                    </td>
                    <td className="px-2.5 py-1.5 text-right font-bold text-slate-800 dark:text-slate-200">{fmt(item.harga)}</td>
                    <td className="px-2.5 py-1.5 text-right font-bold">
                      {item.perubahan === 0 ? (
                        <span className="price-stable flex items-center justify-end gap-0.5"><Minus className="w-2.5 h-2.5" /> 0</span>
                      ) : item.perubahan > 0 ? (
                        <span className="price-up flex items-center justify-end gap-0.5"><ArrowUpRight className="w-2.5 h-2.5" /> +{fmt(item.perubahan)}</span>
                      ) : (
                        <span className="price-down flex items-center justify-end gap-0.5"><ArrowDownRight className="w-2.5 h-2.5" /> {fmt(item.perubahan)}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inflasi (3 cols) */}
        <div className="col-span-3 dashboard-card rounded-xl overflow-hidden flex flex-col">
          <div className="flex-shrink-0 bg-gradient-to-r from-blue-900 to-blue-800 px-3 py-1.5 flex items-center justify-between">
            <h3 className="text-[10px] font-bold text-white flex items-center gap-1.5">
              <TrendingUp className="w-3 h-3" /> INFLASI KAB. (y-on-y)
            </h3>
          </div>
          <div className="flex-1 p-2.5 flex flex-col min-h-0">
            <div className="flex items-baseline gap-2 mb-0.5">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {inflasiData.current.toFixed(2).replace('.', ',')}%
              </span>
              <span className="trend-badge bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400">
                <ArrowDownRight className="w-2.5 h-2.5" /> {inflasiData.change.toFixed(2).replace('.', ',')} poin
              </span>
            </div>
            <p className="text-[8px] text-slate-400 dark:text-slate-500 mb-1">{inflasiData.bulan} · {inflasiData.changePeriod}</p>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={inflasiData.tren} margin={{ top: 5, right: 5, bottom: 0, left: -15 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#334155" : "#e2e8f0"} opacity={0.5} />
                  <XAxis dataKey="bulan" fontSize={8} stroke={darkMode ? "#94a3b8" : "#64748b"} tick={{ fontSize: 8 }} interval={0} />
                  <YAxis fontSize={8} stroke={darkMode ? "#94a3b8" : "#64748b"} domain={[2, 3]} tickFormatter={(v) => `${v.toFixed(1)}%`} tick={{ fontSize: 8 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: darkMode ? '#0f172a' : '#fff', borderColor: darkMode ? '#334155' : '#e2e8f0', borderRadius: '6px', fontSize: '10px', color: darkMode ? '#fff' : '#1e293b' }}
                    formatter={(v) => [`${v.toFixed(2)}%`, 'Inflasi']}
                  />
                  <Line type="monotone" dataKey="nilai" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: '#3b82f6', stroke: '#fff', strokeWidth: 1.5 }} activeDot={{ r: 5, fill: '#1d4ed8' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[7px] text-slate-400 italic mt-1 flex-shrink-0">Sumber: {inflasiData.sumber}</p>
          </div>
        </div>

        {/* Berita (4 cols) */}
        <div className="col-span-4 dashboard-card rounded-xl overflow-hidden flex flex-col">
          <div className="flex-shrink-0 bg-gradient-to-r from-blue-900 to-blue-800 px-3 py-1.5">
            <h3 className="text-[10px] font-bold text-white flex items-center gap-1.5">
              <Newspaper className="w-3 h-3" /> BERITA & INFORMASI TERKINI
            </h3>
          </div>
          <div className="flex-1 p-2 overflow-y-auto min-h-0 space-y-1.5">
            {beritaTerkini.map((item) => (
              <div key={item.id} className="flex gap-2.5 p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/30 cursor-pointer group transition">
                <div className="w-16 h-12 rounded-md overflow-hidden flex-shrink-0">
                  <img
                    src={item.thumbnail}
                    alt={item.judul}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/160x120/1e3a5f/ffffff?text=${item.id}`; }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[10px] font-bold text-slate-800 dark:text-slate-200 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition leading-tight">
                    {item.judul}
                  </h4>
                  <p className="text-[8px] text-slate-400 dark:text-slate-500 mt-0.5">📅 {item.tanggal}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 text-center py-1">
        <p className="text-[8px] text-slate-400 dark:text-slate-500">
          © 2025 Diskominfo HST — Dashboard Kepala Daerah Kabupaten Hulu Sungai Tengah
        </p>
      </div>
    </div>
  );
}
