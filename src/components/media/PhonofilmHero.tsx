'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Home,
  Search,
  User,
  Volume2,
  VolumeX,
  Star,
  Play,
  Download,
  Film,
  Languages,
  Bookmark,
  Eye,
  Plus,
  Heart,
  Share2,
  ChevronRight,
  Sparkles,
  Check,
  ExternalLink,
  Zap,
  Server,
  AlertCircle,
} from 'lucide-react';
import { MediaItem } from '@/types/media';
import { STREAM_SERVERS } from '@/lib/embeds';
import { toggleWatchlist, isInWatchlist, toggleWatched, isWatched } from '@/lib/storage';

interface PhonofilmHeroProps {
  media: MediaItem;
  season?: number;
  episode?: number;
  onWatchNow: () => void;
  onOpenTrailer: () => void;
  onOpenSubtitles: () => void;
  onOpenDownload: () => void;
  onOpenAddToList: () => void;
  isPlaying?: boolean;
  isHeroPlayerOpen?: boolean;
  onCloseHeroPlayer?: () => void;
  activeServerId?: string;
  onSelectServer?: (id: string) => void;
  embedUrl?: string;
}

export const PhonofilmHero: React.FC<PhonofilmHeroProps> = ({
  media,
  season = 1,
  episode = 1,
  onWatchNow,
  onOpenTrailer,
  onOpenSubtitles,
  onOpenDownload,
  onOpenAddToList,
  isPlaying = false,
  isHeroPlayerOpen = false,
  onCloseHeroPlayer,
  activeServerId = STREAM_SERVERS[0].id,
  onSelectServer,
  embedUrl,
}) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMuted, setIsMuted] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [hasWatched, setHasWatched] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(128);
  const [shareCopied, setShareCopied] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(media.trailerYoutubeKey || null);
  const [isTrailerReady, setIsTrailerReady] = useState(false);

  useEffect(() => {
    setIsBookmarked(isInWatchlist(media.id));
    setHasWatched(isWatched(media.id));
    try {
      const likedState = localStorage.getItem(`cinemahd-liked-${media.id}`) === 'true';
      setIsLiked(likedState);
      const seedLikes = Math.floor(media.voteCount ? media.voteCount / 2 : 142);
      setLikeCount(seedLikes + (likedState ? 1 : 0));
    } catch {
      // ignore
    }
  }, [media.id, media.voteCount]);

  // Ensure trailer key is fetched if not present in initial media object
  useEffect(() => {
    if (media.trailerYoutubeKey) {
      setTrailerKey(media.trailerYoutubeKey);
    } else {
      fetch(`/api/tmdb/details?id=${media.id}&type=${media.mediaType}`)
        .then((res) => res.json())
        .then((data) => {
          const trailer = data?.videos?.results?.find(
            (v: any) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
          );
          if (trailer?.key) {
            setTrailerKey(trailer.key);
          }
        })
        .catch(() => {});
    }
  }, [media.id, media.mediaType, media.trailerYoutubeKey]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleToggleWatchlist = () => {
    const nextState = toggleWatchlist(media);
    setIsBookmarked(nextState);
  };

  const handleToggleWatched = () => {
    const nextState = toggleWatched(media.id);
    setHasWatched(nextState);
  };

  const handleToggleLike = () => {
    const next = !isLiked;
    setIsLiked(next);
    setLikeCount((prev) => (next ? prev + 1 : Math.max(0, prev - 1)));
    try {
      localStorage.setItem(`cinemahd-liked-${media.id}`, String(next));
    } catch {
      // ignore
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    }
  };

  const releaseYear = media.releaseDate ? media.releaseDate.split('-')[0] : '2026';
  const isTv = media.mediaType === 'tv';
  const formattedRating = Number(media.voteAverage || 8.0).toFixed(1);
  const isFutureOrUnreleased = Number(releaseYear) >= 2026;

  const getParentalRating = () => {
    const genresLower = (media.genres || []).map((g) => g.toLowerCase());
    if (
      genresLower.includes('horror') ||
      genresLower.includes('crime') ||
      genresLower.includes('thriller') ||
      genresLower.includes('mystery')
    ) {
      return isTv ? 'TV-MA' : 'R';
    }
    if (
      genresLower.includes('action') ||
      genresLower.includes('science fiction') ||
      genresLower.includes('adventure')
    ) {
      return isTv ? 'TV-14' : 'PG-13';
    }
    if (genresLower.includes('animation') || genresLower.includes('family')) {
      return isTv ? 'TV-PG' : 'PG';
    }
    return isTv ? 'TV-MA' : 'PG-13';
  };

  const backdropImage =
    media.backdropPath ||
    media.posterPath ||
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80';

  const quickServers = STREAM_SERVERS.slice(0, 5);
  const activeServerObj = STREAM_SERVERS.find((s) => s.id === activeServerId) || STREAM_SERVERS[0];

  return (
    <div className="w-full space-y-4">
      {/* Top Floating Controls Bar */}
      <div className="flex items-center justify-between gap-3 px-1 sm:px-2">
        {/* Left: Back & Home buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-[#16161e]/90 hover:bg-[#252530] text-white/90 hover:text-white border border-white/15 backdrop-blur-md transition-all shadow-lg cursor-pointer"
            title="Go Back"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          <Link
            href="/"
            className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-[#16161e]/90 hover:bg-[#252530] text-white/90 hover:text-white border border-white/15 backdrop-blur-md transition-all shadow-lg cursor-pointer"
            title="Go to Homepage"
          >
            <Home className="h-4 w-4 sm:h-5 sm:w-5" />
          </Link>
        </div>

        {/* Center: Search Movies Pill Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative flex-1 max-w-md mx-2 sm:mx-4"
        >
          <div className="relative flex items-center">
            <Search className="absolute left-4 h-4 w-4 text-white/50 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Movies &amp; Series"
              className="w-full rounded-full border border-white/15 bg-[#16161e]/90 py-2 sm:py-2.5 pl-11 pr-4 text-xs sm:text-sm text-white placeholder-white/50 backdrop-blur-md focus:border-amber-400/60 focus:bg-[#1e1e28] focus:outline-none transition-all shadow-inner"
            />
          </div>
        </form>

        {/* Right: User Profile & Mute Toggles */}
        <div className="flex items-center gap-2">
          <Link
            href="/profile"
            className="flex items-center gap-1.5 rounded-full bg-[#16161e]/90 hover:bg-[#252530] px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white/90 hover:text-white border border-white/15 backdrop-blur-md transition-all shadow-lg cursor-pointer"
          >
            <User className="h-4 w-4 text-amber-400" />
            <span className="hidden sm:inline">Me</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsMuted((prev) => !prev)}
            className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-[#16161e]/90 hover:bg-[#252530] text-white/90 hover:text-white border border-white/15 backdrop-blur-md transition-all shadow-lg cursor-pointer group"
            title={isMuted ? 'Unmute Trailer Audio' : 'Mute Trailer Audio'}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400" />
            ) : (
              <Volume2 className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400" />
            )}
          </button>
        </div>
      </div>

      {/* Main Phonofilm-style Movie Card */}
      <div className="relative w-full overflow-hidden rounded-3xl border border-white/15 bg-[#07070a] shadow-[0_25px_80px_rgba(0,0,0,0.95)] min-h-[520px] sm:min-h-[580px] lg:min-h-[640px] flex flex-col justify-end p-5 sm:p-8 lg:p-12">
        {isHeroPlayerOpen && embedUrl ? (
          /* ========================================== */
          /* ACTIVE CINEMA PLAYER MODE (WHEN WATCH NOW IS CLICKED) */
          /* ========================================== */
          <div className="relative z-10 w-full flex flex-col gap-3">
            {/* Player Header Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onCloseHeroPlayer}
                  className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 px-3.5 py-1.5 text-xs font-bold text-white transition-all cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5 text-amber-400" />
                  <span>Movie Info &amp; Trailer</span>
                </button>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Live: {activeServerObj.name}</span>
                </div>
              </div>

              {/* Quick Server Switcher Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-white/40 mr-1 hidden sm:inline">
                  Servers:
                </span>
                {quickServers.map((srv) => (
                  <button
                    key={srv.id}
                    type="button"
                    onClick={() => onSelectServer?.(srv.id)}
                    className={`rounded-xl px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                      activeServerId === srv.id
                        ? 'bg-gradient-to-r from-amber-400 to-amber-300 text-black shadow-md shadow-amber-400/20'
                        : 'border border-white/12 bg-white/5 text-white/80 hover:bg-white/15 hover:text-white'
                    }`}
                  >
                    {srv.name.replace(' (Default)', '').replace(' VIP', '')}
                  </button>
                ))}

                <a
                  href={embedUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 rounded-xl border border-white/15 bg-white/10 px-2.5 py-1 text-xs font-bold text-white hover:bg-white/20 transition-all ml-1"
                  title="Open video in external tab"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span className="hidden sm:inline">Popout</span>
                </a>
              </div>
            </div>

            {/* Video Player Iframe */}
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/15 bg-black shadow-2xl">
              <iframe
                key={embedUrl}
                src={embedUrl}
                title={`${media.title} Stream Player`}
                allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer; clipboard-write; screen-wake-lock"
                allowFullScreen
                referrerPolicy="origin"
                loading="eager"
                className="h-full w-full border-0"
              />
            </div>

            {/* Friendly notification for upcoming titles */}
            {isFutureOrUnreleased && (
              <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 flex items-start gap-2 text-xs text-amber-200">
                <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Upcoming 2026 Title:</strong> Digital video streams for unreleased films
                  become available when the theatrical or digital VOD release occurs. If Server 1 is
                  waiting for the screener, try the other server mirrors above, or click{' '}
                  <strong>&ldquo;Movie Info &amp; Trailer&rdquo;</strong> to enjoy the official 4K
                  trailer!
                </span>
              </div>
            )}
          </div>
        ) : (
          /* ========================================== */
          /* SHOWCASE OVERVIEW MODE WITH AUTOPLAY TRAILER */
          /* ========================================== */
          <>
            {/* Background Autoplaying Video Trailer / High-Res Poster */}
            <div className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none">
              {/* Base Backdrop Image always loaded first for zero delay */}
              <Image
                src={backdropImage}
                alt={`${media.title} backdrop`}
                fill
                priority
                sizes="100vw"
                className={`object-cover object-center filter brightness-[0.7] contrast-[1.1] transition-opacity duration-1000 ${
                  isTrailerReady ? 'opacity-30' : 'opacity-100'
                }`}
              />

              {/* Autoplaying Trailer Video */}
              {trailerKey && (
                <div className="absolute inset-0 overflow-hidden">
                  <iframe
                    key={`${trailerKey}-${isMuted ? 'muted' : 'unmuted'}`}
                    src={`https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1&mute=${
                      isMuted ? 1 : 0
                    }&controls=0&showinfo=0&rel=0&loop=1&playlist=${trailerKey}&modestbranding=1&iv_load_policy=3&playsinline=1&disablekb=1&fs=0`}
                    title={`${media.title} Background Trailer`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    onLoad={() => setIsTrailerReady(true)}
                    className="absolute top-1/2 left-1/2 w-[180%] h-[180%] -translate-x-1/2 -translate-y-1/2 object-cover border-0 scale-125 opacity-90 transition-opacity duration-700 pointer-events-none"
                  />
                </div>
              )}

              {/* ULTRA HIGH CONTRAST VIGNETTE MASKS */}
              {/* 1. Deep solid dark vignette from left to right */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#07070a] via-[#07070a]/98 via-40% md:via-55% to-transparent z-1" />

              {/* 2. Deep solid dark vignette from bottom to top */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#07070a] via-[#07070a]/90 via-30% to-transparent z-1" />

              {/* 3. Subtle top shadow for navbar harmony */}
              <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#07070a]/80 to-transparent z-1" />
            </div>

            {/* Foreground Content (Left Aligned with Perfect High Contrast) */}
            <div className="relative z-10 max-w-2xl sm:max-w-3xl space-y-4 sm:space-y-5">
              {/* Movie / Show Title */}
              <div>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white drop-shadow-[0_4px_20px_rgba(0,0,0,1)]">
                  {media.title}
                </h1>

                {/* Tagline if available */}
                {media.tagline && (
                  <p className="mt-1 text-xs sm:text-sm font-bold text-amber-300 drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
                    &ldquo;{media.tagline}&rdquo;
                  </p>
                )}
              </div>

              {/* Synopsis Description with High-Contrast Typography */}
              <p className="text-xs sm:text-sm lg:text-base text-white font-medium leading-relaxed max-w-2xl drop-shadow-[0_2px_10px_rgba(0,0,0,1)] line-clamp-3 sm:line-clamp-4">
                {media.overview}
              </p>

              {/* Badges Row: TV Show / Movie, Star rating, Year, Genres with Solid Dark Backing */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs sm:text-sm font-bold">
                {/* Category / Type Pill */}
                <span className="rounded-full border border-white/20 bg-black/80 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-md backdrop-blur-md">
                  {isTv ? 'TV Show' : 'Movie'}
                </span>

                {/* Rating badge */}
                <span className="flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-black/80 px-3.5 py-1 text-xs font-bold text-amber-300 shadow-md backdrop-blur-md">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span>{formattedRating}</span>
                </span>

                {/* Release Year */}
                <span className="rounded-full border border-white/15 bg-black/80 px-3.5 py-1 text-xs font-semibold text-white/90 shadow-md backdrop-blur-md">
                  {releaseYear}
                </span>

                {/* Genres */}
                <span className="rounded-full border border-white/15 bg-black/80 px-3.5 py-1 text-xs font-semibold text-white/90 shadow-md backdrop-blur-md truncate max-w-xs">
                  {(media.genres && media.genres.length > 0 ? media.genres : ['Action', 'Drama']).join(', ')}
                </span>
              </div>

              {/* Primary Action Buttons Row: Watch Now, Download, Trailer */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {/* 1. Watch Now Button (White Pill with play icon) */}
                <button
                  type="button"
                  onClick={onWatchNow}
                  className="flex items-center gap-2 rounded-full bg-white hover:bg-neutral-100 text-black px-7 sm:px-8 py-3 text-sm sm:text-base font-extrabold shadow-[0_10px_30px_rgba(0,0,0,0.8)] hover:scale-[1.03] transition-all cursor-pointer group"
                >
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-white group-hover:scale-110 transition-transform">
                    <Play className="h-3 w-3 fill-white translate-x-0.5" />
                  </div>
                  <span>Watch Now</span>
                </button>

                {/* 2. Download Button (Amber / Gold Pill with download icon) */}
                <button
                  type="button"
                  onClick={onOpenDownload}
                  className="flex items-center gap-2 rounded-full bg-[#e59b2c] hover:bg-[#d48c20] text-black px-6 sm:px-7 py-3 text-sm sm:text-base font-extrabold shadow-[0_10px_30px_rgba(0,0,0,0.8)] hover:scale-[1.03] transition-all cursor-pointer"
                >
                  <Download className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2.5]" />
                  <span>Download</span>
                </button>

                {/* 3. Trailer Button (Dark Glass Pill with YouTube/play icon) */}
                <button
                  type="button"
                  onClick={onOpenTrailer}
                  className="flex items-center gap-2 rounded-full border border-white/20 bg-black/70 hover:bg-black/90 text-white px-5 sm:px-6 py-3 text-sm sm:text-base font-bold backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.8)] transition-all cursor-pointer"
                >
                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-white">
                    <Play className="h-2.5 w-2.5 fill-white translate-x-0.5" />
                  </div>
                  <span>Trailer</span>
                </button>
              </div>

              {/* Subtitles Banner with Solid Legible Container */}
              <div
                onClick={onOpenSubtitles}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onOpenSubtitles();
                  }
                }}
                className="flex items-center justify-between gap-3 rounded-2xl sm:rounded-full border border-white/20 bg-[#101016]/95 hover:bg-[#181822] hover:border-amber-400/50 px-4 sm:px-5 py-2.5 backdrop-blur-xl transition-all cursor-pointer max-w-md select-none group shadow-xl"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Languages className="h-4 w-4 text-amber-400 shrink-0" />
                  <div className="flex items-baseline gap-1.5 truncate">
                    <span className="text-xs sm:text-sm font-extrabold text-white group-hover:text-amber-300 transition-colors">
                      Subtitles
                    </span>
                    <span className="text-xs font-semibold text-white/80">in your language</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-1 text-sm">
                    <span>🇬🇧</span>
                    <span>🇺🇸</span>
                    <span>🇪🇸</span>
                    <span>🇪🇹</span>
                    <span>🇫🇷</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-amber-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>

              {/* Action Pills Row: Watchlist, Mark as Watched, Add to list, Like, Share */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-1">
                {/* Watchlist */}
                <button
                  type="button"
                  onClick={handleToggleWatchlist}
                  className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all shadow-md cursor-pointer ${
                    isBookmarked
                      ? 'bg-amber-400 text-black shadow-amber-400/25 border border-amber-300'
                      : 'border border-white/20 bg-[#101016]/90 text-white hover:bg-white/15'
                  }`}
                >
                  <Bookmark className={`h-3.5 w-3.5 ${isBookmarked ? 'fill-black' : ''}`} />
                  <span>{isBookmarked ? 'In Watchlist' : 'Watchlist'}</span>
                </button>

                {/* Mark as Watched */}
                <button
                  type="button"
                  onClick={handleToggleWatched}
                  className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all shadow-md cursor-pointer ${
                    hasWatched
                      ? 'bg-emerald-400 text-black shadow-emerald-400/25 border border-emerald-300'
                      : 'border border-white/20 bg-[#101016]/90 text-white hover:bg-white/15'
                  }`}
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>{hasWatched ? 'Watched' : 'Mark as Watched'}</span>
                </button>

                {/* Add to list */}
                <button
                  type="button"
                  onClick={onOpenAddToList}
                  className="flex items-center gap-1.5 rounded-full border border-white/20 bg-[#101016]/90 px-4 py-2 text-xs font-bold text-white hover:bg-white/15 shadow-md transition-all cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add to list</span>
                </button>

                {/* Like */}
                <button
                  type="button"
                  onClick={handleToggleLike}
                  className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold shadow-md transition-all cursor-pointer ${
                    isLiked
                      ? 'bg-rose-500/25 text-rose-300 border border-rose-500/50'
                      : 'border border-white/20 bg-[#101016]/90 text-white hover:bg-white/15'
                  }`}
                >
                  <Heart className={`h-3.5 w-3.5 ${isLiked ? 'fill-rose-400 text-rose-400' : ''}`} />
                  <span>{isLiked ? `Liked (${likeCount})` : `Like (${likeCount})`}</span>
                </button>

                {/* Share */}
                <button
                  type="button"
                  onClick={handleShare}
                  className="flex items-center gap-1.5 rounded-full border border-white/20 bg-[#101016]/90 px-4 py-2 text-xs font-bold text-white hover:bg-white/15 shadow-md transition-all cursor-pointer"
                >
                  {shareCopied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="h-3.5 w-3.5" />
                      <span>Share</span>
                    </>
                  )}
                </button>
              </div>

              {/* Prime Video / CinemaHD Watermark Badge in bottom left */}
              <div className="pt-2 flex items-center gap-2 opacity-85">
                <span className="font-serif italic font-extrabold text-lg text-white/60 tracking-tight drop-shadow">
                  prime video
                </span>
                <span className="text-white/30">|</span>
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1 drop-shadow">
                  <Sparkles className="h-3 w-3" /> CinemaHD Ultra
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Parental Rating Footer Line (Under the banner card as in reference image) */}
      <div className="flex items-center gap-3 pt-3 border-t border-white/15 text-xs px-2">
        <span className="font-bold tracking-widest text-white/50 uppercase text-[11px]">
          PARENTAL RATING
        </span>
        <span className="rounded bg-white/15 border border-white/25 px-2.5 py-0.5 font-black text-white">
          {getParentalRating()}
        </span>
        <span className="text-white/30 hidden sm:inline">•</span>
        <span className="text-white/50 hidden sm:inline font-medium">
          {isTv ? 'Suitable for mature audiences' : 'Parental guidance advised for younger viewers'}
        </span>
      </div>
    </div>
  );
};
