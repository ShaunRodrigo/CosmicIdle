import React, { useEffect, useState, useRef } from 'react';
import { generateNewsHeadline } from '../services/geminiService';
import { GameState } from '../types';

interface NewsTickerProps {
  gameState: GameState;
}

export const NewsTicker: React.FC<NewsTickerProps> = ({ gameState }) => {
  const [headline, setHeadline] = useState<string>("Initializing Galactic News Network...");
  const [loading, setLoading] = useState(false);
  const lastFetchTotalRef = useRef<number>(0);

  useEffect(() => {
    // Initial fetch
    fetchNews();
    
    // Set up interval for regular news updates
    const interval = setInterval(() => {
       // Only fetch if meaningful progress has been made to save API calls and make them relevant
       if (gameState.totalStardustCollected > lastFetchTotalRef.current * 1.5 || gameState.totalStardustCollected > lastFetchTotalRef.current + 100) {
           fetchNews();
       }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.inventory]); // Also refetch if inventory changes significantly (captured by logic inside fetchNews somewhat)

  const fetchNews = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const newHeadline = await generateNewsHeadline(gameState);
      setHeadline(newHeadline);
      lastFetchTotalRef.current = gameState.totalStardustCollected;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-slate-950 border-y border-cyan-900/50 h-10 flex items-center overflow-hidden relative">
      <div className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-slate-950 to-transparent w-8 z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 bg-gradient-to-l from-slate-950 to-transparent w-8 z-10 pointer-events-none"></div>
      
      <div className="whitespace-nowrap animate-marquee flex items-center text-cyan-400/80 font-mono text-sm tracking-wider">
         <span className="mx-4 text-cyan-600 font-bold">[GNN]</span>
         {headline}
         <span className="mx-20">///</span>
         <span className="mx-4 text-cyan-600 font-bold">[GNN]</span>
         {headline}
         <span className="mx-20">///</span>
         <span className="mx-4 text-cyan-600 font-bold">[GNN]</span>
         {headline}
      </div>

      <style>{`
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};