'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ShieldCheck, Zap, HardDrive, ExternalLink, Check, Copy } from 'lucide-react';
import { MediaItem } from '@/types/media';
import { getDownloadSources, DownloadSource } from '@/lib/embeds';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  media: MediaItem;
  season?: number;
  episode?: number;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  isOpen,
  onClose,
  media,
  season = 1,
  episode = 1,
}) => {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const sources = getDownloadSources(media, season, episode);

  const handleCopy = (url: string) => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2500);
    }
  };

  const handleDownload = (source: DownloadSource) => {
    window.open(source.url, '_blank', 'noopener,noreferrer');
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
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
                <Download className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  Download Media
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    High Speed CDN
                  </span>
                </h3>
                <p className="text-xs text-white/50 truncate max-w-sm">
                  {media.title}{' '}
                  {media.mediaType === 'tv'
                    ? `(Season ${season}, Episode ${episode})`
                    : `(${media.releaseDate?.split('-')[0] || '2026'})`}
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

          {/* Quick Notice */}
          <div className="my-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3.5 flex items-start gap-3">
            <Zap className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-200">
              <span className="font-semibold text-white">Direct Stream &amp; P2P Downloads:</span>{' '}
              Select a link below to stream or download using browser download managers, IDM, 1DM, or
              torrent seedboxes.
            </div>
          </div>

          {/* Download Sources List */}
          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {sources.map((src, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3.5 hover:border-amber-400/40 hover:bg-white/10 transition-all group"
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                      {src.quality}
                    </span>
                    {src.badge && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-400/15 text-amber-300 border border-amber-400/25">
                        {src.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/60 truncate mt-0.5">{src.name}</p>
                  <p className="text-[11px] text-white/40">{src.format}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopy(src.url)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 hover:bg-white/15 hover:text-white transition-colors cursor-pointer"
                    title="Copy stream link"
                  >
                    {copiedUrl === src.url ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownload(src)}
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 px-3.5 py-1.5 text-xs font-bold text-black hover:brightness-110 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/40">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              Verified Fast Mirrors &amp; Safe CDN
            </span>
            <span className="text-white/50">CinemaHD Direct API</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
