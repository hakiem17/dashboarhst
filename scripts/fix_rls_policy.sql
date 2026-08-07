-- =====================================================
-- JALANKAN SELURUH SKRIP INI DI SUPABASE SQL EDITOR
-- Tujuan: Mengizinkan INSERT/UPDATE/SELECT/DELETE
-- dari aplikasi browser (anon key)
-- =====================================================

-- Hapus policy lama jika ada (agar tidak konflik)
DROP POLICY IF EXISTS "allow_all_dtsen_keluarga" ON dtsen_keluarga;
DROP POLICY IF EXISTS "allow_all_dtsen_individu" ON dtsen_individu;
DROP POLICY IF EXISTS "Allow all inserts" ON dtsen_keluarga;
DROP POLICY IF EXISTS "Allow all inserts" ON dtsen_individu;

-- Buat policy baru: izinkan semua operasi untuk role anon dan authenticated
CREATE POLICY "allow_all_dtsen_keluarga"
  ON dtsen_keluarga
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "allow_all_dtsen_individu"
  ON dtsen_individu
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Verifikasi: tampilkan semua policy yang aktif
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename IN ('dtsen_keluarga', 'dtsen_individu');
