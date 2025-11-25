export interface MediaItem {
  id: string;
  rank: number;
  title: string;
  year?: string;
  rating: string;
  posterUrl?: string; // Optional, grounded URL if available
  description: string;
  type: 'movie' | 'series' | 'episode' | 'anime';
  source?: string; // e.g., "IMDb", "TMDB"
}

export interface SearchState {
  query: string;
  isLoading: boolean;
  data: MediaItem[] | null;
  error: string | null;
  sources: string[];
}

export enum ViewMode {
  GRID = 'GRID',
  LIST = 'LIST'
}