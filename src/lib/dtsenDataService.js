/**
 * Service Helper for DTSEN (Data Terpadu Sosio Ekonomi Nasional / INPRES 8)
 * Kabupaten Hulu Sungai Tengah.
 * Includes official metadata dictionaries (DTSEN Versi 1 Januari 2026),
 * fast pipe-delimited CSV parsing, and aggregations for dashboard charts.
 */

// Official Metadata Lookups based on "Lampiran Metadata DTSEN Versi 1 (Januari 2026)"
export const METADATA_DICTIONARIES = {
  desil_nasional: {
    1: 'Desil 1 (Sangat Miskin)',
    2: 'Desil 2 (Miskin)',
    3: 'Desil 3 (Hampir Miskin)',
    4: 'Desil 4 (Rentan Miskin)',
    5: 'Desil 5 (Menengah)',
    6: 'Desil 6 (Menengah)',
    7: 'Desil 7 (Menengah Ke Atas)',
    8: 'Desil 8 (Menengah Ke Atas)',
    9: 'Desil 9 (Mampu)',
    10: 'Desil 10 (Sangat Mampu)'
  },
  status_kepemilikan_rumah: {
    1: 'Milik Sendiri',
    2: 'Kontrak / Sewa',
    3: 'Bebas Sewa',
    4: 'Dinas',
    5: 'Lainnya'
  },
  jenis_lantai_terluas: {
    1: 'Marmer / Granit',
    2: 'Keramik',
    3: 'Parket / Vinil / Karpet',
    4: 'Ubin / Tegel / Teraso',
    5: 'Kayu / Papan',
    6: 'Semen / Bata Merah',
    7: 'Bambu',
    8: 'Tanah',
    9: 'Lainnya',
    10: 'Keramik / Granit / Ubin'
  },
  jenis_dinding_terluas: {
    1: 'Tembok',
    2: 'Plesteran Anyaman Bambu/Kawat',
    3: 'Kayu / Papan / Gypsum / GRC',
    4: 'Anyaman Bambu',
    5: 'Batang Kayu',
    6: 'Bambu',
    7: 'Lainnya'
  },
  jenis_atap_terluas: {
    1: 'Beton',
    2: 'Genteng',
    3: 'Seng',
    4: 'Asbes',
    5: 'Bambu',
    6: 'Kayu / Sirap',
    7: 'Jerami / Ijuk / Rumbia',
    8: 'Lainnya',
    9: 'Asbes / Seng'
  },
  sumber_air_minum_utama: {
    1: 'Air Kemasan Bermerk',
    2: 'Air Isi Ulang',
    3: 'Leding (PDAM)',
    4: 'Sumur Bor / Pompa',
    5: 'Sumur Terlindung',
    6: 'Sumur Tak Terlindung',
    7: 'Mata Air Terlindung',
    8: 'Mata Air Tak Terlindung',
    9: 'Air Permukaan (Sungai/Danau)',
    10: 'Air Hujan',
    11: 'Lainnya',
    12: 'Air Kemasan / Isi Ulang'
  },
  sumber_penerangan_utama: {
    1: 'Listrik PLN Meteran',
    2: 'Listrik PLN Tanpa Meteran',
    3: 'Listrik Non-PLN',
    4: 'Bukan Listrik'
  },
  daya_terpasang: {
    1: '450 Watt',
    2: '900 Watt',
    3: '1.300 Watt',
    4: '2.200 Watt',
    5: '> 2.200 Watt',
    6: '<= 900 Watt',
    7: '> 900 Watt'
  },
  bahan_bakar_utama_memasak: {
    0: 'Tidak Memasak di Rumah',
    1: 'Listrik',
    2: 'Gas Elpiji 5.5 kg / Blue Gaz',
    3: 'Gas Elpiji 12 kg',
    4: 'Gas Elpiji 3 kg (Subsidi)',
    5: 'Gas Kota / PGN',
    6: 'Biogas',
    7: 'Minyak Tanah',
    8: 'Briket',
    9: 'Arang',
    10: 'Kayu Bakar',
    11: 'Lainnya',
    12: 'Listrik / Gas'
  },
  fasilitas_bab: {
    1: 'Sendiri',
    2: 'Bersama',
    3: 'Umum',
    4: 'Tidak Ada'
  },
  jenis_kloset: {
    1: 'Leher Angsa',
    2: 'Plengsengan dengan Tutup',
    3: 'Plengsengan tanpa Tutup',
    4: 'Cemplung / Cubluk'
  },
  pembuangan_akhir_tinja: {
    1: 'Tangki Septik (Septic Tank)',
    2: 'SPAL',
    3: 'Lubang Tanah',
    4: 'Kolam / Sawah / Sungai / Danau',
    5: 'Pantai / Kebun / Tanah Lapang',
    6: 'Lainnya'
  },
  jenis_kelamin: {
    1: 'Laki-laki',
    2: 'Perempuan'
  },
  status_bekerja: {
    1: 'Bekerja',
    2: 'Tidak Bekerja'
  },
  kondisi_gizi: {
    1: 'Kurang Gizi (Wasting)',
    2: 'Kerdil (Stunting)',
    3: 'Tidak Ada Catatan / Normal',
    8: 'Tidak Tahu'
  },
  status_hubungan_keluarga: {
    1: 'Kepala Keluarga',
    2: 'Istri / Suami',
    3: 'Anak',
    4: 'Menantu',
    5: 'Cucu',
    6: 'Orang Tua / Mertua',
    7: 'Famili Lain',
    8: 'Pembantu',
    9: 'Lainnya'
  },
  status_kawin: {
    1: 'Belum Kawin',
    2: 'Kawin Tercatat',
    3: 'Kawin Belum Tercatat',
    4: 'Cerai Hidup',
    5: 'Cerai Mati'
  },
  partisipasi_sekolah: {
    1: 'Tidak / Belum Sekolah',
    2: 'Masih Sekolah',
    3: 'Tidak Sekolah Lagi'
  },
  ijazah_tertinggi_yang_dimiliki: {
    1: 'Tidak Punya Ijazah',
    2: 'SD / MI / Sederajat',
    3: 'SMP / MTs / Sederajat',
    4: 'SMA / MA / SMK / Sederajat',
    5: 'Diploma I / II',
    6: 'Diploma III',
    7: 'Diploma IV / S1',
    8: 'S2 / S3',
    19: 'D4 / S1',
    23: 'Tidak Punya Ijazah SD'
  },
  penyakit_kronis: {
    1: 'Tidak Ada',
    2: 'Hipertensi',
    3: 'Rematik',
    4: 'Asma',
    5: 'Masalah Jantung',
    6: 'Diabetes',
    7: 'TBC',
    8: 'Stroke',
    9: 'Kanker / Tumor Ganas',
    10: 'Gagal Ginjal',
    13: 'Kolesterol',
    18: 'Lainnya'
  }
};

