import React, { useState, useCallback } from 'react';
import { SearchBar } from './components/SearchBar';
import { MediaCard } from './components/MediaCard';
import { Footer } from './components/Footer';
import { searchMedia } from './services/gemini';
import { MediaItem, SearchState } from './types';
import { AlertCircle, FilmIcon } from './components/icons';

const App: React.FC = () => {
  const [state, setState] = useState<SearchState>({
    query: '',
    isLoading: false,
    data: null,
    error: null,
    sources: []
  });

  const handleSearch = useCallback(async (query: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null, query }));
    
    try {
      const { items, sources } = await searchMedia(query);
      setState({
        query,
        isLoading: false,
        data: items,
        error: null,
        sources
      });
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        data: null,
        error: err.message || "An unexpected error occurred."
      }));
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-slate-100 selection:bg-blue-500/30">
      {/* Gradient Background Mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/10 blur-[120px]"></div>
      </div>

      <main className="relative z-10 container mx-auto px-4 py-12 md:py-20 flex flex-col min-h-screen">
        <SearchBar onSearch={handleSearch} isLoading={state.isLoading} />

        {/* Loading State Skeleton */}
        {state.isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-slate-900/50 rounded-xl aspect-[2/3.5] border border-slate-800"></div>
                ))}
            </div>
        )}

        {/* Error State */}
        {state.error && !state.isLoading && (
          <div className="max-w-xl mx-auto mt-8 p-6 bg-red-950/30 border border-red-900/50 rounded-xl text-center text-red-200 animate-fade-in flex flex-col items-center gap-3">
             <AlertCircle className="w-10 h-10 text-red-500" />
             <p className="text-lg font-semibold">Oops! Something went wrong.</p>
             <p className="text-sm opacity-80">{state.error}</p>
             <p className="text-xs text-slate-500 mt-2">Check your connection or try a different search term.</p>
          </div>
        )}

        {/* Results Grid */}
        {state.data && !state.isLoading && (
          <div className="animate-slide-up">
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-slate-800 pb-4 gap-4">
               <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <FilmIcon className="text-blue-500" />
                    Results for "{state.query}"
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">
                    Found {state.data.length} items
                  </p>
               </div>
               
               {state.sources.length > 0 && (
                 <div className="text-right max-w-md">
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-1">Grounded in data from</p>
                    <div className="flex flex-wrap justify-end gap-2">
                        {state.sources.slice(0, 3).map(src => (
                            <span key={src} className="text-xs bg-slate-800/80 px-2 py-1 rounded text-blue-300 border border-slate-700">
                                {src}
                            </span>
                        ))}
                    </div>
                 </div>
               )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {state.data.map((item) => (
                <MediaCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}
        
        {/* Empty State / Initial Instructions */}
        {!state.data && !state.isLoading && !state.error && (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-600 space-y-4 min-h-[40vh]">
                <FilmIcon className="w-16 h-16 opacity-20" />
                <p className="text-lg">Try searching for "Top 10 Scifi Movies of the 90s"</p>
            </div>
        )}

        <Footer />
      </main>
    </div>
  );
};

export default App;