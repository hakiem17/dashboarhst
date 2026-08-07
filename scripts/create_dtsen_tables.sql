-- SQL Migration script to create complete DTSEN tables in Supabase / PostgreSQL
-- Matches 100% of all fields in DTSEN Metadata Versi 1 (Januari 2026)

-- 1. Table Set Data Keluarga (29 Fields)
CREATE TABLE IF NOT EXISTS dtsen_keluarga (
  nomor_kartu_keluarga VARCHAR(16) PRIMARY KEY,
  kode_provinsi VARCHAR(2),
  provinsi VARCHAR(100),
  kode_kabupaten_kota VARCHAR(5),
  kabupaten_kota VARCHAR(100),
  kode_kecamatan VARCHAR(10),
  kecamatan VARCHAR(100),
  kode_kelurahan_desa VARCHAR(15),
  kelurahan_desa VARCHAR(100),
  alamat TEXT,
  jumlah_anggota_keluarga INT,
  nama_anggota_keluarga VARCHAR(255),
  desil_nasional INT,
  pbi_nas INT DEFAULT 0,
  pbi_pemda INT DEFAULT 0,
  id_pelanggan_pln VARCHAR(50),
  status_kepemilikan_rumah INT,
  jenis_lantai_terluas INT,
  luas_lantai INT,
  jenis_dinding_terluas INT,
  jenis_atap_terluas INT,
  sumber_air_minum_utama INT,
  sumber_penerangan_utama INT,
  daya_terpasang INT,
  bahan_bakar_utama_memasak INT,
  fasilitas_bab INT,
  jenis_kloset INT,
  pembuangan_akhir_tinja INT,
  kepemilikan_aset INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Table Set Data Anggota Keluarga / Individu (46 Fields)
CREATE TABLE IF NOT EXISTS dtsen_individu (
  nomor_induk_kependudukan VARCHAR(16) PRIMARY KEY,
  nomor_kartu_keluarga VARCHAR(16),
  nama VARCHAR(255),
  tanggal_lahir DATE,
  jenis_kelamin INT,
  status_hubungan_keluarga INT,
  pbi_nas INT DEFAULT 0,
  pbi_pemda INT DEFAULT 0,
  status_kawin INT,
  partisipasi_sekolah INT,
  jenjang_tertinggi_yang_diduduki INT,
  kelas_tertinggi_yang_diduduki INT,
  ijazah_tertinggi_yang_dimiliki INT,
  status_bekerja INT,
  lapangan_usaha_dari_pekerjaan_utama INT,
  status_dalam_pekerjaan_utama INT,
  kepemilikan_usaha INT,
  jumlah_usaha INT,
  lapangan_usaha_dari_usaha_utama INT,
  jumlah_pekerja_yang_dibayar_dari_usaha_utama INT,
  jumlah_pekerja_yang_tidak_dibayar_dari_usaha_utama INT,
  omzet_usaha_utama INT,
  kondisi_gizi INT,
  penglihatan INT,
  pendengaran INT,
  berjalan_atau_naik_tangga INT,
  menggunakan_tangan_jari INT,
  belajar_kemampuan_intelektual INT,
  pengendalian_perilaku INT,
  berbicara_komunikasi INT,
  mengurus_diri INT,
  mengingat_berkonsentrasi INT,
  kesedihan_depresi INT,
  penyakit_kronis INT,
  kode_provinsi_ktp VARCHAR(2),
  provinsi_ktp VARCHAR(100),
  kode_kabupaten_kota_ktp VARCHAR(5),
  kabupaten_kota_ktp VARCHAR(100),
  kode_kecamatan_ktp VARCHAR(10),
  kecamatan_ktp VARCHAR(100),
  kode_kelurahan_desa_ktp VARCHAR(15),
  kelurahan_desa_ktp VARCHAR(100),
  rt_ktp VARCHAR(10),
  rw_ktp VARCHAR(10),
  dusun_ktp VARCHAR(100),
  alamat_ktp TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- High-performance Indices
CREATE INDEX IF NOT EXISTS idx_dtsen_keluarga_kecamatan ON dtsen_keluarga(kecamatan);
CREATE INDEX IF NOT EXISTS idx_dtsen_keluarga_desil ON dtsen_keluarga(desil_nasional);
CREATE INDEX IF NOT EXISTS idx_dtsen_individu_kk ON dtsen_individu(nomor_kartu_keluarga);
CREATE INDEX IF NOT EXISTS idx_dtsen_individu_kecamatan ON dtsen_individu(kecamatan_ktp);
CREATE INDEX IF NOT EXISTS idx_dtsen_individu_bekerja ON dtsen_individu(status_bekerja);
CREATE INDEX IF NOT EXISTS idx_dtsen_individu_gizi ON dtsen_individu(kondisi_gizi);

-- ============================================================
-- PENTING: Nonaktifkan RLS agar upload dari browser berhasil
-- (Jalankan perintah ini setelah CREATE TABLE di atas)
-- ============================================================
ALTER TABLE dtsen_keluarga DISABLE ROW LEVEL SECURITY;
ALTER TABLE dtsen_individu DISABLE ROW LEVEL SECURITY;

-- ALTERNATIF: Jika RLS tetap aktif, aktifkan policy berikut:
-- CREATE POLICY "allow_all_dtsen_keluarga" ON dtsen_keluarga FOR ALL USING (true) WITH CHECK (true);
-- CREATE POLICY "allow_all_dtsen_individu" ON dtsen_individu FOR ALL USING (true) WITH CHECK (true);
