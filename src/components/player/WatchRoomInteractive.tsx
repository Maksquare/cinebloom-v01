'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MediaItem } from '@/types/media';
import { PhonofilmHero } from '@/components/media/PhonofilmHero';
import { StreamPlayer } from '@/components/player/StreamPlayer';
import { EpisodePicker } from '@/components/player/EpisodePicker';
import { TrailerModal } from '@/components/media/TrailerModal';
import { SubtitlesModal } from '@/components/media/SubtitlesModal';
import { DownloadModal } from '@/components/media/DownloadModal';
import { AddToListModal } from '@/components/media/AddToListModal';

interface WatchRoomInteractiveProps {
  media: MediaItem;
  initialSeason: number;
  initialEpisode: number;
}

export const WatchRoomInteractive: React.FC<WatchRoomInteractiveProps> = ({
  media,
  initialSeason,
  initialEpisode,
}) => {
  const router = useRouter();
  const playerRef = useRef<HTMLDivElement>(null);

  const [currentSeason, setCurrentSeason] = useState(initialSeason);
  const [currentEpisode, setCurrentEpisode] = useState(initialEpisode);
  const [isLightsOut, setIsLightsOut] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Modals state
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isSubtitlesOpen, setIsSubtitlesOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [isAddToListOpen, setIsAddToListOpen] = useState(false);

  const isTvShow = media.mediaType === 'tv';

  const handleEpisodeSelect = (s: number, e: number) => {
    setCurrentSeason(s);
    setCurrentEpisode(e);
    router.replace(`/watch/${media.mediaType}/${media.id}?season=${s}&episode=${e}`, {
      scroll: false,
    });
  };

  const handleWatchNow = () => {
    setIsPlaying(true);
    if (playerRef.current) {
      playerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      {/* Cinema Lights-Out Ambient Overlay */}
      {isLightsOut && (
        <div
          onClick={() => setIsLightsOut(false)}
          className="fixed inset-0 z-40 bg-black/95 transition-opacity duration-500 cursor-pointer"
          title="Click to turn lights back on"
        />
      )}

      {/* 1. Phonofilm Showcase Hero Banner */}
      <section className="relative z-10 w-full mb-8">
        <PhonofilmHero
          media={media}
          season={currentSeason}
          episode={currentEpisode}
          isPlaying={isPlaying}
          onWatchNow={handleWatchNow}
          onOpenTrailer={() => setIsTrailerOpen(true)}
          onOpenSubtitles={() => setIsSubtitlesOpen(true)}
          onOpenDownload={() => setIsDownloadOpen(true)}
          onOpenAddToList={() => setIsAddToListOpen(true)}
        />
      </section>

      {/* 2. Streaming Player Section */}
      <div
        id="watch-player"
        ref={playerRef}
        className={`relative pt-2 scroll-mt-24 ${isLightsOut ? 'z-50' : 'z-10'}`}
      >
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-white/60">
              {isPlaying ? 'Active Stream Session' : 'CinemaHD 4K Video Player'}
            </span>
          </div>
          <span className="text-xs text-amber-400 font-medium">
            Multi-Server Failover Active
          </span>
        </div>

        <StreamPlayer
          media={media}
          season={currentSeason}
          episode={currentEpisode}
          isLightsOut={isLightsOut}
          onToggleLightsOut={() => setIsLightsOut((prev) => !prev)}
          isControlledPlaying={isPlaying}
          onStartPlaying={() => setIsPlaying(true)}
        />
      </div>

      {/* 3. TV Show Episode Picker */}
      {isTvShow && (
        <div className="mt-8 z-10 relative">
          <EpisodePicker
            media={media}
            currentSeason={currentSeason}
            currentEpisode={currentEpisode}
            onSelectEpisode={handleEpisodeSelect}
          />
        </div>
      )}

      {/* 4. Interactive Modals */}
      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        youtubeKey={media.trailerYoutubeKey}
        title={media.title}
      />

      <SubtitlesModal
        isOpen={isSubtitlesOpen}
        onClose={() => setIsSubtitlesOpen(false)}
        title={media.title}
        year={media.releaseDate ? media.releaseDate.split('-')[0] : '2026'}
        season={isTvShow ? currentSeason : undefined}
        episode={isTvShow ? currentEpisode : undefined}
      />

      <DownloadModal
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
        media={media}
        season={currentSeason}
        episode={currentEpisode}
      />

      <AddToListModal
        isOpen={isAddToListOpen}
        onClose={() => setIsAddToListOpen(false)}
        media={media}
      />
    </>
  );
};
