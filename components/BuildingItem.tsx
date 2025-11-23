import React from 'react';
import { Building } from '../types';
import { COST_SCALING_FACTOR } from '../constants';

interface BuildingItemProps {
  building: Building;
  count: number;
  currentStardust: number;
  onBuy: (id: string) => void;
}

export const BuildingItem: React.FC<BuildingItemProps> = ({
  building,
  count,
  currentStardust,
  onBuy,
}) => {
  // Calculate cost: Base * (Factor ^ Count)
  const cost = Math.floor(building.baseCost * Math.pow(COST_SCALING_FACTOR, count));
  const canAfford = currentStardust >= cost;

  return (
    <div 
      className={`
        relative p-4 rounded-xl border-2 transition-all duration-200
        flex items-center justify-between group select-none
        ${canAfford 
          ? 'bg-slate-800/80 border-slate-600 hover:border-cyan-400 hover:bg-slate-700/80 cursor-pointer active:scale-95' 
          : 'bg-slate-900/50 border-slate-800 opacity-60 cursor-not-allowed'}
      `}
      onClick={() => canAfford && onBuy(building.id)}
    >
      <div className="flex items-center gap-4">
        <div className="text-4xl filter drop-shadow-lg">{building.icon}</div>
        <div>
          <h4 className="font-sci-fi font-bold text-slate-100">{building.name}</h4>
          <p className="text-xs text-slate-400">{building.description}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-cyan-400 text-xs font-mono font-bold">
              +{building.baseCPS.toLocaleString()} CPS
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col items-end gap-1">
        <span className="text-2xl font-bold font-sci-fi text-slate-500 group-hover:text-slate-300">
          {count}
        </span>
        <div className={`
          text-sm font-mono font-bold px-2 py-0.5 rounded
          ${canAfford ? 'text-green-400 bg-green-900/20' : 'text-red-400 bg-red-900/20'}
        `}>
          {cost.toLocaleString()} SD
        </div>
      </div>
    </div>
  );
};