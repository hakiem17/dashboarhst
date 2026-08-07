import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import HomeView from './views/HomeView';
import PetaAdministrasiView from './views/PetaAdministrasiView';
import EWalidataView from './views/EWalidataView';
import DataStrategisView from './views/DataStrategisView';
import ApbdView from './views/ApbdView';
import BmkgWeatherView from './views/BmkgWeatherView';
import Emergency112View from './views/Emergency112View';
import InvestasiView from './views/InvestasiView';
import ProfilDaerahView from './views/ProfilDaerahView';
import SektoralView from './views/SektoralView';
import DokumenView from './views/DokumenView';
import AiCopilotModal from './components/AiCopilotModal';
import DtsenView from './views/DtsenView';
import TpidView from './views/TpidView';
import Misi1View from './views/Misi1View';
import Misi2View from './views/Misi2View';
import Misi3View from './views/Misi3View';
import Misi4View from './views/Misi4View';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [darkMode, setDarkMode] = useState(true);
  const [activeYear, setActiveYear] = useState('2026');
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [darkMode]);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView onNavigate={setActiveTab} onOpenAiCopilot={() => setIsAiOpen(true)} darkMode={darkMode} />;
      case 'peta':
        return <PetaAdministrasiView />;
      case 'ewalidata':
        return <EWalidataView />;
      case 'misi-1':
        return <Misi1View darkMode={darkMode} onNavigate={setActiveTab} />;
      case 'misi-2':
        return <Misi2View darkMode={darkMode} onNavigate={setActiveTab} />;
      case 'misi-3':
        return <Misi3View darkMode={darkMode} onNavigate={setActiveTab} />;
      case 'misi-4':
        return <Misi4View darkMode={darkMode} onNavigate={setActiveTab} />;
      case 'misi-bupati':
      case 'strategis':
        return <DataStrategisView darkMode={darkMode} />;
      case 'dtsen-keluarga':
        return <DtsenView darkMode={darkMode} defaultSubTab="keluarga" />;
      case 'dtsen-individu':
        return <DtsenView darkMode={darkMode} defaultSubTab="individu" />;
      case 'dtsen-analytics':
        return <DtsenView darkMode={darkMode} defaultSubTab="keluarga" />;
      case 'inpres':
        return <DtsenView darkMode={darkMode} defaultSubTab="keluarga" />;
      case 'tpid-harga':
      case 'tpid-inflasi':
        return <TpidView activeSubView={activeTab} darkMode={darkMode} />;
      case 'apbd-ringkasan':
      case 'apbd-belanja':
      case 'apbd-pendapatan':
        return <ApbdView activeSubView={activeTab} />;
      case 'cuaca':
        return <BmkgWeatherView />;
      case '112':
        return <Emergency112View />;
      case 'investasi':
        return <InvestasiView />;
      case 'profil':
        return <ProfilDaerahView />;
      case 'sektoral':
        return <SektoralView />;
      case 'dokumen':
        return <DokumenView />;
      default:
        return <HomeView onNavigate={setActiveTab} onOpenAiCopilot={() => setIsAiOpen(true)} />;
    }
  };

  return (
    <div className={`h-screen overflow-hidden ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-800'} font-sans flex flex-col`}>
      
      {/* Top Navbar */}
      <Navbar 
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        activeYear={activeYear}
        setActiveYear={setActiveYear}
        onOpenAiCopilot={() => setIsAiOpen(true)}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
        onGoHome={() => setActiveTab('home')}
      />

      {/* Main Body Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar Navigation */}
        <Sidebar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Dynamic Content View Area */}
        <main className={`flex-1 overflow-y-auto w-full ${
          activeTab === 'home' 
            ? 'p-2 sm:p-3 overflow-hidden' 
            : 'p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto'
        }`}>
          {renderActiveView()}
        </main>

      </div>

      {/* AI Copilot Modal */}
      <AiCopilotModal 
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
      />

    </div>
  );
}
