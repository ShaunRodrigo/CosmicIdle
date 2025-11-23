import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, ClickEffect, Building } from './types';
import { INITIAL_GAME_STATE, BUILDINGS, COST_SCALING_FACTOR } from './constants';
import { BuildingItem } from './components/BuildingItem';
import { NewsTicker } from './components/NewsTicker';
import { Star, Zap, Save, RefreshCw } from 'lucide-react';

const TICK_RATE_MS = 100; // Game loop runs 10 times a second
const SAVE_INTERVAL_MS = 10000; // Save every 10 seconds

function App() {
  // --- State ---
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('cosmicIdleState');
    return saved ? JSON.parse(saved) : INITIAL_GAME_STATE;
  });
  
  const [clickEffects, setClickEffects] = useState<ClickEffect[]>([]);
  const [cps, setCps] = useState(0);

  // Refs for loop
  const gameStateRef = useRef(gameState);
  
  // Update ref whenever state changes (needed for intervals)
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  // --- Helpers ---
  const calculateCPS = useCallback((inventory: Record<string, number>) => {
    return Object.entries(inventory).reduce((total, [id, count]) => {
      const building = BUILDINGS.find(b => b.id === id);
      return total + (building ? building.baseCPS * count : 0);
    }, 0);
  }, []);

  // --- Game Loop ---
  useEffect(() => {
    const loop = setInterval(() => {
      setGameState(current => {
        const currentCPS = calculateCPS(current.inventory);
        const stardustToAdd = currentCPS * (TICK_RATE_MS / 1000);
        
        return {
          ...current,
          stardust: current.stardust + stardustToAdd,
          totalStardustCollected: current.totalStardustCollected + stardustToAdd,
        };
      });
      
      // Update local CPS state for display
      setCps(calculateCPS(gameStateRef.current.inventory));

    }, TICK_RATE_MS);

    return () => clearInterval(loop);
  }, [calculateCPS]);

  // --- Auto Save ---
  useEffect(() => {
    const saveLoop = setInterval(() => {
      localStorage.setItem('cosmicIdleState', JSON.stringify(gameStateRef.current));
      setGameState(current => ({ ...current, lastSaveTime: Date.now() }));
    }, SAVE_INTERVAL_MS);

    return () => clearInterval(saveLoop);
  }, []);

  // --- Handlers ---
  const handleMainClick = (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    // Prevent default to stop zooming on mobile
    // e.preventDefault(); 
    
    // Calculate click power (Base 1 + upgrades in future)
    const clickPower = 1;

    // Get coordinates for effect
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    // Add visual effect
    const newEffect: ClickEffect = {
      id: Date.now() + Math.random(),
      x: clientX,
      y: clientY,
      value: clickPower,
    };
    setClickEffects(prev => [...prev, newEffect]);
    
    // Cleanup effect after animation
    setTimeout(() => {
      setClickEffects(prev => prev.filter(ef => ef.id !== newEffect.id));
    }, 1000);

    // Update State
    setGameState(prev => ({
      ...prev,
      stardust: prev.stardust + clickPower,
      totalStardustCollected: prev.totalStardustCollected + clickPower,
      clickCount: prev.clickCount + 1,
    }));
  };

  const buyBuilding = (buildingId: string) => {
    setGameState(prev => {
      const building = BUILDINGS.find(b => b.id === buildingId);
      if (!building) return prev;

      const count = prev.inventory[buildingId] || 0;
      const cost = Math.floor(building.baseCost * Math.pow(COST_SCALING_FACTOR, count));

      if (prev.stardust >= cost) {
        return {
          ...prev,
          stardust: prev.stardust - cost,
          inventory: {
            ...prev.inventory,
            [buildingId]: count + 1,
          }
        };
      }
      return prev;
    });
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to wipe your universe and start over?")) {
      setGameState(INITIAL_GAME_STATE);
      localStorage.removeItem('cosmicIdleState');
    }
  };

  // --- Render ---
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 overflow-hidden">
      
      {/* Top Bar */}
      <header className="bg-slate-950 border-b border-slate-800 p-4 shadow-lg z-20 flex justify-between items-center">
        <div className="flex items-center gap-3">
            <div className="bg-cyan-500/20 p-2 rounded-lg">
                <Star className="w-6 h-6 text-cyan-400 animate-spin-slow" />
            </div>
            <div>
                <h1 className="text-xl md:text-2xl font-sci-fi font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                COSMIC IDLE
                </h1>
                <p className="text-xs text-slate-500 font-mono">Build v1.0.0</p>
            </div>
        </div>
        
        <div className="flex gap-4 items-center">
             <div className="hidden md:flex flex-col items-end mr-4">
                 <span className="text-xs text-slate-400 uppercase tracking-widest">Net Production</span>
                 <span className="text-green-400 font-mono font-bold text-lg">{cps.toFixed(1)} SD/s</span>
             </div>
             <button 
                onClick={handleReset}
                className="p-2 hover:bg-red-900/30 rounded-lg text-slate-500 hover:text-red-400 transition-colors"
                title="Hard Reset"
             >
                <RefreshCw size={20} />
             </button>
        </div>
      </header>

      <NewsTicker gameState={gameState} />

      {/* Main Content Grid */}
      <main className="flex-1 overflow-hidden relative flex flex-col md:flex-row">
        
        {/* Left: Interactive Area */}
        <section className="flex-1 p-6 md:p-12 flex flex-col items-center justify-center relative overflow-hidden bg-radial-gradient">
            
            {/* Background Decor */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                 <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl filter mix-blend-screen animate-pulse"></div>
                 <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-600/20 rounded-full blur-3xl filter mix-blend-screen"></div>
            </div>

            {/* Resources Display */}
            <div className="z-10 text-center mb-12">
                <h2 className="text-5xl md:text-7xl font-bold font-mono text-white tracking-tighter drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                    {Math.floor(gameState.stardust).toLocaleString()}
                </h2>
                <p className="text-cyan-400 font-sci-fi tracking-[0.2em] text-sm md:text-base mt-2 uppercase opacity-80">
                    Stardust Units
                </p>
            </div>

            {/* The Big Button */}
            <button
                onMouseDown={handleMainClick}
                onTouchStart={handleMainClick}
                className="
                    relative z-10 group
                    w-48 h-48 md:w-64 md:h-64 rounded-full
                    bg-slate-900
                    border-4 border-slate-700
                    shadow-[0_0_50px_rgba(6,182,212,0.1)]
                    hover:shadow-[0_0_80px_rgba(6,182,212,0.4)]
                    hover:border-cyan-400/50
                    active:scale-95 transition-all duration-100 ease-out
                    flex items-center justify-center
                "
            >
                <div className="absolute inset-2 rounded-full border border-slate-800 opacity-50"></div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                {/* Inner Core */}
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center pulse-glow relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
                    <Star className="w-16 h-16 text-cyan-500 fill-cyan-900/50" />
                </div>
            </button>
            
            <p className="mt-8 text-slate-500 text-sm animate-bounce">Click the Core to harvest</p>

            {/* Click Effects Overlay */}
            {clickEffects.map(effect => (
                <div
                    key={effect.id}
                    className="fixed pointer-events-none text-cyan-300 font-bold font-mono text-xl z-50 click-animation select-none"
                    style={{ left: effect.x, top: effect.y }}
                >
                    +{effect.value}
                </div>
            ))}
        </section>

        {/* Right: Store Panel */}
        <section className="flex-1 md:max-w-md lg:max-w-lg bg-slate-950/80 border-t md:border-t-0 md:border-l border-slate-800 flex flex-col h-[50vh] md:h-auto z-20 backdrop-blur-sm">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                <h3 className="font-sci-fi font-bold text-lg text-slate-200 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    Construction
                </h3>
                <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                    Store
                </span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {BUILDINGS.map(building => (
                    <BuildingItem
                        key={building.id}
                        building={building}
                        count={gameState.inventory[building.id] || 0}
                        currentStardust={gameState.stardust}
                        onBuy={buyBuilding}
                    />
                ))}
                
                <div className="h-20"></div> {/* Spacer */}
            </div>
        </section>

      </main>

      {/* Footer Status */}
      <footer className="bg-slate-950 border-t border-slate-900 p-2 text-center text-xs text-slate-600 font-mono">
        User ID: {Math.floor(gameState.startTime / 1000).toString(16).toUpperCase()} • Last Sync: {new Date(gameState.lastSaveTime).toLocaleTimeString()}
      </footer>

      {/* Global CSS for radial gradient helper */}
      <style>{`
        .bg-radial-gradient {
            background-image: radial-gradient(circle at center, #1e293b 0%, #0f172a 70%);
        }
        @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
            animation: spin-slow 10s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default App;