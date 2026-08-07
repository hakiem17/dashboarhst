import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight } from 'lucide-react';

// Responsive Dynamic Scaling Tableau Embed Component
function TableauEmbed() {
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (wrapperRef.current) {
        const parentWidth = wrapperRef.current.getBoundingClientRect().width;
        // Standard layout width padding is around 32px (p-4 = 16px left + 16px right)
        const contentWidth = parentWidth - 32; 
        const targetWidth = 1400; // Original Tableau width specification
        
        if (contentWidth < targetWidth) {
          setScale(contentWidth / targetWidth);
        } else {
          setScale(1);
        }
      }
    };

    // Listen to resize events
    window.addEventListener('resize', handleResize);
    // Initial scaling calculation
    handleResize();

    // Dynamically insert the Tableau visualization script on mount
    const scriptUrl = 'https://public.tableau.com/javascripts/api/viz_v1.js';
    const scriptElement = document.createElement('script');
    scriptElement.src = scriptUrl;
    scriptElement.type = 'text/javascript';
    
    const divElement = containerRef.current;
    if (divElement) {
      const vizElement = divElement.getElementsByTagName('object')[0];
      if (vizElement) {
        vizElement.style.width = '1400px';
        vizElement.style.height = '5527px';
        vizElement.parentNode.insertBefore(scriptElement, vizElement);
      }
    }

    // Extra trigger to ensure correct scale after DOM settles
    const timer = setTimeout(handleResize, 300);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
      if (scriptElement && scriptElement.parentNode) {
        scriptElement.parentNode.removeChild(scriptElement);
      }
    };
  }, []);

  return (
    <div 
      ref={wrapperRef}
      className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white p-4 shadow-md flex justify-center overflow-hidden"
    >
      {/* Sizing Wrapper: locks the layout dimensions to the scaled boundaries */}
      <div
        style={{
          width: `${1400 * scale}px`,
          height: `${5527 * scale}px`,
          overflow: 'hidden',
          transition: 'all 0.1s ease-out'
        }}
        className="mx-auto"
      >
        <div 
          ref={containerRef}
          className="tableauPlaceholder" 
          id="viz1784787248607" 
          style={{ 
            position: 'relative', 
            width: '1400px', 
            height: '5527px',
            transform: `scale(${scale})`,
            WebkitTransform: `scale(${scale})`,
            transformOrigin: 'top left',
            WebkitTransformOrigin: 'top left'
          }}
        >
          <noscript>
            <a href="#">
              <img 
                alt="DS_INTERVENSI KEMISKINAN " 
                src="https://public.tableau.com/static/images/WN/WN4JXRFRQ/1_rss.png" 
                style={{ border: 'none' }} 
              />
            </a>
          </noscript>
          
          <object className="tableauViz" style={{ display: 'none' }}>
            <param name="host_url" value="https%3A%2F%2Fpublic.tableau.com%2F" />
            <param name="embed_code_version" value="3" />
            <param name="path" value="shared/WN4JXRFRQ" />
            <param name="toolbar" value="yes" />
            <param name="static_image" value="https://public.tableau.com/static/images/WN/WN4JXRFRQ/1.png" />
            <param name="animate_transition" value="yes" />
            <param name="display_static_image" value="yes" />
            <param name="display_spinner" value="yes" />
            <param name="display_overlay" value="yes" />
            <param name="display_count" value="yes" />
            <param name="tabs" value="no" />
            <param name="language" value="en-US" />
          </object>
        </div>
      </div>
    </div>
  );
}

import DtsenAnalyticsView from './DtsenAnalyticsView';
import { Users, User, LayoutGrid } from 'lucide-react';

export default function DtsenView({ darkMode, defaultSubTab = 'keluarga' }) {
  const [subTab, setSubTab] = useState(defaultSubTab);

  // Sync subTab if defaultSubTab prop changes (e.g., via sidebar navigation)
  useEffect(() => {
    setSubTab(defaultSubTab);
  }, [defaultSubTab]);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header & Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 font-sans tracking-tight">
            INPRES 8 / DTSEN Kab. Hulu Sungai Tengah
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Analisis Data Micro Sosio Ekonomi (CSV 2026) & Pelaporan Resmi Kemenko PM
          </p>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center gap-1.5 bg-slate-200 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-300 dark:border-slate-800 shrink-0">
          <button
            onClick={() => setSubTab('keluarga')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              subTab === 'keluarga'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Data Keluarga (KK)</span>
          </button>

          <button
            onClick={() => setSubTab('individu')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              subTab === 'individu'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Data Individu (NIK)</span>
          </button>

        </div>
      </div>

      {/* Render selected view */}
      {subTab === 'keluarga' && (
        <DtsenAnalyticsView darkMode={darkMode} defaultMode="household" />
      )}

      {subTab === 'individu' && (
        <DtsenAnalyticsView darkMode={darkMode} defaultMode="individual" />
      )}
    </div>
  );
}


