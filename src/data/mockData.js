// Data Komprehensif Satu Data Kabupaten Hulu Sungai Tengah (#HST_MURAKATA)
import { hstKabupatenBoundary as shpHstBoundary, kecamatanPolygonData } from './hstBoundaryData.js';

export const hstInfo = {
  nama: "Kabupaten Hulu Sungai Tengah",
  motto: "MURAKATA (Mufakat Rakat Seia Sekata)",
  ibuKota: "Barabai",
  provinsi: "Kalimantan Selatan",
  tagline: "#HST_MURAKATA",
  subTagline: "Sistem Informasi Pengelolaan Data Pembangunan Daerah yang Modern, Terintegrasi, dan Terpercaya",
  luasWilayah: "1.472 km²",
  jumlahKecamatan: 11,
  jumlahDesaKelurahan: "169 Desa / 8 Kelurahan",
  jumlahPenduduk: "265.412 Jiwa",
  logoUrl: "/logo.png"
};

export const macroStats = {
  ipm: {
    value: "72.84",
    unit: "Poin",
    change: "+0.68",
    trend: "up",
    label: "Indeks Pembangunan Manusia (IPM)",
    description: "Kategori Tinggi, meningkat dari 72.16 tahun sebelumnya"
  },
  pertumbuhanEkonomi: {
    value: "5.14%",
    unit: "YoY",
    change: "+0.32%",
    trend: "up",
    label: "Pertumbuhan Ekonomi",
    description: "Didorong sektor pertanian, perdagangan, dan ekowisata"
  },
  kemiskinan: {
    value: "5.82%",
    unit: "Persen",
    change: "-0.41%",
    trend: "down-good",
    label: "Tingkat Kemiskinan",
    description: "Salah satu angka kemiskinan terendah di kawasan Banua Enam"
  },
  inflasi: {
    value: "2.15%",
    unit: "YoY",
    change: "Stabil",
    trend: "stable",
    label: "Tingkat Inflasi Daerah",
    description: "Terkendali melalui program Pasar Murah & TPID HST"
  },
  tpt: {
    value: "3.21%",
    unit: "Persen",
    change: "-0.25%",
    trend: "down-good",
    label: "Pengangguran Terbuka (TPT)",
    description: "Penyerapan tenaga kerja di sektor UMKM & Pertanian"
  },
  pdrb: {
    value: "9.85",
    unit: "Triliun Rp",
    change: "+6.2%",
    trend: "up",
    label: "PDRB Atas Dasar Harga Berlaku",
    description: "Kontribusi terbesar dari Sektor Pertanian & Jasa"
  }
};

// Historical timeline for the 8 Macro Indicators (2019-2025)
export const macroTimelineData = [
  {
    tahun: "2019",
    kemiskinan: 6.22,
    pertumbuhan: 4.85,
    tpt: 3.82,
    ipm: 68.80,
    pdrbKapita: 31.2,
    gini: 0.324,
    iklh: 68.5,
    grk: 2.1
  },
  {
    tahun: "2020",
    kemiskinan: 6.42,
    pertumbuhan: -1.75,
    tpt: 4.12,
    ipm: 69.45,
    pdrbKapita: 29.8,
    gini: 0.328,
    iklh: 69.2,
    grk: 2.5
  },
  {
    tahun: "2021",
    kemiskinan: 6.25,
    pertumbuhan: 3.25,
    tpt: 3.90,
    ipm: 70.12,
    pdrbKapita: 32.5,
    gini: 0.322,
    iklh: 70.8,
    grk: 3.2
  },
  {
    tahun: "2022",
    kemiskinan: 6.08,
    pertumbuhan: 4.12,
    tpt: 3.65,
    ipm: 71.04,
    pdrbKapita: 34.8,
    gini: 0.318,
    iklh: 71.5,
    grk: 3.8
  },
  {
    tahun: "2023",
    kemiskinan: 5.95,
    pertumbuhan: 4.35,
    tpt: 3.42,
    ipm: 71.80,
    pdrbKapita: 37.2,
    gini: 0.315,
    iklh: 72.3,
    grk: 4.5
  },
  {
    tahun: "2024",
    kemiskinan: 5.89,
    pertumbuhan: 4.80,
    tpt: 3.30,
    ipm: 72.16,
    pdrbKapita: 39.5,
    gini: 0.312,
    iklh: 73.1,
    grk: 5.2
  },
  {
    tahun: "2025",
    kemiskinan: 5.82,
    pertumbuhan: 5.14,
    tpt: 3.21,
    ipm: 72.84,
    pdrbKapita: 41.8,
    gini: 0.310,
    iklh: 74.0,
    grk: 6.0
  }
];

