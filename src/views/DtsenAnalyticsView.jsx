import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell 
} from 'recharts';
import { 
  FileText, CheckCircle2, AlertCircle, RefreshCw, Filter, Search, 
  Users, User, Home, ShieldAlert, Droplets, Zap, Layers, Sparkles, Building2, Flame, HeartPulse, Activity, Briefcase,
  Database, X
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { 
  parseDtsenCsv, aggregateHouseholdData, aggregateIndividualData, METADATA_DICTIONARIES 
} from '../lib/dtsenDataService';

const COLORS = ['#10b981', '#06b6d4', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1'];

export default function DtsenAnalyticsView({ darkMode, defaultMode = 'household' }) {
  const [mode, setMode] = useState(defaultMode); // 'household' or 'individual'
  const [activeTab, setActiveTab] = useState(defaultMode === 'household' ? 'desil' : 'pekerjaan');
  const [serverFiles, setServerFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState('');
  
  // Data states
  const [householdDataset, setHouseholdDataset] = useState(null);
  const [individualDataset, setIndividualDataset] = useState(null);
  const [activeFileName, setActiveFileName] = useState('');
  
  // Filter states
  const [selectedKecamatan, setSelectedKecamatan] = useState('ALL');
  const [selectedDesil, setSelectedDesil] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Sync mode if prop changes
  useEffect(() => {
    setMode(defaultMode);
    setActiveTab(defaultMode === 'household' ? 'desil' : 'pekerjaan');
  }, [defaultMode]);

  // Fetch available CSV files in dtsencsv directory from server API
  const fetchServerFiles = async () => {
    try {
      const res = await fetch('/api/dtsen-files');
      if (res.ok) {
        const data = await res.json();
        setServerFiles(data.files || []);
      }
    } catch (e) {
      console.warn('Could not fetch server files list:', e);
    }
  };

  // Load a file from dtsencsv path
  const loadServerCsv = async (fileName) => {
    setLoading(true);
    setLoadingProgress(`Memuat file ${fileName}...`);
    try {
      const res = await fetch(`/dtsencsv/${encodeURIComponent(fileName)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      
      setLoadingProgress(`Memproses data CSV ${fileName}...`);
      const parsed = parseDtsenCsv(text, fileName);
      if (parsed) {
        if (parsed.type === 'household') {
          setHouseholdDataset(parsed);
          setActiveFileName(fileName);
        } else if (parsed.type === 'individual') {
          setIndividualDataset(parsed);
          setActiveFileName(fileName);
        }
      }
    } catch (err) {
      alert(`Gagal memuat file ${fileName}: ${err.message}`);
    } finally {
      setLoading(false);
      setLoadingProgress('');
    }
  };

  // Load data directly from Database with full pagination
  const loadFromSupabase = async (targetMode = mode) => {
    const tableName = targetMode === 'household' ? 'dtsen_keluarga' : 'dtsen_individu';
    const modeLabel = targetMode === 'household' ? 'Data Keluarga (KK)' : 'Data Individu (NIK)';
    setLoading(true);
    setLoadingProgress(`📡 Memeriksa total data di Database (${modeLabel})...`);
    
    try {
      // 1. Get exact total count first
      const { count, error: countError } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });

      if (countError) throw countError;

      if (!count || count === 0) {
        return false; // Table empty, allow fallback to local CSV
      }

      // 2. Paginate fetch all rows in 1,000 row chunks
      const PAGE_SIZE = 1000;
      let allRows = [];

      for (let offset = 0; offset < count; offset += PAGE_SIZE) {
        const currentCount = allRows.length;
        setLoadingProgress(`📡 Memuat data dari Database... ${currentCount.toLocaleString('id-ID')} / ${count.toLocaleString('id-ID')} baris`);

        const { data: pageData, error: pageError } = await supabase
          .from(tableName)
          .select('*')
          .range(offset, offset + PAGE_SIZE - 1);

        if (pageError) throw pageError;
        if (!pageData || pageData.length === 0) break;

        allRows = allRows.concat(pageData);
      }

      const dataset = {
        type: targetMode,
        fileName: `🗄️ Database Terintegrasi (${modeLabel})`,
        data: allRows,
        totalRecords: allRows.length,
        isFromDb: true
      };

      if (targetMode === 'household') {
        setHouseholdDataset(dataset);
      } else {
        setIndividualDataset(dataset);
      }
      setActiveFileName(`🗄️ Database Terintegrasi (${modeLabel})`);
      return true;
    } catch (err) {
      console.error('Error loading from Database:', err);
      alert(`Gagal mengambil data dari Database: ${err.message}`);
      return false;
    } finally {
      setLoading(false);
      setLoadingProgress('');
    }
  };

  // Initial load: try Supabase DB first, fallback to CSV if DB is empty
  useEffect(() => {
    const initLoad = async () => {
      const loadedFromDb = await loadFromSupabase(mode);
      if (!loadedFromDb) {
        if (mode === 'household') {
          loadServerCsv('KABUPATEN_HULU_SUNGAI_TENGAH_400_9_14_122_BAPPERIDA_2026_1_1.csv');
        } else {
          loadServerCsv('KABUPATEN_HULU_SUNGAI_TENGAH_400_9_14_122_BAPPERIDA_2026_2_1.csv');
        }
      }
    };
    initLoad();
  }, [mode]);

  // Aggregated Analytics
  const householdStats = useMemo(() => {
    if (!householdDataset?.data) return null;
    return aggregateHouseholdData(householdDataset.data);
  }, [householdDataset]);

  const individualStats = useMemo(() => {
    if (!individualDataset?.data) return null;
    return aggregateIndividualData(individualDataset.data);
  }, [individualDataset]);

  // Filtered Table Data for Household
  const filteredHouseholdRows = useMemo(() => {
    const data = householdDataset?.data || [];
    return data.filter(r => {
      if (selectedKecamatan !== 'ALL' && (r.kecamatan || '').toUpperCase() !== selectedKecamatan.toUpperCase()) {
        return false;
      }
      if (selectedDesil !== 'ALL' && String(r.desil_nasional) !== String(selectedDesil)) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = (r.nama_anggota_keluarga || '').toLowerCase().includes(q);
        const matchKk = (r.nomor_kartu_keluarga || '').includes(q);
        const matchDesa = (r.kelurahan_desa || '').toLowerCase().includes(q);
        if (!matchName && !matchKk && !matchDesa) return false;
      }
      return true;
    });
  }, [householdDataset, selectedKecamatan, selectedDesil, searchQuery]);

  // Filtered Table Data for Individual
  const filteredIndividualRows = useMemo(() => {
    const data = individualDataset?.data || [];
    return data.filter(r => {
      if (selectedKecamatan !== 'ALL' && (r.kecamatan_ktp || '').toUpperCase() !== selectedKecamatan.toUpperCase()) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = (r.nama || '').toLowerCase().includes(q);
        const matchNik = (r.nomor_induk_kependudukan || '').includes(q);
        const matchKk = (r.nomor_kartu_keluarga || '').includes(q);
        const matchDesa = (r.kelurahan_desa_ktp || '').toLowerCase().includes(q);
        if (!matchName && !matchNik && !matchKk && !matchDesa) return false;
      }
      return true;
    });
  }, [individualDataset, selectedKecamatan, searchQuery]);

  const activeFilteredRows = mode === 'household' ? filteredHouseholdRows : filteredIndividualRows;
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return activeFilteredRows.slice(start, start + itemsPerPage);
  }, [activeFilteredRows, currentPage]);

  const totalPages = Math.ceil(activeFilteredRows.length / itemsPerPage) || 1;

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-6 border border-emerald-500/20 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-500/20 text-emerald-300 text-[11px] font-bold px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                DTSEN Kab. Hulu Sungai Tengah 2026
              </span>
              <span className="bg-emerald-600 text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                {mode === 'household' ? '👨‍👩‍👧‍👦 SET DATA KELUARGA (KK)' : '👤 SET DATA INDIVIDU (NIK)'}
              </span>
              {activeFileName && (
                <span className="bg-slate-800/80 text-slate-300 text-[11px] font-medium px-3 py-1 rounded-full border border-slate-700">
                  📄 {activeFileName}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {mode === 'household' ? 'Analisis Data Keluarga (KK)' : 'Analisis Data Individu & Kesehatan (NIK)'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {mode === 'household'
                ? 'Analisis desil kemiskinan, kepesertaan PBI JKN, indikator kelayakan perumahan, sumber air minum, dan sanitasi per keluarga.'
                : 'Analisis demografi kependudukan, status ketenagakerjaan, prevalensi penyakit kronis, dan status gizi/stunting per individu.'}
            </p>
          </div>

          {/* Data Source Selector */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => loadFromSupabase(mode)}
              disabled={loading}
              title="Refresh / Muat Ulang data dari Database Terintegrasi"
              className="px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-emerald-400 border border-emerald-500/40 font-bold text-xs shadow-md flex items-center gap-2 transition"
            >
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Muat dari Database</span>
            </button>

            {serverFiles.length > 0 && (
              <button
                onClick={() => fetchServerFiles()}
                title="Refresh Folder dtsencsv"
                className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span className="font-semibold">{loadingProgress || 'Memproses dataset...'}</span>
          </div>
        </div>
      )}

      {/* MODE 1: DATA KELUARGA (KK) */}
      {mode === 'household' && (
        <>
          {householdStats && (
            <div className="space-y-6">
              
              {/* Executive Summary Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Total KK Card */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md relative overflow-hidden group hover:border-emerald-500/50 transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Keluarga (KK)</p>
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                        {householdStats.totalKK.toLocaleString('id-ID')}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-md">
                          DTSEN HST 2026
                        </span>
                        <span className="text-[10px] text-slate-400">100% Terverifikasi</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <Home className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                {/* Desil 1 Card */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md relative overflow-hidden group hover:border-amber-500/50 transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Desil 1 (Sangat Miskin)</p>
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-1">
                        {(householdStats.desilCounts.find(d => d.name === 'Desil 1')?.count || 0).toLocaleString('id-ID')}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-md">
                          {((householdStats.desilCounts.find(d => d.name === 'Desil 1')?.count || 0) / (householdStats.totalKK || 1) * 100).toFixed(1)}%
                        </span>
                        <span className="text-[10px] text-slate-400">Prioritas Utama P3KE</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <ShieldAlert className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                {/* PBI JKN Card */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md relative overflow-hidden group hover:border-cyan-500/50 transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">Cakupan PBI JKN</p>
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-cyan-400 mt-1">
                        {((householdStats.pbiCounts.find(p => p.name === 'PBI APBN (Nasional)')?.count || 0) + (householdStats.pbiCounts.find(p => p.name === 'PBI APBD (Pemda)')?.count || 0)).toLocaleString('id-ID')}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="text-[10px] bg-cyan-500/20 text-cyan-300 font-bold px-2 py-0.5 rounded-md">
                          APBN + APBD
                        </span>
                        <span className="text-[10px] text-slate-400">Jaminan Kesehatan</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      <HeartPulse className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                {/* RTLH Card */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md relative overflow-hidden group hover:border-rose-500/50 transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">Indikasi RTLH</p>
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-rose-400 mt-1">
                        {householdStats.nonLaikHuniCount.toLocaleString('id-ID')}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="text-[10px] bg-rose-500/20 text-rose-300 font-bold px-2 py-0.5 rounded-md">
                          {((householdStats.nonLaikHuniCount / (householdStats.totalKK || 1)) * 100).toFixed(1)}%
                        </span>
                        <span className="text-[10px] text-slate-400">Rumah Tidak Layak</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      <Building2 className="w-6 h-6" />
                    </div>
                  </div>
                </div>

              </div>

              {/* Priority Recommendation Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-500/30 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Rekomendasi Kebijakan</h4>
                    <p className="text-slate-300 text-xs mt-0.5">
                      Fokuskan intervensi program bansos & bedah rumah pada kecamatan dengan konsentrasi <strong className="text-amber-400">Desil 1 terbesar</strong> ({householdStats.kecamatanData[0]?.name || 'HST'}) dan bantuan perumahan sanitasi layak.
                    </p>
                  </div>
                </div>
                <div className="shrink-0">
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold font-mono">
                    P3KE Prioritas 2026
                  </span>
                </div>
              </div>

              {/* Household Sub-Tabs Navigation */}
              <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
                {[
                  { id: 'desil', label: 'Sebaran Desil Kecamatan', icon: Layers },
                  { id: 'pbi', label: 'Jaminan Kesehatan (PBI)', icon: HeartPulse },
                  { id: 'hunian', label: 'Air Minum & Sanitasi', icon: Droplets },
                  { id: 'energi', label: 'Energi & Bahan Bakar', icon: Zap },
                  { id: 'tabel-kk', label: 'Tabel Detail & Pencarian KK', icon: Search }
                ].map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-md shadow-emerald-950/40 font-extrabold'
                          : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* TAB 1: DESIL */}
              {activeTab === 'desil' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Stacked Bar Chart */}
                    <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
                      <h3 className="text-sm font-bold text-white mb-1 flex items-center justify-between">
                        <span>Distribusi Desil Kemiskinan 1 - 4 per Kecamatan</span>
                        <span className="text-[11px] font-mono text-emerald-400">11 Kecamatan HST</span>
                      </h3>
                      <p className="text-xs text-slate-400 mb-4">
                        Klasifikasi desil 1 (sangat miskin) hingga desil 4 (rentan miskin) sesuai DTSEN.
                      </p>
                      <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={householdStats.kecamatanData} margin={{ top: 10, right: 10, left: 0, bottom: 25 }}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} interval={0} angle={-25} textAnchor="end" />
                            <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                            <Bar dataKey="desil1" name="Desil 1 (Sangat Miskin)" fill="#ef4444" stackId="a" radius={[0, 0, 0, 0]} />
                            <Bar dataKey="desil2" name="Desil 2 (Miskin)" fill="#f59e0b" stackId="a" />
                            <Bar dataKey="desil3" name="Desil 3 (Hampir Miskin)" fill="#06b6d4" stackId="a" />
                            <Bar dataKey="desil4" name="Desil 4 (Rentan)" fill="#10b981" stackId="a" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Donut Chart Proporsi */}
                    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md flex flex-col justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-white mb-1">
                          Proporsi Komposisi Desil Kabupaten
                        </h3>
                        <p className="text-xs text-slate-400">
                          Persentase pembagian desil di Kab. Hulu Sungai Tengah.
                        </p>
                      </div>
                      <div className="h-56 w-full my-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={householdStats.desilCounts} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="count">
                              {householdStats.desilCounts.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', fontSize: '12px' }} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold border-t border-slate-800 pt-3">
                        {householdStats.desilCounts.slice(0, 4).map((d, i) => (
                          <div key={d.name} className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5 text-slate-300">
                              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                              {d.name}
                            </span>
                            <span className="font-mono text-white">{d.count.toLocaleString('id-ID')}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Priority Ranking Table */}
                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
                    <h3 className="text-sm font-bold text-white mb-3 flex items-center justify-between">
                      <span>Peringkat Prioritas Kecamatan (Berdasarkan Jumlah Desil 1)</span>
                      <span className="text-xs text-slate-400">Urutan Prioritas Penanganan</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {householdStats.kecamatanData.slice(0, 3).map((kec, idx) => (
                        <div key={kec.name} className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center font-mono">
                                #{idx + 1}
                              </span>
                              <h4 className="font-bold text-white text-sm">{kec.name}</h4>
                            </div>
                            <p className="text-xs text-slate-400 mt-1">
                              Total KK: <span className="text-white font-mono">{kec.total.toLocaleString('id-ID')}</span>
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-lg font-extrabold text-amber-400 font-mono">
                              {kec.desil1.toLocaleString('id-ID')}
                            </span>
                            <p className="text-[10px] text-amber-300/80 uppercase tracking-wider font-semibold">Desil 1</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PBI JKN */}
              {activeTab === 'pbi' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
                    <h3 className="text-sm font-bold text-white mb-1">
                      Cakupan Penerima Bantuan Iuran (PBI JKN) APBN vs APBD Pemda
                    </h3>
                    <p className="text-xs text-slate-400 mb-4">
                      Distribusi perlindungan jaminan kesehatan masyarakat kurang mampu di Kab. Hulu Sungai Tengah.
                    </p>
                    <div className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={householdStats.pbiCounts} layout="vertical" margin={{ left: 20, right: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                          <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                          <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#94a3b8' }} width={140} />
                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', fontSize: '12px' }} />
                          <Bar dataKey="count" fill="#06b6d4" radius={[0, 8, 8, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white mb-1">Ringkasan Perlindungan JKN</h4>
                      <p className="text-xs text-slate-400">Status jaminan kesehatan bagi keluarga terdaftar.</p>
                    </div>
                    <div className="space-y-4 my-4">
                      {householdStats.pbiCounts.map((item, idx) => {
                        const pct = ((item.count / (householdStats.totalKK || 1)) * 100).toFixed(1);
                        return (
                          <div key={item.name} className="space-y-1">
                            <div className="flex justify-between text-xs font-semibold">
                              <span className="text-slate-300">{item.name}</span>
                              <span className="font-mono text-cyan-400">{item.count.toLocaleString('id-ID')} ({pct}%)</span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                              <div 
                                className="bg-gradient-to-r from-cyan-500 to-teal-400 h-2 rounded-full" 
                                style={{ width: `${Math.min(pct * 2, 100)}%` }} 
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-300">
                      💡 <strong>UHC HST Coverage</strong>: Pemda Kabupaten Hulu Sungai Tengah menjamin akses layanan kesehatan gratis bagi keluarga tidak mampu.
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 3: HUNIAN & SANITASI */}
              {activeTab === 'hunian' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  
                  {/* Air Minum */}
                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
                    <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-cyan-400" /> Sumber Air Minum Utama
                    </h4>
                    <p className="text-[11px] text-slate-400 mb-3">Distribusi fasilitas sumber air minum keluarga</p>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={householdStats.waterSourceData.slice(0, 6)} layout="vertical">
                          <XAxis type="number" tick={{ fontSize: 9, fill: '#94a3b8' }} />
                          <YAxis dataKey="name" type="category" tick={{ fontSize: 9, fill: '#94a3b8' }} width={120} />
                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px', fontSize: '11px' }} />
                          <Bar dataKey="count" fill="#06b6d4" radius={[0, 6, 6, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Jenis Lantai */}
                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Home className="w-4 h-4 text-emerald-400" /> Jenis Lantai Terluas
                    </h4>
                    <p className="text-[11px] text-slate-400 mb-3">Material lantai rumah (indikator kelayakan)</p>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={householdStats.floorTypeData.slice(0, 6)} layout="vertical">
                          <XAxis type="number" tick={{ fontSize: 9, fill: '#94a3b8' }} />
                          <YAxis dataKey="name" type="category" tick={{ fontSize: 9, fill: '#94a3b8' }} width={120} />
                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px', fontSize: '11px' }} />
                          <Bar dataKey="count" fill="#10b981" radius={[0, 6, 6, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Jenis Kloset / Sanitasi */}
                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-amber-400" /> Fasilitas Kloset & Sanitasi
                    </h4>
                    <p className="text-[11px] text-slate-400 mb-3">Penggunaan kloset leher angsa vs cemplung</p>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={householdStats.latrineTypeData.slice(0, 6)} layout="vertical">
                          <XAxis type="number" tick={{ fontSize: 9, fill: '#94a3b8' }} />
                          <YAxis dataKey="name" type="category" tick={{ fontSize: 9, fill: '#94a3b8' }} width={120} />
                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px', fontSize: '11px' }} />
                          <Bar dataKey="count" fill="#f59e0b" radius={[0, 6, 6, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 4: ENERGI & MEMASAK */}
              {activeTab === 'energi' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Bahan Bakar Memasak */}
                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Flame className="w-4 h-4 text-amber-400" /> Bahan Bakar Utama Memasak
                    </h4>
                    <p className="text-[11px] text-slate-400 mb-3">Penggunaan Gas LPG 3kg Subsidi vs Kayu Bakar</p>
                    <div className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={householdStats.cookingFuelData.slice(0, 6)} layout="vertical">
                          <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                          <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#94a3b8' }} width={140} />
                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px', fontSize: '11px' }} />
                          <Bar dataKey="count" fill="#f59e0b" radius={[0, 6, 6, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Jenis Dinding */}
                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
                    <h4 className="text-xs font-bold text-violet-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-violet-400" /> Jenis Dinding Terluas
                    </h4>
                    <p className="text-[11px] text-slate-400 mb-3">Ketahanan fisik konstruksi dinding rumah</p>
                    <div className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={householdStats.wallTypeData.slice(0, 6)} layout="vertical">
                          <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                          <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#94a3b8' }} width={140} />
                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px', fontSize: '11px' }} />
                          <Bar dataKey="count" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}
        </>
      )}

      {/* MODE 2: DATA INDIVIDU (NIK) */}
      {mode === 'individual' && (
        <>
          {/* Executive KPI Cards */}
          {individualStats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Total NIK */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md relative overflow-hidden group hover:border-emerald-500/50 transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Total Individu (NIK)</p>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                      {individualStats.totalIndividu.toLocaleString('id-ID')}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-md">Data DTSEN</span>
                      <span className="text-[10px] text-slate-400">Kab. HST</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <User className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Gender Ratio */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md relative overflow-hidden group hover:border-blue-500/50 transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">Laki-laki / Perempuan</p>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-blue-400 mt-1">
                      {(individualStats.genderData.find(g => g.name === 'Laki-laki')?.count || 0).toLocaleString('id-ID')}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="text-[10px] bg-pink-500/20 text-pink-300 font-bold px-2 py-0.5 rounded-md">
                        ♀ {(individualStats.genderData.find(g => g.name === 'Perempuan')?.count || 0).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Users className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Stunting */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md relative overflow-hidden group hover:border-rose-500/50 transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">Indikasi Stunting</p>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-rose-400 mt-1">
                      {individualStats.stuntingCount.toLocaleString('id-ID')}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="text-[10px] bg-rose-500/20 text-rose-300 font-bold px-2 py-0.5 rounded-md">
                        {((individualStats.stuntingCount / (individualStats.totalIndividu || 1)) * 100).toFixed(2)}%
                      </span>
                      <span className="text-[10px] text-slate-400">dari total NIK</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <HeartPulse className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Bekerja */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md relative overflow-hidden group hover:border-teal-500/50 transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-teal-400 uppercase tracking-wider">Penduduk Bekerja</p>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-teal-400 mt-1">
                      {(individualStats.workData.find(w => w.name === 'Bekerja')?.count || 0).toLocaleString('id-ID')}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="text-[10px] bg-teal-500/20 text-teal-300 font-bold px-2 py-0.5 rounded-md">
                        {(((individualStats.workData.find(w => w.name === 'Bekerja')?.count || 0) / (individualStats.totalIndividu || 1)) * 100).toFixed(1)}%
                      </span>
                      <span className="text-[10px] text-slate-400">Partisipasi Kerja</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                    <Briefcase className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rekomendasi Kebijakan Banner */}
          {individualStats && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-violet-950 to-slate-900 border border-violet-500/30 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-violet-500/20 text-violet-400 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Rekomendasi Kebijakan</h4>
                  <p className="text-slate-300 text-xs mt-0.5">
                    Fokuskan intervensi <strong className="text-rose-400">penurunan stunting</strong> dan peningkatan <strong className="text-teal-400">partisipasi kerja</strong> pada kecamatan dengan kepadatan individu DTSEN tertinggi.
                  </p>
                </div>
              </div>
              <div className="shrink-0">
                <span className="px-3 py-1.5 rounded-xl bg-violet-500/20 text-violet-300 border border-violet-500/40 text-[11px] font-bold font-mono">
                  SDGs Prioritas 2026
                </span>
              </div>
            </div>
          )}

          {/* Individual Sub-Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
            {[
              { id: 'demografi', label: 'Demografi & Gender', icon: Users },
              { id: 'pekerjaan', label: 'Ketenagakerjaan & Pendidikan', icon: Briefcase },
              { id: 'kesehatan', label: 'Kesehatan & Gizi', icon: Activity },
              { id: 'sebaran', label: 'Sebaran Kecamatan', icon: Home },
              { id: 'tabel-nik', label: 'Tabel Detail NIK', icon: Search }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                    isActive
                      ? 'bg-violet-600 text-white shadow-md shadow-violet-950/40'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: DEMOGRAFI & GENDER */}
          {activeTab === 'demografi' && individualStats && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Donut Gender */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md lg:col-span-1">
                <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-400" /> Distribusi Jenis Kelamin
                </h4>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={individualStats.genderData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="count" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`} labelLine={false}>
                        {individualStats.genderData.map((e, idx) => (
                          <Cell key={idx} fill={idx === 0 ? '#3b82f6' : '#ec4899'} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', fontSize: '11px', borderRadius: '10px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-center">
                    <p className="text-[9px] text-blue-400 font-bold uppercase">Laki-laki</p>
                    <p className="text-lg font-extrabold text-blue-300">{(individualStats.genderData.find(g => g.name === 'Laki-laki')?.count || 0).toLocaleString('id-ID')}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-pink-500/10 border border-pink-500/20 text-center">
                    <p className="text-[9px] text-pink-400 font-bold uppercase">Perempuan</p>
                    <p className="text-lg font-extrabold text-pink-300">{(individualStats.genderData.find(g => g.name === 'Perempuan')?.count || 0).toLocaleString('id-ID')}</p>
                  </div>
                </div>
              </div>

              {/* Status Stunting & Wasting */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md lg:col-span-1">
                <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-rose-400" /> Status Kondisi Gizi
                </h4>
                <div className="space-y-3 mt-4">
                  {[
                    { label: 'Normal / Tidak Terindikasi', count: individualStats.totalIndividu - individualStats.stuntingCount - individualStats.wastingCount, color: 'bg-emerald-500', textColor: 'text-emerald-400', pct: (((individualStats.totalIndividu - individualStats.stuntingCount - individualStats.wastingCount) / (individualStats.totalIndividu || 1)) * 100).toFixed(1) },
                    { label: 'Stunting (Kerdil)', count: individualStats.stuntingCount, color: 'bg-rose-500', textColor: 'text-rose-400', pct: ((individualStats.stuntingCount / (individualStats.totalIndividu || 1)) * 100).toFixed(2) },
                    { label: 'Wasting (Kurus)', count: individualStats.wastingCount, color: 'bg-amber-500', textColor: 'text-amber-400', pct: ((individualStats.wastingCount / (individualStats.totalIndividu || 1)) * 100).toFixed(2) },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-[11px] font-bold ${item.textColor}`}>{item.label}</span>
                        <span className={`text-[11px] font-mono font-bold ${item.textColor}`}>{item.count.toLocaleString('id-ID')} <span className="text-slate-500">({item.pct}%)</span></span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-800">
                        <div className={`h-2 rounded-full ${item.color} transition-all`} style={{ width: `${Math.min(parseFloat(item.pct), 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <p className="text-[10px] text-rose-300 font-semibold">⚠️ Target: Penurunan prevalensi stunting menjadi &lt;14% sesuai RPJMN 2025–2029.</p>
                </div>
              </div>

              {/* Status Pekerjaan KPI */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md lg:col-span-1">
                <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-teal-400" /> Partisipasi Angkatan Kerja
                </h4>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={individualStats.workData} cx="50%" cy="50%" outerRadius={80} dataKey="count" label={({ name, percent }) => `${(percent * 100).toFixed(1)}%`} labelLine={false}>
                        {individualStats.workData.map((e, idx) => (
                          <Cell key={idx} fill={idx === 0 ? '#14b8a6' : '#64748b'} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', fontSize: '11px', borderRadius: '10px' }} />
                      <Legend wrapperStyle={{ fontSize: '10px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 mt-2">
                  <p className="text-[10px] text-teal-300 font-semibold">🎯 Individu tidak bekerja mencakup IRT, pelajar, dan pengangguran.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: KETENAGAKERJAAN & PENDIDIKAN */}
          {activeTab === 'pekerjaan' && individualStats && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Status Bekerja Bar */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
                <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-teal-400" /> Proporsi Status Bekerja
                </h4>
                <div className="space-y-4 mt-2">
                  {individualStats.workData.map((w, i) => {
                    const pct = ((w.count / (individualStats.totalIndividu || 1)) * 100).toFixed(1);
                    const colors = ['text-teal-400 bg-teal-500/10 border-teal-500/20', 'text-slate-400 bg-slate-800 border-slate-700'];
                    const barColors = ['bg-teal-500', 'bg-slate-600'];
                    return (
                      <div key={i}>
                        <div className="flex justify-between items-center mb-1.5">
                          <div className={`flex items-center gap-2 px-2.5 py-1 rounded-lg border text-[11px] font-bold ${colors[i]}`}>
                            <span>{w.name}</span>
                          </div>
                          <span className="text-sm font-extrabold text-white">{w.count.toLocaleString('id-ID')} <span className="text-xs text-slate-500">({pct}%)</span></span>
                        </div>
                        <div className="h-3 rounded-full bg-slate-800">
                          <div className={`h-3 rounded-full ${barColors[i]} transition-all`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-5 grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-center">
                    <p className="text-[9px] text-teal-400 font-bold uppercase mb-1">Tingkat Partisipasi</p>
                    <p className="text-xl font-extrabold text-teal-300">
                      {(((individualStats.workData.find(w => w.name === 'Bekerja')?.count || 0) / (individualStats.totalIndividu || 1)) * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center">
                    <p className="text-[9px] text-rose-400 font-bold uppercase mb-1">Non-Aktif Ekonomi</p>
                    <p className="text-xl font-extrabold text-rose-300">
                      {(((individualStats.workData.find(w => w.name !== 'Bekerja')?.count || 0) / (individualStats.totalIndividu || 1)) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Penyakit Kronis Top 10 */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
                <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-violet-400" /> Penyakit Kronis Terdeteksi (Top 10)
                </h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={individualStats.diseaseData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 9, fill: '#94a3b8' }} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 9, fill: '#94a3b8' }} width={120} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', fontSize: '11px', borderRadius: '10px' }} />
                      <Bar dataKey="count" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: KESEHATAN & GIZI */}
          {activeTab === 'kesehatan' && individualStats && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Penyakit Kronis Bar Chart */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
                <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-violet-400" /> Prevalensi Penyakit Kronis (Top 10)
                </h4>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={individualStats.diseaseData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="name" tick={{ fontSize: 8, fill: '#94a3b8' }} interval={0} angle={-30} textAnchor="end" height={60} />
                      <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', fontSize: '11px', borderRadius: '10px' }} />
                      <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Stunting & Wasting Detail */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
                <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-rose-400" /> Situasi Gizi Balita
                </h4>
                <div className="space-y-4 mt-2">
                  {[
                    { label: 'Stunting (Kerdil)', desc: 'Tinggi badan di bawah -2 SD', count: individualStats.stuntingCount, pct: ((individualStats.stuntingCount / (individualStats.totalIndividu || 1)) * 100).toFixed(2), color: 'rose' },
                    { label: 'Wasting (Kurus)', desc: 'Berat badan di bawah -2 SD', count: individualStats.wastingCount, pct: ((individualStats.wastingCount / (individualStats.totalIndividu || 1)) * 100).toFixed(2), color: 'amber' },
                    { label: 'Normal / Sehat', desc: 'Status gizi baik', count: individualStats.totalIndividu - individualStats.stuntingCount - individualStats.wastingCount, pct: (((individualStats.totalIndividu - individualStats.stuntingCount - individualStats.wastingCount) / (individualStats.totalIndividu || 1)) * 100).toFixed(1), color: 'emerald' },
                  ].map((item, i) => (
                    <div key={i} className={`p-4 rounded-xl bg-${item.color}-500/10 border border-${item.color}-500/20`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className={`text-sm font-extrabold text-${item.color}-400`}>{item.label}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{item.desc}</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-2xl font-extrabold text-${item.color}-300`}>{item.count.toLocaleString('id-ID')}</p>
                          <p className={`text-[10px] font-bold text-${item.color}-400`}>{item.pct}%</p>
                        </div>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-800 mt-3">
                        <div className={`h-1.5 rounded-full bg-${item.color}-500`} style={{ width: `${Math.min(parseFloat(item.pct), 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SEBARAN KECAMATAN */}
          {activeTab === 'sebaran' && individualStats && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Bar Chart sebaran */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
                <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Home className="w-4 h-4 text-emerald-400" /> Jumlah Individu per Kecamatan (KTP)
                </h4>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[...individualStats.kecKtpData].sort((a, b) => b.count - a.count)}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="name" tick={{ fontSize: 8, fill: '#94a3b8' }} interval={0} angle={-30} textAnchor="end" height={65} />
                      <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', fontSize: '11px', borderRadius: '10px' }} />
                      <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Ranking List */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
                <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" /> Peringkat Kecamatan (Jumlah Individu DTSEN)
                </h4>
                <div className="space-y-2 overflow-y-auto max-h-72">
                  {[...individualStats.kecKtpData]
                    .sort((a, b) => b.count - a.count)
                    .map((kec, i) => {
                      const maxCount = Math.max(...individualStats.kecKtpData.map(k => k.count));
                      const pct = ((kec.count / maxCount) * 100).toFixed(0);
                      const rankColors = ['text-amber-400', 'text-slate-300', 'text-amber-600'];
                      return (
                        <div key={kec.name} className="flex items-center gap-3 p-2 rounded-xl bg-slate-800/60 border border-slate-700/50 hover:border-emerald-500/30 transition">
                          <span className={`text-xs font-extrabold w-6 text-center ${i < 3 ? rankColors[i] : 'text-slate-500'}`}>#{i + 1}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-200 truncate">{kec.name}</p>
                            <div className="h-1.5 rounded-full bg-slate-700 mt-1">
                              <div className="h-1.5 rounded-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                          <span className="text-xs font-mono font-bold text-emerald-400 shrink-0">{kec.count.toLocaleString('id-ID')}</span>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* FILTERABLE DATA TABLE EXPLORER (COMMON TO BOTH MODES) */}
      {(activeTab === 'tabel-kk' || activeTab === 'tabel-nik') && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder={mode === 'household' ? "Cari Nama KK / No. KK / Desa..." : "Cari Nama / NIK / No. KK / Desa..."}
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <select
                value={selectedKecamatan}
                onChange={(e) => { setSelectedKecamatan(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
              >
                <option value="ALL">Semua Kecamatan</option>
                {(mode === 'household' ? householdStats?.kecamatanData : individualStats?.kecKtpData)?.map(k => {
                  const kecName = typeof k === 'string' ? k : k.name;
                  return <option key={kecName} value={kecName}>{kecName}</option>;
                })}
              </select>

              {mode === 'household' && (
                <select
                  value={selectedDesil}
                  onChange={(e) => { setSelectedDesil(e.target.value); setCurrentPage(1); }}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                >
                  <option value="ALL">Semua Desil</option>
                  <option value="1">Desil 1 (Sangat Miskin)</option>
                  <option value="2">Desil 2 (Miskin)</option>
                  <option value="3">Desil 3 (Hampir Miskin)</option>
                  <option value="4">Desil 4 (Rentan)</option>
                </select>
              )}
            </div>

            <div className="text-xs text-slate-500 font-semibold shrink-0">
              Menampilkan {activeFilteredRows.length.toLocaleString('id-ID')} entri
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                  {mode === 'household' ? (
                    <tr>
                      <th className="p-3">No. KK</th>
                      <th className="p-3">Kepala Keluarga</th>
                      <th className="p-3">Kecamatan</th>
                      <th className="p-3">Kelurahan / Desa</th>
                      <th className="p-3">Desil</th>
                      <th className="p-3">PBI JKN</th>
                      <th className="p-3">Air Minum</th>
                      <th className="p-3">Jenis Lantai</th>
                    </tr>
                  ) : (
                    <tr>
                      <th className="p-3">NIK</th>
                      <th className="p-3">No. KK</th>
                      <th className="p-3">Nama Anggota</th>
                      <th className="p-3">Hub. Keluarga</th>
                      <th className="p-3">Gender</th>
                      <th className="p-3">Status Kawin</th>
                      <th className="p-3">Pekerjaan</th>
                      <th className="p-3">Pendidikan</th>
                      <th className="p-3">Gizi / Stunting</th>
                      <th className="p-3">PBI Status</th>
                      <th className="p-3">Kecamatan KTP</th>
                      <th className="p-3">Desa KTP</th>
                    </tr>
                  )}
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {mode === 'household' ? (
                    paginatedRows.map((r, i) => {
                      const desilNum = parseInt(r.desil_nasional, 10);
                      return (
                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                          <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">{r.nomor_kartu_keluarga}</td>
                          <td className="p-3 font-bold text-slate-900 dark:text-white">{r.nama_anggota_keluarga}</td>
                          <td className="p-3 font-semibold">{r.kecamatan}</td>
                          <td className="p-3 text-slate-500 dark:text-slate-400">{r.kelurahan_desa}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              desilNum === 1 ? 'bg-red-500/20 text-red-500 border border-red-500/30' :
                              desilNum === 2 ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' :
                              desilNum === 3 ? 'bg-cyan-500/20 text-cyan-500 border border-cyan-500/30' :
                              'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
                            }`}>
                              Desil {desilNum}
                            </span>
                          </td>
                          <td className="p-3">
                            {r.pbi_nas === '1' ? <span className="text-teal-600 dark:text-teal-400 font-bold">PBI APBN</span> :
                             r.pbi_pemda === '1' ? <span className="text-blue-600 dark:text-blue-400 font-bold">PBI APBD</span> :
                             <span className="text-slate-400">Non-PBI</span>}
                          </td>
                          <td className="p-3 text-[11px]">{METADATA_DICTIONARIES.sumber_air_minum_utama[parseInt(r.sumber_air_minum_utama, 10)] || r.sumber_air_minum_utama}</td>
                          <td className="p-3 text-[11px]">{METADATA_DICTIONARIES.jenis_lantai_terluas[parseInt(r.jenis_lantai_terluas, 10)] || r.jenis_lantai_terluas}</td>
                        </tr>
                      );
                    })
                  ) : (
                    paginatedRows.map((r, i) => (
                      <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition text-[11px]">
                        <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">{r.nomor_induk_kependudukan}</td>
                        <td className="p-3 font-mono text-slate-400">{r.nomor_kartu_keluarga}</td>
                        <td className="p-3 font-bold text-slate-900 dark:text-white">{r.nama}</td>
                        <td className="p-3">{METADATA_DICTIONARIES.status_hubungan_keluarga?.[parseInt(r.status_hubungan_keluarga, 10)] || r.status_hubungan_keluarga}</td>
                        <td className="p-3">{r.jenis_kelamin === '1' ? 'Laki-laki' : 'Perempuan'}</td>
                        <td className="p-3">{METADATA_DICTIONARIES.status_kawin?.[parseInt(r.status_kawin, 10)] || r.status_kawin}</td>
                        <td className="p-3 font-semibold">{r.status_bekerja === '1' ? 'Bekerja' : 'Tidak Bekerja'}</td>
                        <td className="p-3">{METADATA_DICTIONARIES.ijazah_tertinggi_yang_dimiliki?.[parseInt(r.ijazah_tertinggi_yang_dimiliki, 10)] || r.ijazah_tertinggi_yang_dimiliki}</td>
                        <td className="p-3">
                          {r.kondisi_gizi === '2' ? <span className="text-rose-500 font-bold">Stunting</span> :
                           r.kondisi_gizi === '1' ? <span className="text-amber-500 font-bold">Wasting</span> :
                           <span className="text-slate-400">Normal</span>}
                        </td>
                        <td className="p-3">
                          {r.pbi_nas === '1' ? <span className="text-teal-600 dark:text-teal-400 font-bold">PBI APBN</span> :
                           r.pbi_pemda === '1' ? <span className="text-blue-600 dark:text-blue-400 font-bold">PBI APBD</span> :
                           <span className="text-slate-400">Non-PBI</span>}
                        </td>
                        <td className="p-3 font-semibold">{r.kecamatan_ktp}</td>
                        <td className="p-3 text-slate-500 dark:text-slate-400">{r.kelurahan_desa_ktp}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Halaman {currentPage} dari {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 disabled:opacity-40 font-semibold"
                >
                  Sebelumnya
                </button>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 disabled:opacity-40 font-semibold"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
