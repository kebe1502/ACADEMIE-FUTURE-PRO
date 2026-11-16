import React, { useEffect } from 'react';
import { X, User, Clock, Share2, Flame } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NEWS_DATA } from '../data/clubData';

export const NewsDetailModal: React.FC = () => {
  const { selectedNewsId, setSelectedNewsId, triggerShare, t } = useApp();

  const activeArticle = selectedNewsId
    ? NEWS_DATA.find((n) => n.id === selectedNewsId) ?? null
    : null;

  useEffect(() => {
    if (!activeArticle) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedNewsId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeArticle, setSelectedNewsId]);

  if (!activeArticle) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in overflow-y-auto"
      onClick={() => setSelectedNewsId(null)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="news-modal-title"
    >
      <div
        className="w-full max-w-2xl rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Image Header */}
        <div className="relative aspect-[16/9] w-full bg-slate-900 flex-shrink-0">
          <img
            src={activeArticle.imageUrl}
            alt={activeArticle.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/30 pointer-events-none" />

          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-[11px] font-black uppercase shadow">
              {activeArticle.category}
            </span>
            {activeArticle.isBreaking && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-600 text-white text-[10px] font-black uppercase shadow">
                <Flame className="w-3 h-3" />
                À la une
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => setSelectedNewsId(null)}
            aria-label="Fermer l'article"
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/80 text-white hover:bg-slate-900 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 border-b border-slate-100 pb-3">
            <span className="flex items-center gap-1.5 font-medium text-slate-600">
              <User className="w-3.5 h-3.5 text-amber-500" />
              {activeArticle.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {activeArticle.publishedAt}
              {activeArticle.readTime ? ` • ${activeArticle.readTime}` : ''}
            </span>
          </div>

          <h2 id="news-modal-title" className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
            {activeArticle.title}
          </h2>

          <p className="text-sm font-semibold text-slate-700 leading-relaxed italic border-l-4 border-amber-500 pl-4 py-1 bg-amber-50/60 rounded-r-xl">
            {activeArticle.summary}
          </p>

          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {activeArticle.content}
          </div>

          {/* Tags */}
          {activeArticle.tags.length > 0 && (
            <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-1.5">
              {activeArticle.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer with Share & Close */}
        <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between flex-shrink-0">
          <button
            type="button"
            onClick={() =>
              triggerShare({
                title: activeArticle.title,
                text: activeArticle.summary,
                url: window.location.href,
              })
            }
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-amber-500" />
            <span>{t('share')}</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedNewsId(null)}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition cursor-pointer"
          >
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  );
};
