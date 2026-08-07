-- =====================================================
-- SQL UNTUK MENGOSONGKAN (MENGHAPUS SEMUA DATA) TABEL DTSEN
-- Jalankan di Supabase Dashboard -> SQL Editor -> Run
-- =====================================================

-- Hapus semua baris dari dtsen_keluarga & dtsen_individu
TRUNCATE TABLE dtsen_keluarga CASCADE;
TRUNCATE TABLE dtsen_individu CASCADE;

-- Verifikasi jumlah baris setelah di-truncate (harus 0)
SELECT 
  (SELECT COUNT(*) FROM dtsen_keluarga) AS total_kk,
  (SELECT COUNT(*) FROM dtsen_individu) AS total_nik;
