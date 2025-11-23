export interface Building {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  baseCPS: number; // Currency Per Second
  icon: string;
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  trigger: (state: GameState) => boolean; // Condition to appear
  effect: (state: GameState) => GameState; // Effect when bought
  purchased: boolean;
}

export interface GameState {
  stardust: number;
  totalStardustCollected: number;
  clickCount: number;
  startTime: number;
  inventory: Record<string, number>; // Building ID -> Count
  upgrades: string[]; // IDs of purchased upgrades
  lastSaveTime: number;
}

export interface ClickEffect {
  id: number;
  x: number;
  y: number;
  value: number;
}

export type NewsPriority = 'low' | 'high';

export interface NewsItem {
  id: string;
  text: string;
  timestamp: number;
  priority: NewsPriority;
}