export const kecamatanList = [
  {
    id: 1,
    nama: "Barabai",
    ibuKota: "Barabai",
    populasi: 54230,
    luas: 40.85,
    desaCount: 14,
    faskes: 12,
    sekolah: 42,
    lat: -2.5833,
    lng: 115.3833,
    deskripsi: "Pusat pemerintahan, perdagangan, serta pusat jasa utama Kabupaten Hulu Sungai Tengah.",
    kategori: "Pusat Perkotaan",
    statusData: "100% Terverifikasi",
    color: "#93c5fd",
    polygon: kecamatanPolygonData["Barabai"] || []
  },
  {
    id: 2,
    nama: "Batu Benawa",
    ibuKota: "Pagat",
    populasi: 20150,
    luas: 55.40,
    desaCount: 14,
    faskes: 5,
    sekolah: 18,
    lat: -2.6333,
    lng: 115.4167,
    deskripsi: "Kawasan destinasi ekowisata Pagat, bukit batu benawa, dan aliran sungai benawa yang jernih.",
    kategori: "Pariwisata & Pertanian",
    statusData: "98% Terverifikasi",
    color: "#fdba74",
    polygon: kecamatanPolygonData["Batu Benawa"] || []
  },
  {
    id: 3,
    nama: "Hantakan",
    ibuKota: "Hantakan",
    populasi: 13420,
    luas: 212.50,
    desaCount: 12,
    faskes: 4,
    sekolah: 15,
    lat: -2.6667,
    lng: 115.4833,
    deskripsi: "Gerbang Pegunungan Meratus dengan potensi Ekowisata Nateh, arung jeram, dan konservasi alam.",
    kategori: "Pegunungan & Ekowisata",
    statusData: "95% Terverifikasi",
    color: "#d8b4fe",
    polygon: kecamatanPolygonData["Hantakan"] || []
  },
  {
    id: 4,
    nama: "Haruyan",
    ibuKota: "Haruyan",
    populasi: 22180,
    luas: 104.20,
    desaCount: 17,
    faskes: 6,
    sekolah: 22,
    lat: -2.6167,
    lng: 115.3000,
    deskripsi: "Sentra perkebunan karet, kelapa sawit, serta situs sejarah dan kerajinan tradisional.",
    kategori: "Perkebunan & Pertanian",
    statusData: "96% Terverifikasi",
    color: "#fed7aa",
    polygon: kecamatanPolygonData["Haruyan"] || []
  },
  {
    id: 5,
    nama: "Labuan Amas Selatan",
    ibuKota: "Pantai Hambawang",
    populasi: 31400,
    luas: 97.60,
    desaCount: 18,
    faskes: 8,
    sekolah: 28,
    lat: -2.5333,
    lng: 115.3167,
    deskripsi: "Kawasan transit perdagangan utama menghubungkan wilayah Banua Enam (Pantai Hambawang).",
    kategori: "Perdagangan & Transit",
    statusData: "99% Terverifikasi",
    color: "#fda4af",
    polygon: kecamatanPolygonData["Labuan Amas Selatan"] || []
  },
  {
    id: 6,
    nama: "Labuan Amas Utara",
    ibuKota: "Kasarangan",
    populasi: 28900,
    luas: 170.80,
    desaCount: 16,
    faskes: 7,
    sekolah: 25,
    lat: -2.4667,
    lng: 115.2833,
    deskripsi: "Lahan rawa lebak produktif untuk pertanian padi dan budidaya perikanan air tawar.",
    kategori: "Pertanian & Perikanan Rawa",
    statusData: "94% Terverifikasi",
    color: "#bef264",
    polygon: kecamatanPolygonData["Labuan Amas Utara"] || []
  },
  {
    id: 7,
    nama: "Batang Alai Selatan",
    ibuKota: "Birayang",
    populasi: 24650,
    luas: 88.90,
    desaCount: 19,
    faskes: 6,
    sekolah: 24,
    lat: -2.5667,
    lng: 115.4500,
    deskripsi: "Pasar tradisional Birayang, penghasil sayur hortikultura dan hortikultura unggulan HST.",
    kategori: "Pertanian & Hortikultura",
    statusData: "97% Terverifikasi",
    color: "#99f6e4",
    polygon: kecamatanPolygonData["Batang Alai Selatan"] || []
  },
  {
    id: 8,
    nama: "Batang Alai Timur",
    ibuKota: "Datar Ajab",
    populasi: 7890,
    luas: 480.30,
    desaCount: 11,
    faskes: 3,
    sekolah: 10,
    lat: -2.5500,
    lng: 115.6000,
    deskripsi: "Kawasan Hutan Rimba Meratus, permukiman adat Dayak Meratus, dan perlindungan keanekaragaman hayati.",
    kategori: "Konservasi & Adat Meratus",
    statusData: "91% Terverifikasi",
    color: "#fde68a",
    polygon: kecamatanPolygonData["Batang Alai Timur"] || []
  },
  {
    id: 9,
    nama: "Batang Alai Utara",
    ibuKota: "Ilung",
    populasi: 18900,
    luas: 64.20,
    desaCount: 14,
    faskes: 5,
    sekolah: 17,
    lat: -2.4833,
    lng: 115.4333,
    deskripsi: "Sentra lumbung padi beras lokal (Varietas Siam/Lokal Murakata) beririgasi teknis.",
    kategori: "Lumbung Padi Utama",
    statusData: "98% Terverifikasi",
    color: "#86efac",
    polygon: kecamatanPolygonData["Batang Alai Utara"] || []
  },
  {
    id: 10,
    nama: "Limpasu",
    ibuKota: "Limpasu",
    populasi: 11450,
    luas: 61.50,
    desaCount: 9,
    faskes: 3,
    sekolah: 12,
    lat: -2.4333,
    lng: 115.4500,
    deskripsi: "Kecamatan penghasil produk perkebunan dan peternakan lokal yang terus berkembang.",
    kategori: "Perkebunan & Peternakan",
    statusData: "95% Terverifikasi",
    color: "#a5f3fc",
    polygon: kecamatanPolygonData["Limpasu"] || []
  },
  {
    id: 11,
    nama: "Pandawan",
    ibuKota: "Pandawan",
    populasi: 32042,
    luas: 86.10,
    desaCount: 21,
    faskes: 8,
    sekolah: 30,
    lat: -2.5167,
    lng: 115.3500,
    deskripsi: "Daerah tangkapan ikan rawa, produksi kerajinan anyaman purun, dan pertanian sawah.",
    kategori: "Pertanian & Kerajinan Rakyat",
    statusData: "97% Terverifikasi",
    color: "#fecdd3",
    polygon: kecamatanPolygonData["Pandawan"] || []
  }
];