/**
 * Fast pipe-delimited CSV parser.
 * Handles large string content line-by-line.
 */
export function parseDtsenCsv(csvText, fileName = '') {
  const lines = csvText.split(/\r?\n/);
  if (lines.length < 2) return null;

  // Header line
  const header = lines[0].split('|').map(h => h.trim().toLowerCase());
  
  // Detect if dataset is Household (_1_1) or Individual (_2_1)
  const isHousehold = header.includes('desil_nasional') && header.includes('sumber_air_minum_utama');
  const isIndividual = header.includes('nomor_induk_kependudukan') || header.includes('status_hubungan_keluarga');

  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const parts = line.split('|');
    if (parts.length < 5) continue;

    const rowObj = {};
    header.forEach((colName, idx) => {
      rowObj[colName] = parts[idx] ? parts[idx].trim() : '';
    });
    rows.push(rowObj);
  }

  return {
    type: isHousehold ? 'household' : (isIndividual ? 'individual' : 'generic'),
    fileName,
    totalRecords: lines.length - 1,
    parsedRecords: rows.length,
    headers: header,
    data: rows
  };
}

/**
 * Helper to aggregate Household data for Dashboard Visualizations
 */
export function aggregateHouseholdData(rows) {
  if (!rows || rows.length === 0) return null;

  const totalKK = rows.length;
  let desilCounts = { 'Desil 1': 0, 'Desil 2': 0, 'Desil 3': 0, 'Desil 4': 0, 'Desil 5+': 0 };
  let pbiCounts = { 'PBI APBN (Nasional)': 0, 'PBI APBD (Pemda)': 0, 'PBI APBN & APBD': 0, 'Bukan PBI': 0 };
  
  let kecamatanMap = {};
  let waterSourceMap = {};
  let floorTypeMap = {};
  let wallTypeMap = {};
  let latrineTypeMap = {};
  let cookingFuelMap = {};
  let nonLaikHuniCount = 0;

  rows.forEach(r => {
    // Desil aggregation
    const desilVal = parseInt(r.desil_nasional, 10);
    if (desilVal === 1) desilCounts['Desil 1']++;
    else if (desilVal === 2) desilCounts['Desil 2']++;
    else if (desilVal === 3) desilCounts['Desil 3']++;
    else if (desilVal === 4) desilCounts['Desil 4']++;
    else desilCounts['Desil 5+']++;

    // PBI Status (Supports String '1', Integer 1, or Boolean true)
    const pbiNas = String(r.pbi_nas) === '1' || r.pbi_nas === true || r.pbi_nas === 1;
    const pbiPemda = String(r.pbi_pemda) === '1' || r.pbi_pemda === true || r.pbi_pemda === 1;
    if (pbiNas && pbiPemda) pbiCounts['PBI APBN & APBD']++;
    else if (pbiNas) pbiCounts['PBI APBN (Nasional)']++;
    else if (pbiPemda) pbiCounts['PBI APBD (Pemda)']++;
    else pbiCounts['Bukan PBI']++;

    // Kecamatan Breakdown
    const kec = r.kecamatan || 'TIDAK TERIDENTIFIKASI';
    if (!kecamatanMap[kec]) {
      kecamatanMap[kec] = { name: kec, desil1: 0, desil2: 0, desil3: 0, desil4: 0, total: 0 };
    }
    kecamatanMap[kec].total++;
    if (desilVal === 1) kecamatanMap[kec].desil1++;
    else if (desilVal === 2) kecamatanMap[kec].desil2++;
    else if (desilVal === 3) kecamatanMap[kec].desil3++;
    else if (desilVal === 4) kecamatanMap[kec].desil4++;

    // Water Source
    const waterCode = parseInt(r.sumber_air_minum_utama, 10);
    const waterLabel = METADATA_DICTIONARIES.sumber_air_minum_utama[waterCode] || 'Lainnya / Non-PDAM';
    waterSourceMap[waterLabel] = (waterSourceMap[waterLabel] || 0) + 1;

    // Floor Type
    const floorCode = parseInt(r.jenis_lantai_terluas, 10);
    const floorLabel = METADATA_DICTIONARIES.jenis_lantai_terluas[floorCode] || 'Lainnya';
    floorTypeMap[floorLabel] = (floorTypeMap[floorLabel] || 0) + 1;

    // Wall Type
    const wallCode = parseInt(r.jenis_dinding_terluas, 10);
    const wallLabel = METADATA_DICTIONARIES.jenis_dinding_terluas[wallCode] || 'Lainnya';
    wallTypeMap[wallLabel] = (wallTypeMap[wallLabel] || 0) + 1;

    // Latrine & Sanitation
    const latrineCode = parseInt(r.jenis_kloset, 10);
    const latrineLabel = METADATA_DICTIONARIES.jenis_kloset[latrineCode] || 'Cemplung / Tidak Ada';
    latrineTypeMap[latrineLabel] = (latrineTypeMap[latrineLabel] || 0) + 1;

    // Cooking Fuel
    const fuelCode = parseInt(r.bahan_bakar_utama_memasak, 10);
    const fuelLabel = METADATA_DICTIONARIES.bahan_bakar_utama_memasak[fuelCode] || 'Lainnya';
    cookingFuelMap[fuelLabel] = (cookingFuelMap[fuelLabel] || 0) + 1;

    // Rumah Tidak Layak Huni (RTLH) Heuristic
    if (floorCode === 7 || floorCode === 8 || latrineCode === 4 || latrineCode === 3) {
      nonLaikHuniCount++;
    }
  });

  return {
    totalKK,
    desilCounts: Object.entries(desilCounts).map(([name, count]) => ({ name, count })),
    pbiCounts: Object.entries(pbiCounts).map(([name, count]) => ({ name, count })),
    kecamatanData: Object.values(kecamatanMap).sort((a, b) => b.total - a.total),
    waterSourceData: Object.entries(waterSourceMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count),
    floorTypeData: Object.entries(floorTypeMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count),
    wallTypeData: Object.entries(wallTypeMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count),
    latrineTypeData: Object.entries(latrineTypeMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count),
    cookingFuelData: Object.entries(cookingFuelMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count),
    nonLaikHuniCount
  };
}

