import React, { useState, FormEvent } from 'react';
import { SearchIcon, LoaderIcon } from './icons';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input.trim());
    }
  };

  const suggestions = [
    "Top 10 Rated Crime Movies",
    "Top 20 South Park Episodes",
    "Best Cyberpunk Anime",
    "Highest Rated HBO Shows",
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mb-12 px-4 pt-8">
      <div className="text-center mb-10 animate-fade-in">
        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-4">
          CineRank <span className="text-accent">AI</span>
        </h1>
        <p className="text-zinc-400 mt-4 text-lg max-w-2xl mx-auto">
          Intelligent rankings for movies, TV, and anime. Powered by Gemini & real-time web data.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative group z-10">
        <div className="absolute inset-0 bg-zinc-800/50 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition duration-500"></div>
        <div className="relative flex items-center bg-zinc-900/90 border border-zinc-800 rounded-full shadow-2xl overflow-hidden transition-all focus-within:border-zinc-600 focus-within:ring-1 focus-within:ring-zinc-600">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for a top list (e.g., Top 10 Sci-Fi Movies 2024)..."
            className="w-full bg-transparent text-white px-8 py-4 text-lg focus:outline-none placeholder-zinc-600"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-2 p-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full transition-colors disabled:bg-zinc-900 disabled:text-zinc-600 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <LoaderIcon className="animate-spin w-6 h-6" />
            ) : (
              <SearchIcon className="w-6 h-6" />
            )}
          </button>
        </div>
      </form>

      <div className="mt-8 flex flex-wrap justify-center gap-2 animate-fade-in opacity-0 fill-mode-forwards" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => {
              setInput(suggestion);
              onSearch(suggestion);
            }}
            className="px-4 py-2 rounded-full bg-zinc-900/50 border border-zinc-800 text-sm text-zinc-500 hover:text-zinc-200 hover:border-zinc-600 hover:bg-zinc-800 transition-all cursor-pointer"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};