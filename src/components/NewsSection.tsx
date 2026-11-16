import React, { useState } from 'react';
import {
  Clock,
  ChevronRight,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NEWS_DATA } from '../data/clubData';
import { getAccentStyles } from '../utils/theme';

export const NewsSection: React.FC = () => {
  const { setSelectedNewsId, themeAccent, clubInfo } = useApp();
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const accent = getAccentStyles(themeAccent);

  const tags = [
    { id: 'all', label: 'Toutes les actualités' },
    { id: 'Ligue 1', label: 'Ligue 1' },
    { id: 'Champions League', label: 'Champions League' },
    { id: 'Mercato', label: 'Mercato & Transferts' },
    { id: 'Club', label: 'Vie du Club' },
  ];

  const filteredNews = NEWS_DATA.filter(article => {
    if (selectedTag === 'all') return true;
    return article.tags.includes(selectedTag) || article.category.toLowerCase().includes(selectedTag.toLowerCase());
  });

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Dynamic Background Image */}
        {clubInfo?.backgroundUrls?.newsBanner && (
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <img
              src={clubInfo.backgroundUrls.newsBanner}
              alt=""
              className="w-full h-full object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-indigo-950/80" />
          </div>
        )}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold mb-3">
            <Flame className="w-3.5 h-3.5" />
            <span>Flux Direct & Communiqués</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Actualités en Temps Réel
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Suivez les déclarations, les sessions de détection, les résumés vidéo et toute l'actualité de l'Académie Future Pro de Touba-Mbacké 24h/24.
          </p>
        </div>
      </div>

      {/* Tags Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
        {tags.map(tag => (
          <button
            key={tag.id}
            onClick={() => setSelectedTag(tag.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              selectedTag === tag.id
                ? `${accent.bg}`
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tag.label}
          </button>
        ))}
      </div>

      {/* Featured News Hero Card */}
      {filteredNews.length > 0 && (
        <div
          onClick={() => setSelectedNewsId(filteredNews[0].id)}
          className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 cursor-pointer group shadow-lg"
        >
          <div className="aspect-[16/9] md:aspect-[21/9] w-full bg-slate-900 relative">
            <img
              src={filteredNews[0].imageUrl}
              alt={filteredNews[0].title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-black bg-amber-500 text-slate-950 uppercase">
                  {filteredNews[0].category}
                </span>
                <span className="text-xs text-slate-300 flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  {filteredNews[0].publishedAt}
                </span>
              </div>

              <h2 className="text-xl sm:text-3xl font-black text-white max-w-3xl group-hover:text-amber-400 transition">
                {filteredNews[0].title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 max-w-2xl">
                {filteredNews[0].summary}
              </p>

              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 pt-1">
                <span>Lire le communiqué complet</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Other News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNews.slice(1).map(article => (
          <div
            key={article.id}
            onClick={() => setSelectedNewsId(article.id)}
            className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between group"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-slate-950/80 backdrop-blur-md text-amber-400 border border-amber-500/30 uppercase">
                {article.category}
              </span>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  {article.publishedAt}
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1.5 group-hover:text-amber-500 transition line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                  {article.summary}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">{article.author}</span>
                <span className="text-amber-500 font-bold flex items-center gap-1">
                  Lire <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
