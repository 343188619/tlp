import React from 'react';
import { TarotCardData } from '../types';

interface TarotCardProps {
  data?: TarotCardData;
  isFlipped: boolean;
  isReversed?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  showLabel?: boolean;
}

const TarotCard: React.FC<TarotCardProps> = ({ 
  data, 
  isFlipped, 
  isReversed = false, 
  onClick, 
  className = "",
  style = {},
  showLabel = false
}) => {
  return (
    <div 
      className={`relative w-48 h-80 cursor-pointer group perspective-1000 ${className}`}
      onClick={onClick}
      style={style}
    >
      <div 
        className={`relative w-full h-full duration-1000 transform-style-3d transition-transform ease-in-out shadow-2xl`}
        style={{ 
          transform: `
            rotateY(${isFlipped ? 180 : 0}deg) 
            rotateZ(${isFlipped && isReversed ? 180 : 0}deg)
          ` 
        }}
      >
        {/* Card Back */}
        <div 
          className="absolute w-full h-full backface-hidden rounded-xl border-2 border-indigo-900 overflow-hidden"
          style={{ 
            backgroundImage: 'radial-gradient(circle at center, #312e81 0%, #1e1b4b 100%)',
            boxShadow: '0 0 15px rgba(99, 102, 241, 0.3)'
          }}
        >
            {/* Mystic Pattern on Back */}
            <div className="absolute inset-2 border border-indigo-500/30 rounded-lg flex items-center justify-center opacity-40">
                <div className="w-24 h-24 border-2 border-indigo-400 rotate-45 flex items-center justify-center">
                    <div className="w-16 h-16 border border-indigo-300"></div>
                </div>
            </div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
        </div>

        {/* Card Front */}
        <div 
          className="absolute w-full h-full backface-hidden rounded-xl bg-slate-900 border-2 border-amber-500/50 overflow-hidden"
          style={{ transform: 'rotateY(180deg)' }}
        >
          {data ? (
            <>
              {/* Image Placeholder - using abstract/nature terms for aesthetics */}
              <div className="h-4/5 w-full relative overflow-hidden">
                <div className="absolute inset-0 bg-slate-800 animate-pulse" /> {/* Loading state */}
                <img 
                  src={`https://picsum.photos/seed/${data.id + data.imageKeyword}/400/600?grayscale&blur=1`}
                  alt={data.name}
                  className="w-full h-full object-cover mix-blend-overlay opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
              </div>
              
              {/* Card Text */}
              <div className="absolute bottom-0 w-full h-1/5 bg-slate-900 flex flex-col items-center justify-center border-t border-amber-500/30">
                 <span className="text-amber-500 font-cinzel text-xs tracking-widest uppercase">{data.nameEn}</span>
                 <span className="text-slate-200 font-serif text-lg tracking-widest">{data.name}</span>
              </div>

              {/* Gold Accents */}
              <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-amber-400"></div>
              <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-amber-400"></div>
              <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-amber-400"></div>
              <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-amber-400"></div>
            </>
          ) : (
             <div className="flex items-center justify-center h-full text-white">Unknown</div>
          )}
        </div>
      </div>
      
      {/* Label (Optional) */}
      {showLabel && data && isFlipped && (
        <div className="absolute -bottom-12 w-full text-center opacity-0 animate-[fadeIn_1s_ease-in_forwards]">
            <span className="text-amber-200 text-sm bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
                {isReversed ? '逆位' : '正位'}
            </span>
        </div>
      )}
    </div>
  );
};

export default TarotCard;