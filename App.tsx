import React, { useState, useCallback } from 'react';
import { SearchBar } from './components/SearchBar.tsx';
import { MediaCard } from './components/MediaCard.tsx';
import { Footer } from './components/Footer.tsx';
import { searchMedia } from './services/gemini.ts';
import { MediaItem, SearchState } from './types.ts';
import { AlertCircle } from './components/icons.tsx';

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
    <div className="min-h-screen bg-background text-zinc-100 selection:bg-zinc-700/30 font-sans">
      {/* Subtle Background Spotlight - Neutral */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80%] h-[50%] rounded-full bg-zinc-800/10 blur-[120px]"></div>
      </div>

      <main className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col">
        <SearchBar onSearch={handleSearch} isLoading={state.isLoading} />

        {/* Error State */}
        {state.error && (
          <div className="text-center p-4 bg-red-950/30 border border-red-900/50 rounded-lg max-w-2xl mx-auto mb-8 text-red-200 flex items-center justify-center gap-2 animate-fade-in">
            <AlertCircle className="w-5 h-5" />
            <span>{state.error}</span>
          </div>
        )}

        {/* Results Grid */}
        {state.data && (
          <div className="flex-1 animate-slide-up">
            <h2 className="text-2xl font-bold mb-6 text-zinc-200 border-l-4 border-accent pl-4">
              Results for <span className="text-white">"{state.query}"</span>
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {state.data.map((item) => (
                <MediaCard key={item.id} item={item} />
              ))}
            </div>

            {/* Sources Section */}
            {state.sources.length > 0 && (
              <div className="mt-16 pt-8 border-t border-zinc-800/50">
                <p className="text-zinc-500 text-sm mb-3 font-medium uppercase tracking-wider">Verified Sources:</p>
                <div className="flex flex-wrap gap-2">
                  {state.sources.map((source, idx) => (
                    <span 
                      key={idx} 
                      className="px-3 py-1 bg-zinc-900/80 border border-zinc-800 rounded-full text-xs text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors"
                    >
                      {source}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        <Footer />
      </main>
    </div>
  );
};

export default App;