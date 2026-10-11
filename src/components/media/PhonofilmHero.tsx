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
} from 'lucide-react';
import { MediaItem } from '@/types/media';
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
}) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [hasWatched, setHasWatched] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(128);
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    setIsBookmarked(isInWatchlist(media.id));
    setHasWatched(isWatched(media.id));
    // Check liked from localStorage
    try {
      const likedState = localStorage.getItem(`cinemahd-liked-${media.id}`) === 'true';
      setIsLiked(likedState);
      const seedLikes = Math.floor(media.voteCount ? media.voteCount / 2 : 142);
      setLikeCount(seedLikes + (likedState ? 1 : 0));
    } catch {
      // ignore
    }
  }, [media.id, media.voteCount]);

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

  // Determine release year
  const releaseYear = media.releaseDate ? media.releaseDate.split('-')[0] : '2026';
  const isTv = media.mediaType === 'tv';
  const formattedRating = Number(media.voteAverage || 8.0).toFixed(1);

  // Determine parental rating
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

  return (
    <div className="w-full space-y-4">
      {/* Top Floating Controls Bar */}
      <div className="flex items-center justify-between gap-3 px-1 sm:px-2">
        {/* Left: Back & Home buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-[#18181f]/80 hover:bg-[#252530] text-white/90 hover:text-white border border-white/10 backdrop-blur-md transition-all shadow-md cursor-pointer"
            title="Go Back"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          <Link
            href="/"
            className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-[#18181f]/80 hover:bg-[#252530] text-white/90 hover:text-white border border-white/10 backdrop-blur-md transition-all shadow-md cursor-pointer"
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
            <Search className="absolute left-4 h-4 w-4 text-white/40 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Movies &amp; Series"
              className="w-full rounded-full border border-white/12 bg-[#18181f]/85 py-2 sm:py-2.5 pl-11 pr-4 text-xs sm:text-sm text-white placeholder-white/40 backdrop-blur-md focus:border-amber-400/60 focus:bg-[#202028] focus:outline-none transition-all shadow-inner"
            />
          </div>
        </form>

        {/* Right: User Profile & Mute Toggles */}
        <div className="flex items-center gap-2">
          <Link
            href="/profile"
            className="flex items-center gap-1.5 rounded-full bg-[#18181f]/80 hover:bg-[#252530] px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white/90 hover:text-white border border-white/10 backdrop-blur-md transition-all shadow-md cursor-pointer"
          >
            <User className="h-4 w-4 text-amber-400" />
            <span className="hidden sm:inline">Me</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsMuted((prev) => !prev)}
            className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-[#18181f]/80 hover:bg-[#252530] text-white/90 hover:text-white border border-white/10 backdrop-blur-md transition-all shadow-md cursor-pointer"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400" />
            ) : (
              <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Main Phonofilm-style Movie Card */}
      <div className="relative w-full overflow-hidden rounded-3xl border border-white/12 bg-[#0d0d12] shadow-[0_25px_70px_rgba(0,0,0,0.85)] min-h-[500px] sm:min-h-[560px] lg:min-h-[620px] flex flex-col justify-end p-5 sm:p-10 lg:p-14">
        {/* Background Backdrop Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={backdropImage}
            alt={`${media.title} backdrop`}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center filter brightness-[0.78] contrast-[1.08] transition-transform duration-1000 ease-out hover:scale-102"
          />

          {/* Cinematic Vignette Gradients */}
          {/* Horizontal dark gradient from left to right */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d12] via-[#0d0d12]/90 sm:via-[#0d0d12]/80 md:via-[#0d0d12]/60 to-transparent z-1" />

          {/* Vertical dark gradient from bottom to top */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d12] via-[#0d0d12]/75 to-transparent/30 z-1" />

          {/* Soft ambient tint */}
          <div className="absolute inset-0 bg-radial-at-tl from-amber-500/5 via-transparent to-black/60 z-1" />
        </div>

        {/* Foreground Content (Left Aligned exactly as in image) */}
        <div className="relative z-10 max-w-3xl space-y-4 sm:space-y-5">
          {/* Movie / Show Title */}
          <div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
              {media.title}
            </h1>

            {/* Tagline if available */}
            {media.tagline && (
              <p className="mt-1 text-xs sm:text-sm italic font-medium text-amber-300/80 drop-shadow">
                &ldquo;{media.tagline}&rdquo;
              </p>
            )}
          </div>

          {/* Synopsis Description */}
          <p className="text-xs sm:text-sm lg:text-base text-white/85 leading-relaxed max-w-2xl drop-shadow line-clamp-3 sm:line-clamp-4">
            {media.overview}
          </p>

          {/* Badges Row: TV Show / Movie, Star rating, Year, Genres */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm font-semibold text-white/90">
            {/* Category / Type Pill */}
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-0.5 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              {isTv ? 'TV Show' : 'Movie'}
            </span>

            {/* Rating badge */}
            <span className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span>{formattedRating}</span>
            </span>

            <span className="text-white/40">•</span>

            {/* Release Year */}
            <span className="text-white/80">{releaseYear}</span>

            <span className="text-white/40">•</span>

            {/* Genres */}
            <span className="text-white/80 truncate max-w-xs">
              {(media.genres && media.genres.length > 0 ? media.genres : ['Action', 'Drama']).join(', ')}
            </span>
          </div>

          {/* Primary Action Buttons Row: Watch Now, Download, Trailer */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {/* 1. Watch Now Button (White Pill with play icon - per user explicit instruction) */}
            <button
              type="button"
              onClick={onWatchNow}
              className="flex items-center gap-2 rounded-full bg-white hover:bg-neutral-100 text-black px-7 sm:px-8 py-3 text-sm sm:text-base font-bold shadow-[0_10px_30px_rgba(255,255,255,0.25)] hover:scale-[1.03] transition-all cursor-pointer group"
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
              className="flex items-center gap-2 rounded-full bg-[#e59b2c] hover:bg-[#d48c20] text-black px-6 sm:px-7 py-3 text-sm sm:text-base font-bold shadow-[0_10px_30px_rgba(229,155,44,0.3)] hover:scale-[1.03] transition-all cursor-pointer"
            >
              <Download className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2.5]" />
              <span>Download</span>
            </button>

            {/* 3. Trailer Button (Dark Glass Pill with YouTube/play icon) */}
            <button
              type="button"
              onClick={onOpenTrailer}
              className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 hover:bg-white/20 text-white px-5 sm:px-6 py-3 text-sm sm:text-base font-semibold backdrop-blur-md transition-all cursor-pointer"
            >
              <div className="flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-white">
                <Play className="h-2.5 w-2.5 fill-white translate-x-0.5" />
              </div>
              <span>Trailer</span>
            </button>
          </div>

          {/* Subtitles Banner (Subtitles in your language [flags] >) */}
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
            className="flex items-center justify-between gap-3 rounded-2xl sm:rounded-full border border-white/15 bg-black/45 hover:bg-black/60 hover:border-amber-400/40 px-4 sm:px-5 py-2.5 backdrop-blur-md transition-all cursor-pointer max-w-md select-none group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Languages className="h-4 w-4 text-amber-400 shrink-0" />
              <div className="flex items-baseline gap-1.5 truncate">
                <span className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                  Subtitles
                </span>
                <span className="text-xs text-white/60">in your language</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Flag emojis */}
              <div className="flex items-center gap-1 text-sm">
                <span>🇬🇧</span>
                <span>🇺🇸</span>
                <span>🇪🇸</span>
                <span>🇪🇹</span>
                <span>🇫🇷</span>
              </div>
              <ChevronRight className="h-4 w-4 text-white/50 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>

          {/* Action Pills Row: Watchlist, Mark as Watched, Add to list, Like, Share */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-1">
            {/* Watchlist */}
            <button
              type="button"
              onClick={handleToggleWatchlist}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold backdrop-blur-md transition-all cursor-pointer ${
                isBookmarked
                  ? 'bg-amber-400 text-black shadow-md shadow-amber-400/25 border border-amber-300'
                  : 'border border-white/12 bg-black/40 text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Bookmark className={`h-3.5 w-3.5 ${isBookmarked ? 'fill-black' : ''}`} />
              <span>{isBookmarked ? 'In Watchlist' : 'Watchlist'}</span>
            </button>

            {/* Mark as Watched */}
            <button
              type="button"
              onClick={handleToggleWatched}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold backdrop-blur-md transition-all cursor-pointer ${
                hasWatched
                  ? 'bg-emerald-400 text-black shadow-md shadow-emerald-400/25 border border-emerald-300'
                  : 'border border-white/12 bg-black/40 text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>{hasWatched ? 'Watched' : 'Mark as Watched'}</span>
            </button>

            {/* Add to list */}
            <button
              type="button"
              onClick={onOpenAddToList}
              className="flex items-center gap-1.5 rounded-full border border-white/12 bg-black/40 px-3.5 py-1.5 text-xs font-semibold text-white/80 hover:bg-white/10 hover:text-white backdrop-blur-md transition-all cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add to list</span>
            </button>

            {/* Like */}
            <button
              type="button"
              onClick={handleToggleLike}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold backdrop-blur-md transition-all cursor-pointer ${
                isLiked
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'border border-white/12 bg-black/40 text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Heart className={`h-3.5 w-3.5 ${isLiked ? 'fill-rose-400 text-rose-400' : ''}`} />
              <span>{isLiked ? `Liked (${likeCount})` : `Like (${likeCount})`}</span>
            </button>

            {/* Share */}
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1.5 rounded-full border border-white/12 bg-black/40 px-3.5 py-1.5 text-xs font-semibold text-white/80 hover:bg-white/10 hover:text-white backdrop-blur-md transition-all cursor-pointer"
            >
              {shareCopied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Link Copied!</span>
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
          <div className="pt-2 flex items-center gap-2 opacity-75">
            <span className="font-serif italic font-extrabold text-lg text-white/40 tracking-tight">
              prime video
            </span>
            <span className="text-white/20">|</span>
            <span className="text-[11px] font-bold text-amber-400/80 uppercase tracking-widest flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> CinemaHD Ultra
            </span>
          </div>
        </div>
      </div>

      {/* Parental Rating Footer Line (Under the banner card as in reference image) */}
      <div className="flex items-center gap-3 pt-3 border-t border-white/10 text-xs px-2">
        <span className="font-bold tracking-widest text-white/40 uppercase text-[11px]">
          PARENTAL RATING
        </span>
        <span className="rounded bg-white/10 border border-white/15 px-2 py-0.5 font-extrabold text-white">
          {getParentalRating()}
        </span>
        <span className="text-white/30 hidden sm:inline">•</span>
        <span className="text-white/40 hidden sm:inline">
          {isTv ? 'Suitable for mature audiences' : 'Parental guidance advised for younger viewers'}
        </span>
      </div>
    </div>
  );
};