// Official Boundary of Kabupaten Hulu Sungai Tengah from ADMINISTRASI_AR.shp
export const hstKabupatenBoundary = shpHstBoundary;

// Official 37 Perangkat Daerah (PD / OPD) Kabupaten Hulu Sungai Tengah
export const hstOpds = [
  { id: "OPD-01", nama: "Sekretariat Daerah", kelompok: "Sekretariat" },
  { id: "OPD-02", nama: "Sekretariat Dewan Perwakilan Rakyat Daerah", kelompok: "Sekretariat" },
  { id: "OPD-03", nama: "Inspektorat", kelompok: "Inspektorat" },
  { id: "OPD-04", nama: "Badan Perencanaan Pembangunan, Riset dan Inovasi Daerah (Bapperida)", kelompok: "Badan" },
  { id: "OPD-05", nama: "Badan Kepegawaian dan Pengembangan Sumber Daya Manusia Daerah (BKPSDM)", kelompok: "Badan" },
  { id: "OPD-06", nama: "Badan Pengelola Keuangan dan Pendapatan Daerah (BPKPD)", kelompok: "Badan" },
  { id: "OPD-07", nama: "Badan Kesatuan Bangsa dan Politik (Bakesbangpol)", kelompok: "Badan" },
  { id: "OPD-08", nama: "Dinas Pendidikan", kelompok: "Dinas" },
  { id: "OPD-09", nama: "Dinas Pemuda Olahraga, Kebudayaan, Pariwisata dan Ekonomi Kreatif (Dinporapar)", kelompok: "Dinas" },
  { id: "OPD-10", nama: "Dinas Kesehatan", kelompok: "Dinas" },
  { id: "OPD-11", nama: "Dinas Sosial, Pengendalian Penduduk, Keluarga Berencana, Pemberdayaan Perempuan dan Perlindungan Anak (Dinsos PPKB PPPA)", kelompok: "Dinas" },
  { id: "OPD-12", nama: "Dinas Kependudukan, dan Pencatatan Sipil (Disdukcapil)", kelompok: "Dinas" },
  { id: "OPD-13", nama: "Dinas Pemberdayaan Masyarakat dan Desa (DPMD)", kelompok: "Dinas" },
  { id: "OPD-14", nama: "Satuan Polisi Pamong Praja (Satpol PP)", kelompok: "Dinas" },
  { id: "OPD-15", nama: "Dinas Penanaman Modal dan Pelayanan Terpadu Satu Pintu (DPMPTSP)", kelompok: "Dinas" },
  { id: "OPD-16", nama: "Dinas Perdagangan", kelompok: "Dinas" },
  { id: "OPD-17", nama: "Dinas Perindustrian, Tenaga Kerja, Koperasi dan Usaha Mikro Kecil dan Menengah (Disperinakerkop UMKM)", kelompok: "Dinas" },
  { id: "OPD-18", nama: "Dinas Komunikasi, Informatika, Statistik dan Persandian (Diskominfo)", kelompok: "Dinas" },
  { id: "OPD-19", nama: "Dinas Pekerjaan Umum dan Penataan Ruang (PUPR)", kelompok: "Dinas" },
  { id: "OPD-20", nama: "Dinas Perumahan Rakyat, Kawasan Pemukiman dan Pertanahan (Disperkim)", kelompok: "Dinas" },
  { id: "OPD-21", nama: "Dinas Pertanian", kelompok: "Dinas" },
  { id: "OPD-22", nama: "Dinas Ketahanan Pangan dan Perikanan (DKPP)", kelompok: "Dinas" },
  { id: "OPD-23", nama: "Dinas Lingkungan Hidup (DLH)", kelompok: "Dinas" },
  { id: "OPD-24", nama: "Dinas Perhubungan (Dishub)", kelompok: "Dinas" },
  { id: "OPD-25", nama: "Dinas Perpustakaan dan Kearsipan (Dispersip)", kelompok: "Dinas" },
  { id: "OPD-26", nama: "Kecamatan Barabai", kelompok: "Kecamatan" },
  { id: "OPD-27", nama: "Kecamatan Batu Benawa", kelompok: "Kecamatan" },
  { id: "OPD-28", nama: "Kecamatan Hantakan", kelompok: "Kecamatan" },
  { id: "OPD-29", nama: "Kecamatan Batang Alai Selatan", kelompok: "Kecamatan" },
  { id: "OPD-30", nama: "Kecamatan Limpasu", kelompok: "Kecamatan" },
  { id: "OPD-31", nama: "Kecamatan Batang Alai Timur", kelompok: "Kecamatan" },
  { id: "OPD-32", nama: "Kecamatan Batang Alai Utara", kelompok: "Kecamatan" },
  { id: "OPD-33", nama: "Kecamatan Pandawan", kelompok: "Kecamatan" },
  { id: "OPD-34", nama: "Kecamatan Labuan Amas Utara", kelompok: "Kecamatan" },
  { id: "OPD-35", nama: "Kecamatan Labuan Amas Selatan", kelompok: "Kecamatan" },
  { id: "OPD-36", nama: "Kecamatan Haruyan", kelompok: "Kecamatan" },
  { id: "OPD-37", nama: "RSUD Damanhuri", kelompok: "Lainnya" }
];

