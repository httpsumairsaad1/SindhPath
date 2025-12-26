
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getTravelInsight = async (startCity: string, endCity: string, distance: number) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a travel expert for Sindh, Pakistan. Provide a short, engaging 2-sentence insight for a traveler going from ${startCity} to ${endCity} (approx. ${distance} km). Mention one interesting fact about the destination or a cultural tip for the route.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "Safe travels across the beautiful landscape of Sindh!";
  }
};

export const getDijkstraExplanation = async (start: string, end: string, path: string[]) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Explain briefly (max 3 sentences) how Dijkstra's algorithm found the shortest path from ${start} to ${end} through ${path.join(' -> ')}. Focus on the greedy nature of the algorithm.`,
    });
    return response.text;
  } catch (error) {
    return "Dijkstra's algorithm selects the node with the smallest tentative distance at each step, ensuring the shortest path is found once the destination is reached.";
  }
};
