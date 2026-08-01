import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Bot, User, Loader2 } from 'lucide-react';
import { macroStats, apbdData, hstInfo, misiBupatiData } from '../data/mockData';

// System prompt with HST context so GPT knows the data
const SYSTEM_PROMPT = `Kamu adalah **MurakataAI**, asisten cerdas resmi Kabupaten Hulu Sungai Tengah (HST), Kalimantan Selatan. 
Kamu membantu kepala daerah, staf pemerintah, dan masyarakat menganalisis data pembangunan HST.

## DATA KONTEKS HST:
- **IPM**: ${macroStats.ipm.value} (${macroStats.ipm.change})
- **Kemiskinan**: ${macroStats.kemiskinan.value}  
- **Pertumbuhan Ekonomi**: ${macroStats.pertumbuhanEkonomi.value}
- **PDRB**: ${macroStats.pdrb.value} ${macroStats.pdrb.unit}
- **Inflasi**: ${macroStats.inflasi.value}
- **Pengangguran (TPT)**: ${macroStats.tpt.value}
- **Populasi**: ${hstInfo.jumlahPenduduk}
- **Luas Wilayah**: ${hstInfo.luasWilayah}
- **Jumlah Kecamatan**: ${hstInfo.jumlahKecamatan} (Barabai, Batu Benawa, Hantakan, Haruyan, Labuan Amas Selatan, Labuan Amas Utara, Batang Alai Selatan, Batang Alai Timur, Batang Alai Utara, Limpasu, Pandawan)
- **Ibu Kota**: ${hstInfo.ibuKota}

## 4 MISI BUPATI:
${misiBupatiData.map(m => '- **' + m.misiNo + '**: ' + m.judul + ' — ' + m.tujuan).join('\n')}

## APBD:
- Target Total APBD: Rp 2,15 Triliun
- Realisasi: Rp 1,00 Triliun (46,72%)
- Pendapatan: Rp 1,12 T / Rp 2,10 T (53,33%)

## INSTRUKSI:
1. Jawab dalam **Bahasa Indonesia** yang sopan dan profesional.
2. Gunakan data konteks HST di atas untuk menjawab pertanyaan terkait HST.
3. Jika pertanyaan di luar konteks HST, tetap jawab dengan sopan tapi ingatkan fokus pada data HST.
4. Format jawaban dengan bullet points dan bold untuk angka penting.
5. Tambahkan emoji yang relevan untuk membuat jawaban lebih informatif.
6. Jika ditanya hal yang tidak ada datanya, katakan "Data ini belum tersedia di portal Satu Data HST" dan sarankan sumber data yang relevan.
7. Jawab secara ringkas tapi informatif, maksimal 250 kata.`;

export default function AiCopilotModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Halo! Saya **MurakataAI** 🤖, Asisten Cerdas Satu Data Kabupaten Hulu Sungai Tengah. Saya terhubung dengan **OpenAI GPT-4o** dan siap membantu Anda menganalisis:\n\n📊 Statistik IPM, PDRB, Kemiskinan\n💰 Data APBD & Realisasi Belanja\n🗺️ Info 11 Kecamatan di HST\n🏛️ 4 Misi Strategis Bupati\n🌿 Potensi Ekowisata Meratus\n\nAda yang bisa saya bantu?`
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const sampleQuestions = [
    "Berapa IPM dan pertumbuhan ekonomi HST?",
    "Analisis APBD HST 2025/2026",
    "Apa 4 Misi strategis Bupati HST?",
    "Potensi ekowisata Pegunungan Meratus?"
  ];

  const handleSend = async (textToSend) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || isLoading) return;

    const userMessage = { role: 'user', content: query };
    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInputQuery('');
    setIsLoading(true);
    setError(null);

    // Build message history for OpenAI (system + last 10 messages for context)
    const historyForApi = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.slice(-10).map(m => ({
        role: m.role,
        content: m.content
      })),
      userMessage
    ];

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: historyForApi }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const assistantMessage = data.choices?.[0]?.message?.content || 'Maaf, tidak ada respons dari AI.';

      setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);
    } catch (err) {
      console.error('AI Chat Error:', err);
      setError(err.message);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `⚠️ Maaf, terjadi kesalahan koneksi AI: **${err.message}**\n\nSilakan coba lagi dalam beberapa saat.`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Simple markdown bold renderer
  const renderText = (text) => {
    return text.split('\n').map((line, i) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j} className="font-extrabold">{part.slice(2, -2)}</strong>;
        }
        return part;
      });
      return <span key={i}>{parts}{i < text.split('\n').length - 1 && <br />}</span>;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-emerald-500/40 rounded-3xl shadow-2xl flex flex-col h-[600px] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-glow-green">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Murakata AI Assistant</h3>
              <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Powered by OpenAI GPT-4o · Satu Data HST
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 text-xs bg-slate-50 dark:bg-slate-900/40">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex items-start gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'assistant' && (
                <div className="w-7 h-7 rounded-xl bg-emerald-500/10 dark:bg-emerald-600/30 border border-emerald-500/20 dark:border-emerald-500/40 text-emerald-600 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              
              <div className={`p-3.5 rounded-2xl max-w-md space-y-1 ${
                m.role === 'user'
                  ? 'bg-emerald-600 text-white rounded-tr-none shadow-md'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none leading-relaxed shadow-sm'
              }`}>
                <div>{renderText(m.content)}</div>
              </div>

              {m.role === 'user' && (
                <div className="w-7 h-7 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-650 dark:text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3 pl-10">
              <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-tl-none shadow-sm">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                  <span className="text-xs">MurakataAI sedang berpikir...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="px-6 py-2 bg-slate-100/50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800/60 flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="text-slate-500 dark:text-slate-400 font-semibold shrink-0">Contoh:</span>
          {sampleQuestions.map((q, i) => (
            <button 
              key={i} 
              onClick={() => handleSend(q)}
              disabled={isLoading}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-emerald-950 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 whitespace-nowrap transition disabled:opacity-50"
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
              placeholder="Tanyakan apa saja tentang data HST ke MurakataAI..."
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
            />
            <button 
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-lg shadow-emerald-950/80 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              {isLoading ? 'Proses...' : 'Kirim'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