export const eWalidataDatasets = [
  {
    id: "DS-HST-001",
    namaDataset: "Statistik Produksi Padi dan Palawija per Kecamatan Tahun 2024-2025",
    opd: "Dinas Pertanian",
    kategori: "Pertanian & Pangan",
    tahun: "2025",
    format: "XLSX, CSV, JSON",
    status: "Terverifikasi",
    tanggalUpdate: "18 Juli 2026",
    walidata: "Dinas Komunikasi, Informatika, Statistik dan Persandian (Diskominfo)",
    downloadCount: 412
  },
  {
    id: "DS-HST-002",
    namaDataset: "Data Sebaran Fasilitas Kesehatan & Tenaga Medis Puskesmas HST",
    opd: "Dinas Kesehatan",
    kategori: "Kesehatan",
    tahun: "2025",
    format: "CSV, GeoJSON",
    status: "Terverifikasi",
    tanggalUpdate: "15 Juli 2026",
    walidata: "Dinas Komunikasi, Informatika, Statistik dan Persandian (Diskominfo)",
    downloadCount: 328
  },
  {
    id: "DS-HST-003",
    namaDataset: "Profil Kemiskinan Ekstrem & Data Penerima Bansos PKH/BPNT",
    opd: "Dinas Sosial, Pengendalian Penduduk, Keluarga Berencana, Pemberdayaan Perempuan dan Perlindungan Anak (Dinsos PPKB PPPA)",
    kategori: "Social & Kemiskinan",
    tahun: "2025",
    format: "XLSX",
    status: "Diperiksa Walidata",
    tanggalUpdate: "20 Juli 2026",
    walidata: "Badan Perencanaan Pembangunan, Riset dan Inovasi Daerah (Bapperida)",
    downloadCount: 189
  },
  {
    id: "DS-HST-004",
    namaDataset: "Laporan Realisasi Fisik & Keuangan Anggaran APBD HST Q2 2026",
    opd: "Badan Pengelola Keuangan dan Pendapatan Daerah (BPKPD)",
    kategori: "Keuangan Daerah",
    tahun: "2026",
    format: "PDF, XLSX",
    status: "Terverifikasi",
    tanggalUpdate: "21 Juli 2026",
    walidata: "Dinas Komunikasi, Informatika, Statistik dan Persandian (Diskominfo)",
    downloadCount: 560
  },
  {
    id: "DS-HST-005",
    namaDataset: "Inventarisasi Kawasan Hutan & Ekowisata Pegunungan Meratus",
    opd: "Dinas Lingkungan Hidup (DLH)",
    kategori: "Lingkungan & Kehutanan",
    tahun: "2025",
    format: "GeoJSON, KML",
    status: "Terverifikasi",
    tanggalUpdate: "10 Juli 2026",
    walidata: "Badan Perencanaan Pembangunan, Riset dan Inovasi Daerah (Bapperida)",
    downloadCount: 275
  },
  {
    id: "DS-HST-006",
    namaDataset: "Jumlah Sekolah, Ruang Kelas, dan Angka Putus Sekolah SD/SMP",
    opd: "Dinas Pendidikan",
    kategori: "Pendidikan",
    tahun: "2025",
    format: "XLSX",
    status: "Terverifikasi",
    tanggalUpdate: "12 Juni 2026",
    walidata: "Dinas Komunikasi, Informatika, Statistik dan Persandian (Diskominfo)",
    downloadCount: 310
  },
  {
    id: "DS-HST-007",
    namaDataset: "Daftar Perizinan Usaha OSS & Investasi PMDN/PMA Terdaftar",
    opd: "Dinas Penanaman Modal dan Pelayanan Terpadu Satu Pintu (DPMPTSP)",
    kategori: "Investasi & Perizinan",
    tahun: "2026",
    format: "XLSX, CSV",
    status: "Draft OPD",
    tanggalUpdate: "21 Juli 2026",
    walidata: "Dinas Komunikasi, Informatika, Statistik dan Persandian (Diskominfo)",
    downloadCount: 94
  }
];

