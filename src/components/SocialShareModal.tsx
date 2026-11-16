import React, { useState } from 'react';
import { X, Copy, Check, Share2, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SocialShareModal: React.FC = () => {
  const { isShareModalOpen, setIsShareModalOpen, shareData, showToast, t } = useApp();
  const [copied, setCopied] = useState(false);

  if (!isShareModalOpen) return null;

  const encodedUrl = encodeURIComponent(shareData.url);
  const encodedText = encodeURIComponent(`${shareData.title} - ${shareData.text}`);

  const shareLinks = [
    {
      name: 'X (Twitter)',
      icon: '𝕏',
      color: 'bg-black text-white hover:bg-neutral-800',
      url: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    },
    {
      name: 'WhatsApp',
      icon: '💬',
      color: 'bg-emerald-600 text-white hover:bg-emerald-700',
      url: `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`,
    },
    {
      name: 'Facebook',
      icon: 'f',
      color: 'bg-blue-600 text-white hover:bg-blue-700',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: 'LinkedIn',
      icon: 'in',
      color: 'bg-sky-700 text-white hover:bg-sky-800',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      name: 'Telegram',
      icon: '✈️',
      color: 'bg-sky-500 text-white hover:bg-sky-600',
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
    },
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareData.url);
    setCopied(true);
    showToast('Partage Social', t('link_copied'), 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareData.title,
          text: shareData.text,
          url: shareData.url,
        });
        setIsShareModalOpen(false);
      } catch (err) {
        // User dismissed
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t('share')}
            </h3>
          </div>
          <button
            onClick={() => setIsShareModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Share Preview Card */}
        <div className="mt-4 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
          <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
            {shareData.title}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
            {shareData.text}
          </p>
          <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-2 truncate font-mono">
            {shareData.url}
          </p>
        </div>

        {/* Major Social Networks */}
        <div className="mt-4 grid grid-cols-5 gap-2">
          {shareLinks.map(platform => (
            <a
              key={platform.name}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex flex-col items-center justify-center p-3 rounded-xl transition ${platform.color}`}
              title={`Partager sur ${platform.name}`}
            >
              <span className="text-lg font-bold">{platform.icon}</span>
              <span className="text-[10px] mt-1 font-medium truncate max-w-[50px]">{platform.name.split(' ')[0]}</span>
            </a>
          ))}
        </div>

        {/* Direct Copy Link & Native Share */}
        <div className="mt-4 space-y-2">
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? t('link_copied') : t('copy_link')}</span>
          </button>

          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={handleNativeShare}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-xs font-bold text-slate-950 transition"
            >
              <Send className="w-4 h-4" />
              <span>Partager avec d'autres applications</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
