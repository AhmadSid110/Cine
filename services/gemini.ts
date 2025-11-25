import { GoogleGenAI } from "@google/genai";
import { MediaItem } from "../types";

// Initialize Gemini Client
// IMPORTANT: Expects process.env.API_KEY to be available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are CineRank, an expert film and TV database assistant.
Your goal is to provide accurate, ranked lists of movies, TV shows, episodes, or anime based on the user's request.
You MUST use the 'googleSearch' tool to find real-world ratings from reputable sources like IMDb, Rotten Tomatoes, TMDB, and MyAnimeList.

Output Format:
Return a PURE JSON string representing an array of objects. Do not wrap it in markdown code blocks.
Each object must have:
- rank: number
- title: string
- year: string (e.g., "2008" or "2008-2013")
- rating: string (e.g., "9.3/10", "98%")
- description: string (a short, engaging plot summary)
- type: "movie" | "series" | "episode" | "anime"
- source: string (where the rating came from, e.g., "IMDb")

Ensure the list strictly follows the user's quantity request (e.g., "Top 10").
If the user asks for episodes (e.g., "Top South Park episodes"), include the Season and Episode number in the title or description.
`;

export const searchMedia = async (query: string): Promise<{ items: MediaItem[], sources: string[] }> => {
  try {
    const modelId = "gemini-2.5-flash"; // Using 2.5 Flash for speed and grounding capability

    const prompt = `
    Find the following: "${query}".
    Provide a ranked list with accurate ratings.
    Return strictly a JSON array string.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
        // responseSchema is NOT allowed with googleSearch, so we rely on system instruction for JSON format
      },
    });

    // Extract Text
    const text = response.text || "";

    // Extract Grounding Metadata (Sources)
    const sources: string[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      chunks.forEach((chunk) => {
        if (chunk.web?.uri) {
          sources.push(chunk.web.title || new URL(chunk.web.uri).hostname);
        }
      });
    }

    // Parse JSON manually since we couldn't use responseSchema
    let items: MediaItem[] = [];
    try {
      // Find JSON array brackets
      const start = text.indexOf('[');
      const end = text.lastIndexOf(']');
      
      if (start !== -1 && end !== -1) {
        const jsonStr = text.substring(start, end + 1);
        const parsed = JSON.parse(jsonStr);
        
        // Map and validate
        items = parsed.map((item: any, index: number) => ({
          id: `item-${index}-${Date.now()}`,
          rank: item.rank || index + 1,
          title: item.title || "Unknown Title",
          year: item.year || "",
          rating: item.rating || "N/A",
          description: item.description || "No description available.",
          type: item.type || "movie",
          source: item.source || "Web"
        }));
      } else {
        console.warn("Could not find JSON brackets in response:", text);
        throw new Error("Failed to parse results format.");
      }
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      throw new Error("We found the info, but couldn't format it correctly. Please try again.");
    }

    return { items, sources: [...new Set(sources)] }; // Unique sources

  } catch (error) {
    console.error("Gemini Search Error:", error);
    throw error;
  }
};