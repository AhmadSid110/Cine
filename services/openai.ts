import OpenAI from 'openai';
import { MediaItem, Source } from '../types.ts';

// Declare process locally to satisfy TypeScript compiler
declare const process: {
  env: {
    OPENAI_API_KEY?: string;
  }
};

const SYSTEM_INSTRUCTION = `
You are CineRank, an expert film and TV database assistant.
Your goal is to provide accurate, ranked lists of movies, TV shows, episodes, or anime based on the user's request.
You MUST search the web to find real-world ratings from reputable sources like IMDb, Rotten Tomatoes, TMDB, and MyAnimeList.

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

export const searchMedia = async (query: string, apiKey: string): Promise<{ items: MediaItem[], sources: Source[] }> => {
  try {
    // Use provided API key or fall back to environment variable
    const key = apiKey || process.env.OPENAI_API_KEY;
    
    if (!key) {
      throw new Error('OpenAI API key is not configured. Please add it in Settings.');
    }

    const openai = new OpenAI({
      apiKey: key,
      dangerouslyAllowBrowser: true // Required for browser usage
    });

    const prompt = `
    Find the following: "${query}".
    Provide a ranked list with accurate ratings from web sources.
    Return strictly a JSON array string.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_INSTRUCTION },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
    });

    const text = response.choices[0]?.message?.content || '';

    // Parse JSON manually
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

    // OpenAI doesn't provide grounding metadata like Gemini, so sources will be empty
    // or we could extract from the response text if needed
    const sources: Source[] = [];

    return { items, sources };

  } catch (error: any) {
    console.error("OpenAI Search Error:", error);
    if (error.message) {
      throw error;
    }
    throw new Error('Failed to search with OpenAI. Please check your API key and try again.');
  }
};
