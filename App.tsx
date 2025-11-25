import React, { useState, useRef, useEffect } from 'react';
import StarField from './components/StarField';
import TarotCard from './components/TarotCard';
import { MAJOR_ARCANA } from './constants';
import { AppState, SelectedCard, ReadingResult } from './types';
import { getTarotReading } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('intro');
  const [question, setQuestion] = useState('');
  const [selectedCards, setSelectedCards] = useState<SelectedCard[]>([]);
  const [deck, setDeck] = useState<number[]>([]);
  const [reading, setReading] = useState<ReadingResult | null>(null);
  const [revealedCount, setRevealedCount] = useState(0);
  const [isReadingLoading, setIsReadingLoading] = useState(false);

  // Initialize deck with IDs
  useEffect(() => {
    setDeck(MAJOR_ARCANA.map(c => c.id));
  }, []);

  const handleStart = () => {
    if (!question.trim()) return;
    setAppState('shuffling');
    // Simulate shuffle animation time
    setTimeout(() => {
      setAppState('selecting');
    }, 2500);
  };

  const handleSelectCard = (index: number) => {
    if (selectedCards.length >= 3) return;

    // Pick a random card from the remaining "deck" logic (visual only, we just pick random ID)
    const availableCards = MAJOR_ARCANA.filter(c => !selectedCards.find(sc => sc.id === c.id));
    const randomCard = availableCards[Math.floor(Math.random() * availableCards.length)];
    
    // Determine position
    const positions: ('past' | 'present' | 'future')[] = ['past', 'present', 'future'];
    const position = positions[selectedCards.length];

    // 20% chance of reversal
    const isReversed = Math.random() < 0.2;

    const newSelection: SelectedCard = {
      ...randomCard,
      isReversed,
      position
    };

    const newSelected = [...selectedCards, newSelection];
    setSelectedCards(newSelected);

    if (newSelected.length === 3) {
      setTimeout(() => setAppState('revealing'), 1000);
    }
  };

  const revealCard = (index: number) => {
    if (index !== revealedCount) return; // Force sequential reveal
    setRevealedCount(prev => prev + 1);
  };

  useEffect(() => {
    if (revealedCount === 3 && appState === 'revealing') {
      const fetchReading = async () => {
        setIsReadingLoading(true);
        const result = await getTarotReading(question, selectedCards);
        setReading(result);
        setIsReadingLoading(false);
        setAppState('reading');
      };
      // Small delay for dramatic effect after last card flip
      setTimeout(fetchReading, 1500);
    }
  }, [revealedCount, appState, question, selectedCards]);

  const resetApp = () => {
    setAppState('intro');
    setQuestion('');
    setSelectedCards([]);
    setReading(null);
    setRevealedCount(0);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center overflow-hidden">
      <StarField />

      {/* Header */}
      <header className="fixed top-0 w-full p-6 z-50 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <h1 className="text-2xl md:text-3xl font-cinzel text-amber-500 tracking-widest drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]">
          灵境塔罗
        </h1>
        {appState !== 'intro' && (
          <button onClick={resetApp} className="text-slate-400 hover:text-white transition-colors text-sm uppercase tracking-widest">
            重启命运
          </button>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-grow w-full flex flex-col items-center justify-center p-4 relative z-10 perspective-2000">
        
        {/* INTRO PHASE */}
        {appState === 'intro' && (
          <div className="w-full max-w-md text-center space-y-8 animate-[fadeIn_1s_ease-in]">
            <div className="w-32 h-32 mx-auto rounded-full border-2 border-amber-500/30 flex items-center justify-center relative">
              <div className="absolute inset-0 rounded-full bg-amber-500/10 blur-xl animate-pulse"></div>
              <span className="text-6xl">🔮</span>
            </div>
            <h2 className="text-3xl font-serif text-slate-100">向虚空提问</h2>
            <p className="text-slate-400 italic">"星辰知晓过去，现在，与未来。"</p>
            
            <div className="space-y-6">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="在此输入你心中的疑惑..."
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-6 py-4 text-center text-lg text-amber-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)]"
              />
              <button
                onClick={handleStart}
                disabled={!question.trim()}
                className="group relative px-8 py-3 bg-transparent overflow-hidden rounded-full transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 opacity-80 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute inset-0 border border-amber-500/50 rounded-full group-hover:border-amber-400 transition-colors"></div>
                <span className="relative text-amber-100 font-cinzel tracking-widest uppercase group-hover:text-white">
                  开启法阵
                </span>
              </button>
            </div>
          </div>
        )}

        {/* SHUFFLING PHASE */}
        {appState === 'shuffling' && (
          <div className="relative w-64 h-96">
            {MAJOR_ARCANA.slice(0, 5).map((_, i) => (
              <div
                key={i}
                className="absolute top-0 left-0 w-full h-full animate-pulse"
                style={{
                  animation: `shuffleCard 2s infinite ease-in-out`,
                  animationDelay: `${i * 0.1}s`,
                  zIndex: i
                }}
              >
                <TarotCard isFlipped={false} />
              </div>
            ))}
            <div className="absolute -bottom-20 w-full text-center text-amber-500/80 font-cinzel animate-pulse">
              洗牌中...
            </div>
          </div>
        )}

        {/* SELECTING PHASE */}
        {appState === 'selecting' && (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <h3 className="text-xl text-amber-200/80 mb-8 font-serif animate-pulse">
               请凭直觉抽取三张牌 ({selectedCards.length}/3)
            </h3>
            <div className="relative w-full max-w-4xl h-64 flex justify-center items-center perspective-1000">
               {/* Fan Display Logic */}
               <div className="relative w-full flex justify-center items-center h-full">
                 {Array.from({ length: 22 }).map((_, i) => {
                   const angle = (i - 11) * 3; // Fan angle
                   const translateY = Math.abs(i - 11) * 2; // Arc effect
                   const isSelected = selectedCards.length > i; // Visual hack for cards disappearing
                   
                   if (isSelected) return null; // Don't render taken cards in deck

                   return (
                     <div
                       key={i}
                       onClick={() => handleSelectCard(i)}
                       className="absolute transition-all duration-300 hover:-translate-y-10 hover:z-50 cursor-pointer origin-bottom"
                       style={{
                         transform: `rotate(${angle}deg) translateY(${translateY}px) translateX(${(i - 11) * 15}px)`,
                         zIndex: i
                       }}
                     >
                       <div className="w-24 h-40 md:w-32 md:h-48 rounded-lg bg-indigo-950 border border-indigo-700 shadow-xl hover:shadow-amber-500/50 transition-shadow">
                         {/* Simple back pattern */}
                         <div className="w-full h-full opacity-30 bg-[radial-gradient(circle,_#4f46e5_1px,_transparent_1px)] bg-[length:10px_10px]"></div>
                       </div>
                     </div>
                   );
                 })}
               </div>
            </div>
          </div>
        )}

        {/* REVEALING & READING PHASE */}
        {(appState === 'revealing' || appState === 'reading') && (
          <div className="w-full max-w-6xl flex flex-col items-center space-y-12">
            
            {/* The Spread */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 w-full place-items-center">
              {selectedCards.map((card, index) => {
                const isRevealed = index < revealedCount;
                const labels = ["过去 (Past)", "现在 (Present)", "未来 (Future)"];
                
                return (
                  <div key={card.id} className="flex flex-col items-center gap-6 group">
                    <div className="text-slate-400 font-cinzel text-sm tracking-[0.2em] uppercase opacity-70 group-hover:text-amber-500 transition-colors">
                      {labels[index]}
                    </div>
                    <TarotCard
                      data={card}
                      isFlipped={isRevealed}
                      isReversed={card.isReversed}
                      onClick={() => revealCard(index)}
                      showLabel={true}
                      className={`transition-all duration-1000 ${
                         !isRevealed && index === revealedCount ? 'animate-bounce shadow-[0_0_30px_rgba(245,158,11,0.3)]' : ''
                      }`}
                    />
                  </div>
                );
              })}
            </div>

            {/* AI Reading Result */}
            <div className="w-full min-h-[300px] flex items-center justify-center relative">
              {isReadingLoading && (
                 <div className="text-center space-y-4">
                   <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                   <p className="text-amber-500/80 font-serif animate-pulse">群星正在汇聚...</p>
                 </div>
              )}

              {!isReadingLoading && reading && (
                <div className="w-full max-w-4xl bg-black/40 backdrop-blur-md border border-indigo-500/30 rounded-2xl p-8 md:p-12 animate-[fadeInUp_1s_ease-out] shadow-2xl">
                   <h2 className="text-3xl font-cinzel text-center text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-500 to-amber-200 mb-8">
                     星象启示
                   </h2>
                   
                   <div className="space-y-8 text-slate-200 leading-relaxed font-serif">
                     {/* Summary */}
                     <div className="text-center text-xl italic text-amber-100/90 border-b border-indigo-500/30 pb-6">
                       "{reading.summary}"
                     </div>

                     {/* Details Grid */}
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm md:text-base">
                        <div className="space-y-2">
                          <h4 className="text-indigo-400 font-bold uppercase tracking-wider text-xs">Past Influence</h4>
                          <p className="opacity-90">{reading.details.past}</p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-amber-500 font-bold uppercase tracking-wider text-xs">Present Challenge</h4>
                          <p className="opacity-90">{reading.details.present}</p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-indigo-400 font-bold uppercase tracking-wider text-xs">Future Path</h4>
                          <p className="opacity-90">{reading.details.future}</p>
                        </div>
                     </div>

                     {/* Advice */}
                     <div className="bg-indigo-950/30 p-6 rounded-lg border-l-4 border-amber-500 mt-8">
                       <h3 className="text-lg font-cinzel text-amber-500 mb-2">指引 (Guidance)</h3>
                       <p className="text-slate-100">{reading.advice}</p>
                     </div>
                   </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer / Visual Noise */}
      <div className="fixed bottom-0 w-full h-32 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none z-20"></div>
      
      <style>{`
        @keyframes shuffleCard {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          25% { transform: translateX(-50px) rotate(-5deg); }
          75% { transform: translateX(50px) rotate(5deg); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default App;