// APBD 2026 precise data matching mockup screenshots adjusted to HST subdivisions
export const apbdData = {
  tahun: "2026",
  totalPaguBelanja: 1492213415758,
  totalRealisasiBelanja: 402140380529,
  persentaseRealisasiBelanja: 26.95,
  
  totalPaguPendapatan: 1466185093206,
  totalRealisasiPendapatan: 540362766610,
  persentaseRealisasiPendapatan: 36.86,

  // Belanja per OPD list matching the mockup (Realisasi & Pagu) with HST OPDs
  belanjaOpd: [
    { no: 1, nama: "Bagian Kesejahteraan Rakyat (Setda HST)", realisasi: 11536702870, pagu: 22380891910, persen: 51.55 },
    { no: 2, nama: "Kecamatan Hantakan", realisasi: 944754421, pagu: 1886970722, persen: 50.07 },
    { no: 3, nama: "Badan Perencanaan Pembangunan, Riset dan Inovasi Daerah (Bapperida)", realisasi: 1979463894, pagu: 4122958762, persen: 48.01 },
    { no: 4, nama: "Kecamatan Batu Benawa", realisasi: 1552969516, pagu: 3236037472, persen: 47.99 },
    { no: 5, nama: "Bagian Kerjasama (Setda HST)", realisasi: 356534000, pagu: 750000000, persen: 47.54 },
    { no: 6, nama: "Bagian Protokoler dan Komunikasi Pimpinan (Setda HST)", realisasi: 530692700, pagu: 1123487700, persen: 47.24 },
    { no: 7, nama: "Dinas Lingkungan Hidup (DLH)", realisasi: 2165618490, pagu: 4721631310, persen: 45.87 },
    { no: 8, nama: "Bagian Perencanaan dan Keuangan (Setda HST)", realisasi: 7000548299, pagu: 15408937654, persen: 45.43 },
    { no: 9, nama: "Dinas Kesehatan", realisasi: 42150340200, pagu: 95400980000, persen: 44.18 },
    { no: 10, nama: "Dinas Pendidikan", realisasi: 65120340000, pagu: 154200850000, persen: 42.23 },
    { no: 11, nama: "RSUD Damanhuri", realisasi: 12045600000, pagu: 30000000000, persen: 40.15 },
    { no: 12, nama: "Inspektorat", realisasi: 320490000, pagu: 823050000, persen: 38.94 },
    { no: 13, nama: "Kecamatan Barabai", realisasi: 1845600000, pagu: 4890000000, persen: 37.74 },
    { no: 14, nama: "Dinas Pekerjaan Umum dan Penataan Ruang (PUPR)", realisasi: 85400900000, pagu: 238490000000, persen: 35.81 },
    { no: 15, nama: "Dinas Perhubungan (Dishub)", realisasi: 3120400000, pagu: 9240800000, persen: 33.77 }
  ],

  // Pendapatan per OPD list matching the mockup (Realisasi & Pagu) with HST OPDs
  pendapatanOpd: [
    { no: 1, nama: "Badan Pengelola Keuangan dan Pendapatan Daerah (BPKPD)", realisasi: 533446358999, pagu: 1337210593206, persen: 39.89 },
    { no: 2, nama: "Dinas Pemuda Olahraga, Kebudayaan, Pariwisata dan Ekonomi Kreatif (Dinporapar)", realisasi: 84540000, pagu: 250000000, persen: 33.82 },
    { no: 3, nama: "Dinas Perindustrian, Tenaga Kerja, Koperasi dan UMKM", realisasi: 221684939, pagu: 750000000, persen: 29.56 },
    { no: 4, nama: "RSUD Damanhuri", realisasi: 6047643691, pagu: 23000000000, persen: 26.29 },
    { no: 5, nama: "Dinas Perhubungan (Dishub)", realisasi: 287954000, pagu: 2500000000, persen: 11.52 },
    { no: 6, nama: "Dinas Ketahanan Pangan dan Perikanan (DKPP)", realisasi: 3395000, pagu: 100000000, persen: 3.40 }
  ],

  trenPdrb: [
    { tahun: "2020", pdrb: 7.82, ipm: 69.45, kemiskinan: 6.42 },
    { tahun: "2021", pdrb: 8.21, ipm: 70.12, kemiskinan: 6.25 },
    { tahun: "2022", pdrb: 8.75, ipm: 71.04, kemiskinan: 6.08 },
    { tahun: "2023", pdrb: 9.18, ipm: 71.80, kemiskinan: 5.95 },
    { tahun: "2024", pdrb: 9.52, ipm: 72.16, kemiskinan: 5.89 },
    { tahun: "2025", pdrb: 9.85, ipm: 72.84, kemiskinan: 5.82 }
  ]
};

