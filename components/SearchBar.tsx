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
    <div className="w-full max-w-4xl mx-auto mb-12 px-4">
      <div className="text-center mb-8 animate-fade-in">
        <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-amber-400 pb-2">
          CineRank AI
        </h1>
        <p className="text-slate-400 mt-4 text-lg">
          Discover highly-rated entertainment powered by Gemini & Real-time Web Data.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative group z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
        <div className="relative flex items-center bg-slate-900 border border-slate-700 rounded-full shadow-2xl overflow-hidden transition-all focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for a top list (e.g., Top 10 Horror Movies 2023)..."
            className="w-full bg-transparent text-white px-8 py-4 text-lg focus:outline-none placeholder-slate-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-2 p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-colors disabled:bg-slate-700 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <LoaderIcon className="animate-spin w-6 h-6" />
            ) : (
              <SearchIcon className="w-6 h-6" />
            )}
          </button>
        </div>
      </form>

      <div className="mt-6 flex flex-wrap justify-center gap-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => {
              setInput(suggestion);
              onSearch(suggestion);
            }}
            className="px-4 py-1.5 rounded-full bg-slate-800/50 border border-slate-700 text-sm text-slate-400 hover:text-white hover:border-slate-500 hover:bg-slate-800 transition-all cursor-pointer"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};