/**
 * Helper to aggregate Individual data for Dashboard Visualizations
 */
export function aggregateIndividualData(rows) {
  if (!rows || rows.length === 0) return null;

  const totalIndividu = rows.length;
  let genderCounts = { 'Laki-laki': 0, 'Perempuan': 0 };
  let workCounts = { 'Bekerja': 0, 'Tidak Bekerja / IRT / Sekolah': 0 };
  let stuntingCount = 0;
  let wastingCount = 0;
  let diseaseMap = {};
  let kecKtpMap = {};

  rows.forEach(r => {
    // Gender
    if (String(r.jenis_kelamin) === '1') genderCounts['Laki-laki']++;
    else if (String(r.jenis_kelamin) === '2') genderCounts['Perempuan']++;

    // Work Status
    if (String(r.status_bekerja) === '1') workCounts['Bekerja']++;
    else workCounts['Tidak Bekerja / IRT / Sekolah']++;

    // Nutrition / Stunting
    if (String(r.kondisi_gizi) === '2') stuntingCount++;
    if (String(r.kondisi_gizi) === '1') wastingCount++;

    // Chronic Disease
    const diseaseCode = parseInt(r.penyakit_kronis, 10);
    if (diseaseCode && diseaseCode > 1) {
      const diseaseLabel = METADATA_DICTIONARIES.penyakit_kronis?.[diseaseCode] || `Kode ${diseaseCode}`;
      diseaseMap[diseaseLabel] = (diseaseMap[diseaseLabel] || 0) + 1;
    }

    // Kecamatan KTP
    const kec = r.kecamatan_ktp || 'TIDAK TERIDENTIFIKASI';
    kecKtpMap[kec] = (kecKtpMap[kec] || 0) + 1;
  });

  return {
    totalIndividu,
    genderData: Object.entries(genderCounts).map(([name, count]) => ({ name, count })),
    workData: Object.entries(workCounts).map(([name, count]) => ({ name, count })),
    stuntingCount,
    wastingCount,
    diseaseData: Object.entries(diseaseMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10),
    kecKtpData: Object.entries(kecKtpMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  };
}