export const bmkgWeatherData = [
  { wilayah: "Barabai (Pusat Kota)", suhu: "28°C", kondisi: "Cerah Berawan", kelembapan: "78%", angin: "12 km/jam SW", cuacaIcon: "cloud-sun" },
  { wilayah: "Hantakan (Lereng Meratus)", suhu: "25°C", kondisi: "Hujan Ringan", kelembapan: "88%", angin: "8 km/jam W", cuacaIcon: "cloud-rain" },
  { wilayah: "Batu Benawa (Ekowisata)", suhu: "26°C", kondisi: "Berawan", kelembapan: "82%", angin: "10 km/jam SW", cuacaIcon: "cloud" },
  { wilayah: "Labuan Amas Selatan", suhu: "30°C", kondisi: "Cerah", kelembapan: "72%", angin: "15 km/jam S", cuacaIcon: "sun" },
  { wilayah: "Batang Alai Timur (Meratus)", suhu: "23°C", kondisi: "Hujan Sedang", kelembapan: "92%", angin: "6 km/jam NW", cuacaIcon: "cloud-lightning" }
];

export const emergency112Stats = {
  totalCalls: 4120,
  avgResponseTime: "7.4 Menit",
  activeOperators: 14,
  kategoriKejadian: [
    { nama: "Tanggap Banjir & Bencana Alam", jumlah: 1420, icon: "droplets", status: "Siaga 1", color: "emerald" },
    { nama: "Layanan Darurat Ambulans / Medis", jumlah: 1250, icon: "heart-pulse", status: "Normal", color: "blue" },
    { nama: "Penanganan Karhutla & Pemadam", jumlah: 840, icon: "flame", status: "Pantau", color: "amber" },
    { nama: "Gangguan Kamtibmas & Pohon Tumbang", jumlah: 610, icon: "shield-alert", status: "Tertangani", color: "purple" }
  ]
};

