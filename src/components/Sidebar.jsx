import React, { useState } from 'react';
import { 
  Home, 
  MapPin, 
  CloudSun, 
  PhoneCall, 
  Activity, 
  TrendingUp, 
  Database, 
  Layers, 
  Map, 
  PieChart, 
  Briefcase, 
  FileText,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  ShoppingBag,
  MessageSquare,
  Landmark
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) {
  const [strategisOpen, setStrategisOpen] = useState(true);
  const [sektoralOpen, setSektoralOpen] = useState(false);
  const [apbdOpen, setApbdOpen] = useState(true);
  const [tpidOpen, setTpidOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home, type: 'link' },
    { id: 'profil', label: 'Profil Daerah HST', icon: MapPin, type: 'link' },
    { id: 'cuaca', label: 'Prakiraan Cuaca BMKG', icon: CloudSun, type: 'link', badge: 'Live' },
    
    // Collapsible Menu: Data Strategis
    { 
      id: 'strategis-parent', 
      label: 'Data Strategis', 
      icon: TrendingUp, 
      type: 'parent',
      isOpen: strategisOpen,
      setOpen: setStrategisOpen,
      subItems: [
        { id: 'misi-bupati', label: 'Visi & 4 Misi Strategis' },
        { id: 'misi-1', label: 'Misi 1 — Perubahan Sosial Masyarakat' },
        { id: 'misi-2', label: 'Misi 2 — Perubahan Perekonomian Daerah' },
        { id: 'misi-3', label: 'Misi 3 — Infrastruktur Pelayanan Publik' },
        { id: 'misi-4', label: 'Misi 4 — Tata Kelola Pemerintahan' },
        { id: 'strategis', label: 'Indikator Makro' },
        { id: 'inpres', label: 'Pelaporan INPRES 8 (DTSEN)' }
      ]
    },


    // Collapsible Menu: Data Sektoral
    { 
      id: 'sektoral-parent', 
      label: 'Data Sektoral', 
      icon: Layers, 
      type: 'parent',
      isOpen: sektoralOpen,
      setOpen: setSektoralOpen,
      subItems: [
        { id: 'sektoral', label: 'Profil Sektoral OPD' }
      ]
    },

    { id: 'peta', label: 'Peta Administrasi', icon: Map, type: 'link', badge: 'GIS' },
    
    // Collapsible Menu: Harga Pangan & TPID
    {
      id: 'tpid-parent',
      label: 'Harga Pangan & TPID',
      icon: ShoppingBag,
      type: 'parent',
      isOpen: tpidOpen,
      setOpen: setTpidOpen,
      subItems: [
        { id: 'tpid-harga', label: 'Harga Harian Bapokting' },
        { id: 'tpid-inflasi', label: 'Tren Inflasi Daerah' }
      ]
    },
    
    // Collapsible Menu: APBD Tahun Berjalan (with submenus)
    {
      id: 'apbd-parent',
      label: 'APBD Tahun Berjalan',
      icon: PieChart,
      type: 'parent',
      isOpen: apbdOpen,
      setOpen: setApbdOpen,
      subItems: [
        { id: 'apbd-ringkasan', label: 'Ringkasan APBD' },
        { id: 'apbd-belanja', label: 'Realisasi Belanja OPD' },
        { id: 'apbd-pendapatan', label: 'Realisasi Pendapatan OPD' }
      ]
    },

    { id: 'ewalidata', label: 'e-Walidata SDI', icon: Database, type: 'link' },
    { id: 'investasi', label: 'Investasi Daerah', icon: Landmark, type: 'link' },
    { id: '112', label: 'Pengaduan & 112', icon: PhoneCall, type: 'link', badge: 'Live' },
    { id: 'dokumen', label: 'Dokumen Publikasi', icon: FileText, type: 'link' }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-30 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed lg:static top-16 left-0 h-[calc(100vh-4rem)] bg-slate-950/95 z-30 transition-all duration-300 shrink-0 overflow-hidden
        ${sidebarOpen 
          ? 'w-64 opacity-100 border-r border-slate-800/80 translate-x-0' 
          : 'w-0 opacity-0 border-none -translate-x-full lg:translate-x-0 pointer-events-none'}
      `}>
        <div className="w-64 flex flex-col h-full">
          {/* Menu Label & Collapse Toggle */}
          <div className="px-4 pt-3 pb-2 flex items-center justify-between">
            <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              Menu Utama Dashboard HST
            </p>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Sembunyikan Sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Navigation */}
          <nav className="flex-1 px-3 space-y-1 overflow-y-auto py-2">
            {menuItems.map((item) => {
              const Icon = item.icon;

              if (item.type === 'link') {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                    }}
                    className={`
                      w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group
                      ${isActive 
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-950/50' 
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 transition ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-400'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge ? (
                      <span className={`
                        text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider border
                        ${isActive 
                          ? 'bg-white/20 text-white border-white/30' 
                          : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30'}
                      `}>
                        {item.badge}
                      </span>
                    ) : (
                      <ChevronRight className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition ${isActive ? 'opacity-100 text-white' : 'text-slate-500'}`} />
                    )}
                  </button>
                );
              }

              // Parent collapsible menu
              if (item.type === 'parent') {
                const isSubActive = item.subItems.some(sub => sub.id === activeTab);
                return (
                  <div key={item.id} className="space-y-1">
                    <button
                      onClick={() => item.setOpen(!item.isOpen)}
                      className={`
                        w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200
                        ${isSubActive ? 'text-white bg-slate-900/40' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isSubActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {/* Submenu Items */}
                    {item.isOpen && (
                      <div className="pl-9 space-y-1 transition duration-200">
                        {item.subItems.map((sub) => {
                          const isSelected = activeTab === sub.id;
                          return (
                            <button
                              key={sub.id}
                              onClick={() => {
                                setActiveTab(sub.id);
                              }}
                              className={`
                                w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200
                                ${isSelected 
                                  ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold shadow' 
                                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'}
                              `}
                            >
                              {sub.label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return null;
            })}
          </nav>

          {/* Footer Widget inside Sidebar */}
          <div className="p-4 m-3 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/20 text-center shrink-0">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 mx-auto mb-2 shadow-glow-green">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h5 className="text-xs font-bold text-slate-200">Satu Data Indonesia</h5>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Diskominfo SP HST
            </p>
            <div className="mt-2 text-[10px] text-emerald-400 font-semibold bg-emerald-950/80 py-1 px-2 rounded-lg border border-emerald-800/40">
              #HST_MURAKATA
            </div>
          </div>
        </div>

      </aside>
    </>
  );
}

