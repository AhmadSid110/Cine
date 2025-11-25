import React from 'react';
import { MediaItem } from '../types.ts';
import { StarIcon, FilmIcon, TvIcon } from './icons.tsx';

interface MediaCardProps {
  item: MediaItem;
}

export const MediaCard: React.FC<MediaCardProps> = ({ item }) => {
  // Neutral/Dark aesthetic gradients
  const gradients = [
    "from-zinc-900 to-zinc-800",
    "from-stone-900 to-stone-800",
    "from-neutral-900 to-zinc-900",
    "from-slate-900 to-zinc-900", // kept one deep slate for variety, but very dark
  ];
  const gradientIndex = item.title.length % gradients.length;
  const bgGradient = gradients[gradientIndex];

  // Seed for placeholder image
  const seed = item.title.replace(/\s+/g, '-').toLowerCase();
  const imageUrl = `https://picsum.photos/seed/${seed}/400/600`;

  return (
    <div className="group relative bg-surface border border-zinc-800/60 rounded-xl overflow-hidden hover:border-zinc-600 transition-all duration-300 hover:shadow-2xl hover:shadow-black/50 flex flex-col h-full animate-slide-up">
      {/* Image / Gradient Header */}
      <div className="relative aspect-[2/3] overflow-hidden bg-zinc-900">
        <img 
          src={imageUrl} 
          alt={item.title} 
          className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700 group-hover:opacity-70 grayscale hover:grayscale-0"
          loading="lazy"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${bgGradient} opacity-80 mix-blend-multiply`}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"></div>
        
        {/* Rank Badge */}
        <div className="absolute top-0 left-0 p-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-black/40 backdrop-blur-md border border-white/10 text-xl font-bold text-white shadow-lg">
                #{item.rank}
            </div>
        </div>

        {/* Type Badge */}
        <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/5 text-[10px] font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-1">
          {item.type === 'movie' ? <FilmIcon className="w-3 h-3" /> : <TvIcon className="w-3 h-3" />}
          {item.type}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-2">
            <h3 className="text-lg font-bold text-white leading-snug group-hover:text-accent transition-colors">
            {item.title}
            </h3>
        </div>
        
        <div className="flex items-center gap-3 mb-4 text-sm text-zinc-500">
          {item.year && <span className="bg-zinc-800/50 px-2 py-0.5 rounded border border-zinc-800">{item.year}</span>}
          <div className="flex items-center text-accent/90 font-medium gap-1">
            <StarIcon className="w-3.5 h-3.5" fill="currentColor" />
            {item.rating}
          </div>
        </div>

        <p className="text-zinc-400 text-sm line-clamp-4 leading-relaxed mb-4 flex-grow font-light">
          {item.description}
        </p>

        <div className="pt-4 border-t border-zinc-800/50 mt-auto flex justify-between items-center text-[10px] uppercase tracking-wider text-zinc-600">
           <span>Source: {item.source}</span>
        </div>
      </div>
    </div>
  );
};