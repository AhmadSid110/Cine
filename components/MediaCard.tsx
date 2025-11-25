import React from 'react';
import { MediaItem } from '../types';
import { StarIcon, FilmIcon, TvIcon } from './icons';

interface MediaCardProps {
  item: MediaItem;
}

export const MediaCard: React.FC<MediaCardProps> = ({ item }) => {
  // Generate a deterministic aesthetic gradient based on the title length for variety
  const gradients = [
    "from-purple-900 to-indigo-900",
    "from-slate-900 to-slate-800",
    "from-blue-900 to-slate-900",
    "from-rose-900 to-pink-900",
    "from-emerald-900 to-teal-900"
  ];
  const gradientIndex = item.title.length % gradients.length;
  const bgGradient = gradients[gradientIndex];

  // Placeholder image since we can't reliably get real posters without TMDB Key
  // We use picsum with a seed based on the title to keep it consistent
  const seed = item.title.replace(/\s+/g, '-').toLowerCase();
  const imageUrl = `https://picsum.photos/seed/${seed}/400/600`;

  return (
    <div className="group relative bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-600 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/10 flex flex-col h-full animate-slide-up">
      {/* Image / Gradient Header */}
      <div className="relative aspect-[2/3] overflow-hidden bg-slate-800">
        <img 
          src={imageUrl} 
          alt={item.title} 
          className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700 group-hover:opacity-80"
          loading="lazy"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${bgGradient} opacity-60 mix-blend-multiply`}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        
        {/* Rank Badge */}
        <div className="absolute top-3 left-3 w-10 h-10 flex items-center justify-center rounded-full bg-slate-950/80 backdrop-blur-sm border border-slate-700 text-xl font-bold text-white shadow-lg z-10">
          #{item.rank}
        </div>

        {/* Type Badge */}
        <div className="absolute top-3 right-3 px-2 py-1 rounded bg-slate-950/60 backdrop-blur-sm border border-slate-700 text-xs font-medium text-slate-300 uppercase tracking-wider flex items-center gap-1 z-10">
          {item.type === 'movie' ? <FilmIcon className="w-3 h-3" /> : <TvIcon className="w-3 h-3" />}
          {item.type}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-white leading-tight group-hover:text-blue-400 transition-colors">
            {item.title}
            </h3>
        </div>
        
        <div className="flex items-center gap-3 mb-4 text-sm text-slate-400">
          {item.year && <span className="bg-slate-800 px-2 py-0.5 rounded">{item.year}</span>}
          <div className="flex items-center text-amber-400 font-semibold gap-1">
            <StarIcon className="w-4 h-4" fill="currentColor" />
            {item.rating}
          </div>
        </div>

        <p className="text-slate-400 text-sm line-clamp-4 leading-relaxed mb-4 flex-grow">
          {item.description}
        </p>

        <div className="pt-4 border-t border-slate-800 mt-auto flex justify-between items-center text-xs text-slate-500">
           <span>Source: {item.source}</span>
        </div>
      </div>
    </div>
  );
};