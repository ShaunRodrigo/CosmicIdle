import { Building, GameState } from './types';

export const INITIAL_GAME_STATE: GameState = {
  stardust: 0,
  totalStardustCollected: 0,
  clickCount: 0,
  startTime: Date.now(),
  inventory: {
    'stardust-collector': 0,
    'asteroid-miner': 0,
    'nebula-condenser': 0,
    'fusion-reactor': 0,
    'quantum-drill': 0,
    'dyson-sphere': 0,
    'entropy-engine': 0,
    'reality-weaver': 0,
  },
  upgrades: [],
  lastSaveTime: Date.now(),
};

export const BUILDINGS: Building[] = [
  {
    id: 'stardust-collector',
    name: 'Stardust Collector',
    description: 'A basic net to catch drifting cosmic particles.',
    baseCost: 15,
    baseCPS: 0.5,
    icon: '🕸️',
  },
  {
    id: 'asteroid-miner',
    name: 'Asteroid Miner',
    description: 'Automated drones that harvest resources from space rocks.',
    baseCost: 100,
    baseCPS: 3,
    icon: '🪨',
  },
  {
    id: 'nebula-condenser',
    name: 'Nebula Condenser',
    description: 'Compresses gas clouds into pure energy.',
    baseCost: 1100,
    baseCPS: 16,
    icon: '☁️',
  },
  {
    id: 'fusion-reactor',
    name: 'Fusion Reactor',
    description: 'Harnesses the power of a miniature star.',
    baseCost: 12000,
    baseCPS: 64,
    icon: '⚛️',
  },
  {
    id: 'quantum-drill',
    name: 'Quantum Drill',
    description: 'Extracts stardust from the fabric of spacetime.',
    baseCost: 130000,
    baseCPS: 250,
    icon: '🌀',
  },
  {
    id: 'dyson-sphere',
    name: 'Dyson Sphere',
    description: 'Encompasses a star to capture all its output.',
    baseCost: 1400000,
    baseCPS: 1200,
    icon: '🌞',
  },
  {
    id: 'entropy-engine',
    name: 'Entropy Engine',
    description: 'Generates energy from the decay of the universe.',
    baseCost: 20000000,
    baseCPS: 6000,
    icon: '⌛',
  },
  {
    id: 'reality-weaver',
    name: 'Reality Weaver',
    description: 'Rewrites physics to simply create stardust.',
    baseCost: 330000000,
    baseCPS: 25000,
    icon: '🌌',
  },
];

export const COST_SCALING_FACTOR = 1.15;