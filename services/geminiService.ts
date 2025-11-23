import { GoogleGenAI } from "@google/genai";
import { GameState, Building } from "../types";
import { BUILDINGS } from "../constants";

// Initialize Gemini
// NOTE: process.env.API_KEY is guaranteed to be available in this environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelName = 'gemini-2.5-flash';

export const generateNewsHeadline = async (
  state: GameState, 
  recentEvent?: string
): Promise<string> => {
  try {
    const totalCollected = Math.floor(state.totalStardustCollected);
    const buildingsOwned = Object.entries(state.inventory)
      .filter(([_, count]) => count > 0)
      .map(([id, count]) => {
        const b = BUILDINGS.find(b => b.id === id);
        return b ? `${count} ${b.name}(s)` : '';
      })
      .filter(Boolean)
      .join(', ');

    const prompt = `
      You are a news ticker for a sci-fi incremental game called "Cosmic Idle".
      
      Current Game State:
      - Total Stardust Collected: ${totalCollected}
      - Buildings Owned: ${buildingsOwned || "None yet"}
      - Recent Event context: ${recentEvent || "General cosmic update"}

      Write a SINGLE, short, witty, or sci-fi flavored news headline (max 15 words) reflecting this state. 
      It can be funny, ominous, or technical.
      Do not use quotes.
      Examples:
      - "Scientists baffled as local sector stardust levels plummet."
      - "Market crash imminent? Stardust inflation reaches all-time high."
      - "Galactic Federation praises efficiency of new Dyson Spheres."
    `;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        maxOutputTokens: 30,
        temperature: 0.9,
      }
    });

    return response.text.trim();

  } catch (error) {
    console.error("Gemini News Error:", error);
    return "Communication relay offline... Signal lost.";
  }
};

export const generateAchievementName = async (milestone: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: `Generate a cool, sci-fi achievement name (max 4 words) for collecting ${milestone} stardust.`,
             config: {
                maxOutputTokens: 10,
                temperature: 1.0,
            }
        });
        return response.text.trim();
    } catch (e) {
        return "Cosmic Milestone";
    }
}
