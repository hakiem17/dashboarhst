import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Polygon, GeoJSON, Tooltip as LeafletTooltip } from 'react-leaflet';
import { 
  MapPin, 
  Users, 
  Building2, 
  School, 
  HeartPulse, 
  Search, 
  Info, 
  X, 
  Layers, 
  CheckCircle2,
  Navigation
} from 'lucide-react';
import { kecamatanList, hstKabupatenBoundary, hstInfo } from '../data/mockData';
import { hstGeoJsonData } from '../data/hstBoundaryData.js';
import L from 'leaflet';

const KEC_PALETTE = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#06b6d4', '#ec4899', '#f97316', '#6366f1', '#14b8a6', '#e11d48'
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

// Fix Default Leaflet Marker Icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

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

export default function PetaAdministrasiView() {
  const [selectedKecamatan, setSelectedKecamatan] = useState(kecamatanList[0]);
  const [filterKategori, setFilterKategori] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Center position of Kabupaten Hulu Sungai Tengah (Barabai)
  const hstCenter = [-2.5833, 115.3833];

  const filteredKecamatan = kecamatanList.filter(k => {
    const matchSearch = k.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        k.ibuKota.toLowerCase().includes(searchQuery.toLowerCase());
    const matchKategori = filterKategori === 'Semua' || k.kategori.includes(filterKategori);
    return matchSearch && matchKategori;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
            GIS Interactive Map
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-white mt-1">
            Peta Administrasi 11 Kecamatan HST
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Visualisasi geospasial batas wilayah Kabupaten Hulu Sungai Tengah (Ibu Kota: Barabai)
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kecamatan..."
              className="pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <select
            value={filterKategori}
            onChange={(e) => setFilterKategori(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="Semua">Semua Kategori</option>
            <option value="Pusat">Pusat Perkotaan</option>
            <option value="Ekowisata">Ekowisata & Meratus</option>
            <option value="Pertanian">Pertanian & Padi</option>
          </select>
        </div>
      </div>

      {/* Main Content Grid: Map & Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Leaflet Map Column (2 Cols) */}
        <div className="lg:col-span-2 relative h-[500px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl">
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
            scrollWheelZoom={true}
            style={{ width: '100%', height: '100%' }}
            attributionControl={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* 11 Kecamatan Official GeoJSON Polygons (Exact match with murakatadigi.cloud) */}
            <GeoJSON
              key={`geojson-admin-${selectedKecamatan?.id}`}
              data={hstGeoJsonData}
              style={(feature) => {
                const name = feature?.properties?.nama || '';
                const isSelected = selectedKecamatan && selectedKecamatan.nama.toUpperCase() === name.toUpperCase();
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
                    click: () => setSelectedKecamatan(kec),
                    mouseover: (e) => {
                      e.target.setStyle({
                        fillOpacity: 0.75,
                        weight: 2.5,
                        color: '#ffffff',
                      });
                    },
                    mouseout: (e) => {
                      const isSelected = selectedKecamatan && selectedKecamatan.nama.toUpperCase() === name.toUpperCase();
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
                      <span style="color: #0284c7; font-weight: 700;">${kec.populasi.toLocaleString('id-ID')} Jiwa</span>
                    </div>
                  `, { direction: 'top', sticky: true, opacity: 0.95 });
                }
              }}
            />

            {/* Kecamatan Name Text Badge Markers */}
            {filteredKecamatan.map((kec) => (
              <Marker
                key={`label-${kec.id}`}
                position={[kec.lat, kec.lng]}
                icon={createKecLabelIcon(kec.nama, kec.id === selectedKecamatan?.id)}
                eventHandlers={{
                  click: () => setSelectedKecamatan(kec)
                }}
              />
            ))}
          </MapContainer>

          {/* Map Overlay Badge */}
          <div className="absolute bottom-4 left-4 z-20 glass-panel px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 shadow-lg">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-slate-800 dark:text-white">Kabupaten Hulu Sungai Tengah</span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Klik marker untuk melihat statistik kecamatan</p>
          </div>
        </div>

        {/* Selected Kecamatan Detail Panel */}
        <div className="space-y-4">
          {selectedKecamatan ? (
            <div className="p-6 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30">
                    {selectedKecamatan.kategori}
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mt-1">
                    Kecamatan {selectedKecamatan.nama}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Ibu Kota: <strong className="text-slate-700 dark:text-slate-200">{selectedKecamatan.ibuKota}</strong></p>
                </div>
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                  <MapPin className="w-5 h-5" />
                </div>
              </div>

              <p className="text-xs text-slate-650 dark:text-slate-300 leading-relaxed bg-slate-100 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                {selectedKecamatan.deskripsi}
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-100/50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                    <Users className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Jumlah Penduduk</span>
                  </div>
                  <p className="text-sm font-extrabold text-slate-800 dark:text-white mt-1">
                    {selectedKecamatan.populasi.toLocaleString('id-ID')} Jiwa
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-100/50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                    <Layers className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    <span>Luas Wilayah</span>
                  </div>
                  <p className="text-sm font-extrabold text-slate-800 dark:text-white mt-1">
                    {selectedKecamatan.luas} km²
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-100/50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                    <HeartPulse className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                    <span>Fasilitas Kesehatan</span>
                  </div>
                  <p className="text-sm font-extrabold text-slate-800 dark:text-white mt-1">
                    {selectedKecamatan.faskes} Puskesmas
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-100/50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                    <School className="w-3.5 h-3.5 text-indigo-650 dark:text-indigo-400" />
                    <span>Sekolah (SD/SMP)</span>
                  </div>
                  <p className="text-sm font-extrabold text-slate-800 dark:text-white mt-1">
                    {selectedKecamatan.sekolah} Unit
                  </p>
                </div>
              </div>

              {/* Data Verification Status */}
              <div className="p-3 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs">
                <span className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Status Validasi SIPD
                </span>
                <span className="font-bold text-emerald-700 dark:text-emerald-300">{selectedKecamatan.statusData}</span>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 text-center text-slate-500 dark:text-slate-400 text-xs">
              Pilih kecamatan pada daftar di bawah atau marker peta untuk melihat detail.
            </div>
          )}

          {/* Quick List of 11 Kecamatan */}
          <div className="p-4 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-2 max-h-64 overflow-y-auto">
            <h4 className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">Daftar 11 Kecamatan HST</h4>
            {kecamatanList.map((kec) => (
              <button
                key={kec.id}
                onClick={() => setSelectedKecamatan(kec)}
                className={`
                  w-full flex items-center justify-between p-2 rounded-xl text-xs transition text-left
                  ${selectedKecamatan?.id === kec.id ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-100/50 hover:bg-slate-200/50 dark:bg-slate-900/60 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'}
                `}
              >
                <span>Kecamatan {kec.nama}</span>
                <span className="text-[10px] opacity-80">{kec.ibuKota}</span>
              </button>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}