export const potensiInvestasi = [
  {
    id: 1,
    judul: "Ekowisata Pegunungan Meratus & Pagat Batu Benawa",
    kategori: "Pariwisata & Ekowisata",
    lokasi: "Kecamatan Batu Benawa & Hantakan",
    potensi: "Pengembangan Glamping, Arung Jeram, & Resort Alam Berkelanjutan",
    estimasiNilai: "Rp 45 Miliar",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    judul: "Pengolahan Rice Milling Modern & Beras Organik Murakata",
    kategori: "Agribisnis & Pangan",
    lokasi: "Kecamatan Batang Alai Utara & Labuan Amas",
    potensi: "Pabrik Pengolahan Padi Berteknologi Tinggi & Kemasan Ekspor",
    estimasiNilai: "Rp 32 Miliar",
    imageUrl: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    judul: "Hilirisasi Karet Alam & Perkebunan Komoditas HST",
    kategori: "Perkebunan & Industri",
    lokasi: "Kecamatan Haruyan & Limpasu",
    potensi: "Pabrik Pengolahan Crumb Rubber & Produk Olahan Latex",
    estimasiNilai: "Rp 75 Miliar",
    imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80"
  }
];

export const recentActivities = [
  {
    id: 1,
    opd: "Badan Perencanaan Pembangunan, Riset dan Inovasi Daerah (Bapperida)",
    aksi: "Memublikasikan Laporan Evaluasi RKPD Hulu Sungai Tengah 2025",
    waktu: "10 menit yang lalu",
    badge: "Publikasi Data"
  },
  {
    id: 2,
    opd: "Dinas Kesehatan",
    aksi: "Mengunggah Dataset Imunisasi Anak & Posyandu Q2 2026",
    waktu: "45 menit yang lalu",
    badge: "eWalidata"
  },
  {
    id: 3,
    opd: "Dinas Komunikasi, Informatika, Statistik dan Persandian (Diskominfo)",
    aksi: "Memverifikasi 14 Dataset Sektoral dari Dinas Pertanian",
    waktu: "2 jam yang lalu",
    badge: "Verifikasi Data"
  },
  {
    id: 4,
    opd: "Badan Pengelola Keuangan dan Pendapatan Daerah (BPKPD)",
    aksi: "Memperbarui Data Laporan Penyerapan Realisasi APBD Juli 2026",
    waktu: "4 jam yang lalu",
    badge: "Keuangan APBD"
  }
];

// Data Pengaduan Masyarakat
export const pengaduanData = {
  total: 1248,
  selesai: 1012,
  proses: 168,
  belumDitindaklanjuti: 68
};

// Data Harga Pangan Hari Ini
export const hargaPanganData = [
  { komoditas: 'Beras Medium (kg)', harga: 14500, perubahan: -100, icon: '🌾' },
  { komoditas: 'Beras Premium (kg)', harga: 16500, perubahan: +100, icon: '🌾' },
  { komoditas: 'Gula Pasir (kg)', harga: 17000, perubahan: 0, icon: '🍬' },
  { komoditas: 'Minyak Goreng (L)', harga: 19000, perubahan: -500, icon: '🫗' },
  { komoditas: 'Daging Ayam (kg)', harga: 38000, perubahan: -500, icon: '🍗' },
  { komoditas: 'Daging Sapi (kg)', harga: 140000, perubahan: -1000, icon: '🥩' },
  { komoditas: 'Telur Ayam (kg)', harga: 28000, perubahan: 0, icon: '🥚' },
  { komoditas: 'Cabai Merah (kg)', harga: 45000, perubahan: +1000, icon: '🌶️' },
];

// Data Inflasi Kabupaten (y-on-y)
export const inflasiData = {
  current: 2.23,
  change: -0.18,
  changePeriod: 'dibanding Maret 2025',
  bulan: 'April 2025',
  sumber: 'BPS Kab. HST',
  tren: [
    { bulan: 'Des 2024', nilai: 2.71 },
    { bulan: 'Jan 2025', nilai: 2.54 },
    { bulan: 'Feb 2025', nilai: 2.48 },
    { bulan: 'Mar 2025', nilai: 2.41 },
    { bulan: 'Apr 2025', nilai: 2.23 },
  ]
};

