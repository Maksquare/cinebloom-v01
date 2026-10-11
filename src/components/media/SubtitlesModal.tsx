'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Languages, ExternalLink, Download, CheckCircle, Sparkles } from 'lucide-react';
import { getOpenSubtitlesSearchUrl } from '@/lib/embeds';

interface SubtitlesModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  year?: string;
  season?: number;
  episode?: number;
}

const SUPPORTED_LANGUAGES = [
  { code: 'all', name: 'All Languages', flag: '🌐' },
  { code: 'eng', name: 'English', flag: '🇬🇧' },
  { code: 'spa', name: 'Spanish (Español)', flag: '🇪🇸' },
  { code: 'amh', name: 'Amharic (አማርኛ)', flag: '🇪🇹' },
  { code: 'fre', name: 'French (Français)', flag: '🇫🇷' },
  { code: 'ara', name: 'Arabic (العربية)', flag: '🇸🇦' },
  { code: 'ger', name: 'German (Deutsch)', flag: '🇩🇪' },
  { code: 'ita', name: 'Italian (Italiano)', flag: '🇮🇹' },
  { code: 'por', name: 'Portuguese (Português)', flag: '🇧🇷' },
  { code: 'rus', name: 'Russian (Русский)', flag: '🇷🇺' },
  { code: 'hin', name: 'Hindi (हिन्दी)', flag: '🇮🇳' },
  { code: 'chi', name: 'Chinese (中文)', flag: '🇨🇳' },
];

export const SubtitlesModal: React.FC<SubtitlesModalProps> = ({
  isOpen,
  onClose,
  title,
  year,
  season,
  episode,
}) => {
  if (!isOpen) return null;

  const handleOpenSearch = (langCode: string) => {
    const url = getOpenSubtitlesSearchUrl(title, year, season, episode, langCode);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-white/15 bg-[#101014] p-6 shadow-2xl z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-400">
                <Languages className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  Subtitles in Your Language
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    OpenSubtitles API
                  </span>
                </h3>
                <p className="text-xs text-white/50 truncate max-w-sm">
                  {title} {season && episode ? `(S${season} E${episode})` : year ? `(${year})` : ''}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Player Built-in Subtitles Notice */}
          <div className="my-4 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-3.5 flex items-start gap-3">
            <Sparkles className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
            <div className="text-xs text-indigo-200">
              <span className="font-semibold text-white">Built-in Multi-Language CC:</span> Our
              primary stream servers (VidSrc VIP &amp; VidLink Ultra) include auto-synchronized
              English, Spanish, and multi-lingual subtitles in the player CC menu.
            </div>
          </div>

          {/* Language Options Grid */}
          <div className="mt-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">
              Download Subtitles (.SRT / .VTT)
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-64 overflow-y-auto pr-1">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleOpenSearch(lang.code)}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-medium text-white hover:border-amber-400/40 hover:bg-amber-400/10 transition-all text-left cursor-pointer group"
                >
                  <span className="flex items-center gap-2 truncate">
                    <span className="text-base">{lang.flag}</span>
                    <span className="truncate group-hover:text-amber-300 transition-colors">
                      {lang.name}
                    </span>
                  </span>
                  <ExternalLink className="h-3 w-3 text-white/30 group-hover:text-amber-400 shrink-0 ml-1 transition-colors" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick instructions */}
          <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/40">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
              Direct OpenSubtitles Database
            </span>
            <button
              type="button"
              onClick={() => handleOpenSearch('all')}
              className="font-semibold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
            >
              Search All Subtitles &rarr;
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
