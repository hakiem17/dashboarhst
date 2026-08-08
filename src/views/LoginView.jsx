import React, { useState, useEffect } from 'react';
import {
  Eye,
  EyeOff,
  Lock,
  User,
  Shield,
  AlertCircle,
  ChevronRight,
  Loader2,
  Database,
  BarChart3,
  TrendingUp,
  Map
} from 'lucide-react';

const CREDENTIALS = [
  { username: 'admin', password: 'admin2026', role: 'Administrator', label: 'Admin' },
  { username: 'viewer', password: 'hst2026', role: 'Viewer', label: 'Viewer' },
];

const STATS = [
  { icon: BarChart3, label: '51.707', sub: 'Data KK DTSEN', color: 'text-emerald-400' },
  { icon: Database, label: '144.307', sub: 'Data NIK DTSEN', color: 'text-cyan-400' },
  { icon: TrendingUp, label: '11', sub: 'Kecamatan HST', color: 'text-violet-400' },
  { icon: Map, label: '169+', sub: 'Desa / Kelurahan', color: 'text-amber-400' },
];

export default function LoginView({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [animIdx, setAnimIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setAnimIdx(p => (p + 1) % STATS.length), 2500);
    return () => clearInterval(t);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Username dan password harus diisi.');
      return;
    }
    setLoading(true);
    setError('');

    // Simulate API latency
    await new Promise(r => setTimeout(r, 900));

    const matched = CREDENTIALS.find(
      c => c.username === username.toLowerCase().trim() && c.password === password
    );

    if (matched) {
      onLoginSuccess({ username: matched.username, role: matched.role });
    } else {
      setError('Username atau password salah. Silakan coba lagi.');
      setLoading(false);
    }
  };

  const fmt = (d) => d.toLocaleString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  const fmtTime = (d) => d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col overflow-hidden relative" style={{ fontFamily: "'Inter', 'system-ui', sans-serif" }}>

      {/* === Animated Background Gradient Mesh === */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-emerald-500/5 blur-[100px] animate-pulse" />
        <div className="absolute top-1/3 -left-60 w-[500px] h-[500px] rounded-full bg-teal-500/5 blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-emerald-600/5 blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(16,185,129,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.4) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* === Top Badge Bar === */}
      <div className="relative z-10 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-sm px-6 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] text-slate-400 font-mono">SISTEM INFORMASI PENGELOLAAN DATA PEMBANGUNAN DAERAH</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
          <span>{fmt(currentTime)}</span>
          <span className="text-emerald-400 font-bold tracking-widest">{fmtTime(currentTime)}</span>
        </div>
      </div>

      {/* === Main Layout === */}
      <div className="relative z-10 flex-1 flex">

        {/* LEFT PANEL — Branding */}
        <div className="hidden lg:flex flex-col justify-between w-[52%] xl:w-[55%] p-10 xl:p-16 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/30 border-r border-slate-800/60">
          
          {/* Logo + Name */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center p-2 shadow-xl">
              <img src="/logo.png" alt="Logo HST" className="w-full h-full object-contain" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em]">Pemerintah Kabupaten</p>
              <h1 className="text-lg font-extrabold text-white leading-tight">Hulu Sungai Tengah</h1>
              <p className="text-[11px] text-slate-400">Kalimantan Selatan · #HST_MURAKATA</p>
            </div>
          </div>

          {/* Center Headline */}
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-1.5 mb-6">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] font-bold text-emerald-400 tracking-wider uppercase">Executive Dashboard — Kabupaten Hulu Sungai Tengah</span>
              </div>
              <h2 className="text-4xl xl:text-5xl font-black text-white leading-tight tracking-tight">
                Dashboard<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                  Data Terpadu
                </span>
              </h2>
              <p className="text-slate-400 mt-4 text-sm leading-relaxed max-w-md">
                Platform analitik data pembangunan daerah yang terintegrasi — menyajikan data makro, DTSEN, APBD, dan kebijakan secara real-time.
              </p>
            </div>

            {/* Animated Stats */}
            <div className="grid grid-cols-2 gap-3">
              {STATS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div
                    key={i}
                    className={`p-4 rounded-xl border transition-all duration-700 ${
                      i === animIdx
                        ? 'bg-slate-800/80 border-emerald-500/40 shadow-lg shadow-emerald-950/50 scale-[1.02]'
                        : 'bg-slate-900/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className={`w-3.5 h-3.5 ${s.color}`} />
                      <span className={`text-xl font-black ${s.color}`}>{s.label}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{s.sub}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Left */}
          <div className="flex items-center gap-4 text-[11px] text-slate-600">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Sistem Aman & Terenkripsi</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
              <span>Data Real-Time Terintegrasi</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
              <span>Pemerintah Kab. HST © 2026</span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL — Login Form */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10">

          {/* Mobile Logo (only shown below lg) */}
          <div className="flex lg:hidden flex-col items-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center p-2 shadow-xl mb-3">
              <img src="/logo.png" alt="Logo HST" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-xl font-black text-white">Dashboard Data Terpadu HST</h1>
            <p className="text-slate-400 text-xs mt-1">Kabupaten Hulu Sungai Tengah · 2026</p>
          </div>

          {/* Card Form */}
          <div className="w-full max-w-md">
            {/* Card Header */}
            <div className="mb-8">
              <h3 className="text-2xl font-extrabold text-white">Masuk ke Sistem</h3>
              <p className="text-slate-400 text-sm mt-1">Gunakan kredensial yang telah diberikan oleh administrator.</p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-5 flex items-center gap-3 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5" autoComplete="off">

              {/* Username */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Username</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    id="login-username"
                    value={username}
                    onChange={e => { setUsername(e.target.value); setError(''); }}
                    placeholder="Masukkan username..."
                    disabled={loading}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40 transition disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="login-password"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(''); }}
                    placeholder="Masukkan password..."
                    disabled={loading}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-11 pr-12 py-3.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40 transition disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="login-submit"
                disabled={loading || !username || !password}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-extrabold text-sm transition-all duration-200
                  bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400
                  text-slate-950 shadow-lg shadow-emerald-950/50 hover:shadow-emerald-500/25
                  disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memverifikasi...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Dashboard</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Security Note */}
            <div className="mt-8 p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-[11px] text-slate-500 leading-relaxed">
                <strong className="text-slate-400 block mb-0.5">Keamanan Sistem</strong>
                Akses ke sistem ini hanya untuk pengguna yang berwenang. Setiap sesi aktivitas dicatat dan dipantau oleh administrator sistem.
              </div>
            </div>

            {/* Footer */}
            <p className="text-center text-[11px] text-slate-600 mt-6">
              © 2026 Pemerintah Kabupaten Hulu Sungai Tengah &mdash; Kalimantan Selatan
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