// Data Berita & Informasi Terkini
export const beritaTerkini = [
  {
    id: 1,
    judul: 'Capaian Kinerja Pemkab HST Triwulan I Tahun 2025',
    tanggal: '27 Mei 2025',
    thumbnail: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 2,
    judul: 'Rapat Koordinasi Pengendalian Inflasi Daerah',
    tanggal: '26 Mei 2025',
    thumbnail: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 3,
    judul: 'HST Raih Predikat Informatif dalam KIP 2025',
    tanggal: '24 Mei 2025',
    thumbnail: 'https://images.unsplash.com/photo-1560472355-536de3962603?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 4,
    judul: 'Pendampingan Open Data Sektoral OPD',
    tanggal: '22 Mei 2025',
    thumbnail: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=400&q=80',
  }
];

// Data Penduduk per Kecamatan (untuk peta)
export const pendudukKecamatan = [
  { nama: 'Kec. Batang Alai Utara', jumlah: '24.317 Jiwa' },
  { nama: 'Kec. Labuan Amas Utara', jumlah: '25.186 Jiwa' },
  { nama: 'Kec. Labuan Amas Selatan', jumlah: '34.671 Jiwa' },
  { nama: 'Kec. Barabai', jumlah: '78.892 Jiwa' },
  { nama: 'Kec. Pandawan', jumlah: '37.954 Jiwa' },
  { nama: 'Kec. Batu Benawa', jumlah: '62.227 Jiwa' },
];

export const totalPenduduk = {
  total: '263.247 Jiwa',
  lakiLaki: '133.379',
  perempuan: '129.868',
  sumber: 'Dukcapil HST'
};

// Indikator Makro (8 cards)
export const indikatorMakro = [
  {
    no: 1,
    label: 'LAJU PERTUMBUHAN EKONOMI (%)',
    value: '5,00',
    target: 'Target 2025: 5,00',
    prefix: '',
    color: '#1e40af',
    trend: 'up'
  },
  {
    no: 2,
    label: 'PDRB PER KAPITA (Rp Juta)',
    value: '35,90',
    target: 'Target 2025: 35,00',
    prefix: 'Rp',
    color: '#0369a1',
    trend: 'up'
  },
  {
    no: 3,
    label: 'TINGKAT KEMISKINAN (%)',
    value: '5,43',
    target: 'Target 2025: 5,43',
    prefix: '',
    color: '#0e7490',
    trend: 'down-good'
  },
  {
    no: 4,
    label: 'RASIO GINI (Indeks)',
    value: '0,216',
    target: 'Target 2025: 0,216',
    prefix: '',
    color: '#0f766e',
    trend: 'stable'
  },
  {
    no: 5,
    label: 'INDEKS PEMBANGUNAN MANUSIA (IPM)',
    value: '73,80',
    target: 'Target 2025: 73,80',
    prefix: '',
    color: '#15803d',
    trend: 'up'
  },
  {
    no: 6,
    label: 'PENURUNAN INTENSITAS EMISI GRK (%)',
    value: '1,46',
    target: 'Target 2025: 1,46',
    prefix: '',
    color: '#a16207',
    trend: 'up'
  },
  {
    no: 7,
    label: 'INDEKS KUALITAS LINGKUNGAN HIDUP (IKLH)',
    value: '72,00',
    target: 'Target 2025: 72,00',
    prefix: '',
    color: '#b45309',
    trend: 'up'
  },
  {
    no: 8,
    label: 'TINGKAT PENGANGGURAN TERBUKA (%)',
    value: '3,04',
    target: 'Target 2025: 3,04',
    prefix: '',
    color: '#9a3412',
    trend: 'down-good'
  }
];

// Realisasi APBD 2025
export const realisasiApbd = {
  // Ringkasan Total APBD
  totalAnggaran: 'Rp 2,15 T',
  realisasi: 'Rp 1,00 T',
  persenRealisasi: 46.72,
  sisaAnggaran: 'Rp 1,15 T',

  // Ringkasan Pendapatan
  pendapatan: {
    target: 'Rp 2,10 T',
    realisasi: 'Rp 1,12 T',
    persen: 53.33,
    pad: 'Rp 185,4 M',
    transfer: 'Rp 1,88 T'
  },

  // Ringkasan Belanja
  belanja: {
    pagu: 'Rp 2,15 T',
    realisasi: 'Rp 1,00 T',
    persen: 46.72,
    operasi: 'Rp 650,2 M',
    modal: 'Rp 350,8 M'
  }
};
