import React, { useState } from 'react';
import { Sparkles, Send, X, Bot, User, HelpCircle, Database, CheckCircle2 } from 'lucide-react';
import { macroStats, apbdData, hstInfo } from '../data/mockData';

export default function AiCopilotModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: `Halo! Saya **MurakataAI**, Asisten Cerdas Satu Data Kabupaten Hulu Sungai Tengah (#HST_MURAKATA). Saya siap membantu Anda menganalisis statistik IPM, PDRB, APBD, data 11 kecamatan, hingga peta ekowisata Meratus. Ada yang bisa saya bantu?`
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sampleQuestions = [
    "Berapa IPM dan pertumbuhan ekonomi HST saat ini?",
    "Bagaimana statistik 11 kecamatan di HST?",
    "Berapa target dan realisasi APBD HST 2026?",
    "Apa saja potensi ekowisata di Pegunungan Meratus?"
  ];

  const handleSend = (textToSend) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { sender: 'user', text: query }]);
    if (!textToSend) setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      let botAnswer = "";
      const qLower = query.toLowerCase();

      if (qLower.includes("ipm") || qLower.includes("ekonomi") || qLower.includes("pdrb")) {
        botAnswer = `Berdasarkan data BPS & Bappeda Litbang HST:\n\n• **Indeks Pembangunan Manusia (IPM)**: ${macroStats.ipm.value} (Tinggi, naik ${macroStats.ipm.change})\n• **Pertumbuhan Ekonomi**: ${macroStats.pertumbuhanEkonomi.value}\n• **Kemiskinan**: ${macroStats.kemiskinan.value} (Terendah di kawasan Banua Enam)\n• **PDRB Total**: ${macroStats.pdrb.value} (Sektor utama: Pertanian & Jasa)`;
      } else if (qLower.includes("kecamatan") || qLower.includes("wilayah") || qLower.includes("barabai")) {
        botAnswer = `Kabupaten Hulu Sungai Tengah memiliki **11 Kecamatan** dengan pusat pemerintahan di **Barabai**:\n\n1. Barabai (Pusat Perkotaan)\n2. Batu Benawa (Ekowisata Pagat)\n3. Hantakan (Lereng Meratus & Nateh)\n4. Haruyan (Perkebunan Karet)\n5. Labuan Amas Selatan & Utara\n6. Batang Alai Selatan, Timur, Utara (Lumbung Padi)\n7. Limpasu & Pandawan.`;
      } else if (qLower.includes("apbd") || qLower.includes("anggaran") || qLower.includes("belanja")) {
        botAnswer = `Ringkasan **APBD Kabupaten Hulu Sungai Tengah T.A 2025/2026**:\n\n• **Target Pendapatan**: Rp 1,85 Triliun\n• **Realisasi Belanja**: 76,8% (Rp 1,40 Triliun)\n• **Alokasi Utama**: Pendidikan (24,0%), Infrastruktur (22,8%), Kesehatan (18,2%), Pertanian (15,5%).`;
      } else if (qLower.includes("meratus") || qLower.includes("wisata") || qLower.includes("investasi")) {
        botAnswer = `Potensi **Ekowisata & Investasi HST**:\n\n1. **Ekowisata Pagat Batu Benawa**: Wisata bukit batu kapur & arung jeram sungai benawa.\n2. **Ekowisata Nateh Hantakan**: Pemandangan lereng Pegunungan Meratus.\n3. **Beras Organik Murakata**: Sentra pengolahan padi lokal unggulan di Batang Alai.`;
      } else {
        botAnswer = `Terima kasih atas pertanyaan Anda tentang "${query}". Data ini telah tercatat dalam portal Satu Data HST. Anda dapat melihat detail lebih lengkap melalui menu eWalidata SIPD atau Peta GIS 11 Kecamatan!`;
      }

      setMessages(prev => [...prev, { sender: 'bot', text: botAnswer }]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-emerald-500/40 rounded-3xl shadow-2xl flex flex-col h-[550px] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-glow-green">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Murakata AI Assistant</h3>
              <p className="text-[11px] text-emerald-400">Satu Data Kabupaten Hulu Sungai Tengah</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 text-xs bg-slate-50 dark:bg-slate-900/40">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex items-start gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.sender === 'bot' && (
                <div className="w-7 h-7 rounded-xl bg-emerald-500/10 dark:bg-emerald-600/30 border border-emerald-500/20 dark:border-emerald-500/40 text-emerald-600 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              
              <div className={`p-3.5 rounded-2xl max-w-md space-y-1 ${
                m.sender === 'user'
                  ? 'bg-emerald-600 text-white rounded-tr-none shadow-md'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none leading-relaxed whitespace-pre-line shadow-sm'
              }`}>
                <p>{m.text}</p>
              </div>

              {m.sender === 'user' && (
                <div className="w-7 h-7 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-650 dark:text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-slate-400 text-xs italic pl-10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              MurakataAI sedang memproses jawaban...
            </div>
          )}
        </div>

        {/* Suggestion Chips */}
        <div className="px-6 py-2 bg-slate-100/50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800/60 flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="text-slate-500 dark:text-slate-400 font-semibold shrink-0">Contoh:</span>
          {sampleQuestions.map((q, i) => (
            <button 
              key={i} 
              onClick={() => handleSend(q)}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-emerald-950 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 whitespace-nowrap transition"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input 
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Tanyakan statistik, APBD, atau indikator HST..."
              className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
            <button 
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-lg shadow-emerald-950/80"
            >
              <Send className="w-3.5 h-3.5" /> Kirim
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
