import { MediaItem, StreamServer } from '@/types/media';

/**
 * CinemaHD Multi-Server Streaming Engine
 * Option 1: VidSrc VIP (Primary)
 * Option 2: VidSrc.pm (Official Fast Mirror)
 * Followed by auxiliary backup mirrors.
 */
export const STREAM_SERVERS: StreamServer[] = [
  {
    id: 'primesrc',
    name: 'PrimeSrc 4K',
    tag: 'Ultra-Fast 4K HDR • Instant Playback • Low Latency',
    speed: 'Ultra',
    quality: '4K HDR',
    hasSubtitles: true,
    getUrl: (media: MediaItem, season = 1, episode = 1) => {
      const tmdbId = media.tmdbId || media.id;
      if (media.mediaType === 'tv') {
        return `https://primesrc.me/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}`;
      }
      return `https://primesrc.me/embed/movie?tmdb=${tmdbId}`;
    },
  },
  {
    id: 'vidsrc-sh',
    name: 'VidSrc Official',
    tag: 'Official VidSrc Cloud Stream • 1080p HD • Multi-Audio',
    speed: 'Ultra',
    quality: '1080p HD',
    hasSubtitles: true,
    getUrl: (media: MediaItem, season = 1, episode = 1) => {
      const tmdbId = media.tmdbId || media.id;
      if (media.mediaType === 'tv') {
        return `https://vidsrc.sh/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}`;
      }
      return `https://vidsrc.sh/embed/movie?tmdb=${tmdbId}`;
    },
  },
  {
    id: 'moviesapi-to',
    name: 'MoviesAPI Turbo',
    tag: 'NotFlix Default Engine • Fast Edge Network',
    speed: 'Ultra',
    quality: '1080p HD',
    hasSubtitles: true,
    getUrl: (media: MediaItem, season = 1, episode = 1) => {
      const tmdbId = media.tmdbId || media.id;
      if (media.mediaType === 'tv') {
        return `https://moviesapi.to/tv/${tmdbId}-${season}-${episode}`;
      }
      return `https://moviesapi.to/movie/${tmdbId}`;
    },
  },
  {
    id: 'vidsrc-to',
    name: 'VidSrc.to',
    tag: 'VidSrc Direct HD Mirror • High Speed',
    speed: 'Ultra',
    quality: '1080p HD',
    hasSubtitles: true,
    getUrl: (media: MediaItem, season = 1, episode = 1) => {
      const tmdbId = media.tmdbId || media.id;
      if (media.mediaType === 'tv') {
        return `https://vidsrc.to/embed/tv/${tmdbId}/${season}/${episode}`;
      }
      return `https://vidsrc.to/embed/movie/${tmdbId}`;
    },
  },
  {
    id: 'vidsrc-pm',
    name: 'VidSrc.pm',
    tag: 'Official Mirror • Fast 1080p HD',
    speed: 'Ultra',
    quality: '1080p HD',
    hasSubtitles: true,
    getUrl: (media: MediaItem, season = 1, episode = 1) => {
      const tmdbId = media.tmdbId || media.id;
      if (media.mediaType === 'tv') {
        return `https://vidsrc.pm/embed/tv/${tmdbId}/${season}/${episode}`;
      }
      return `https://vidsrc.pm/embed/movie/${tmdbId}`;
    },
  },
  {
    id: 'vidlink',
    name: 'VidLink Ultra',
    tag: 'Ultra 4K Stream • Multi-Subtitles',
    speed: 'Ultra',
    quality: '4K HDR',
    hasSubtitles: true,
    getUrl: (media: MediaItem, season = 1, episode = 1) => {
      const tmdbId = media.tmdbId || media.id;
      if (media.mediaType === 'tv') {
        return `https://vidlink.pro/tv/${tmdbId}/${season}/${episode}`;
      }
      return `https://vidlink.pro/movie/${tmdbId}`;
    },
  },
  {
    id: 'vidcore',
    name: 'VidCore Turbo',
    tag: 'Direct High-Speed HLS • Fast AutoPlay',
    speed: 'Ultra',
    quality: '1080p HD',
    hasSubtitles: true,
    getUrl: (media: MediaItem, season = 1, episode = 1) => {
      const tmdbId = media.tmdbId || media.id;
      if (media.mediaType === 'tv') {
        return `https://vidcore.net/tv/${tmdbId}/${season}/${episode}?autoPlay=true`;
      }
      return `https://vidcore.net/movie/${tmdbId}?autoPlay=true`;
    },
  },
  {
    id: 'vidfast',
    name: 'VidFast VIP',
    tag: 'VidSrc WTF VIP Node 3 • Zero Buffer',
    speed: 'Ultra',
    quality: '1080p HD',
    hasSubtitles: true,
    getUrl: (media: MediaItem, season = 1, episode = 1) => {
      const tmdbId = media.tmdbId || media.id;
      if (media.mediaType === 'tv') {
        return `https://www.vidsrc.wtf/3/tv/${tmdbId}/${season}/${episode}?color=e01621`;
      }
      return `https://www.vidsrc.wtf/3/movie/${tmdbId}?color=e01621`;
    },
  },
  {
    id: 'srcwtf',
    name: 'SrcWTF Node 1',
    tag: 'VidSrc WTF Edge 1 • Adaptive Cloud',
    speed: 'Ultra',
    quality: '1080p HD',
    hasSubtitles: true,
    getUrl: (media: MediaItem, season = 1, episode = 1) => {
      const tmdbId = media.tmdbId || media.id;
      if (media.mediaType === 'tv') {
        return `https://www.vidsrc.wtf/1/tv/${tmdbId}/${season}/${episode}?color=e01621`;
      }
      return `https://www.vidsrc.wtf/1/movie/${tmdbId}?color=e01621`;
    },
  },
  {
    id: 'premium-wtf',
    name: 'Premium WTF',
    tag: 'Dedicated Premium WTF Line 4',
    speed: 'Ultra',
    quality: '4K HDR',
    hasSubtitles: true,
    getUrl: (media: MediaItem, season = 1, episode = 1) => {
      const tmdbId = media.tmdbId || media.id;
      if (media.mediaType === 'tv') {
        return `https://www.vidsrc.wtf/4/tv/${tmdbId}/${season}/${episode}?color=e01621`;
      }
      return `https://www.vidsrc.wtf/4/movie/${tmdbId}?color=e01621`;
    },
  },
  {
    id: 'vidzee',
    name: 'VidZee HD',
    tag: 'VidZee Player Cloud Network',
    speed: 'Fast',
    quality: '1080p HD',
    hasSubtitles: true,
    getUrl: (media: MediaItem, season = 1, episode = 1) => {
      const tmdbId = media.tmdbId || media.id;
      if (media.mediaType === 'tv') {
        return `https://player.vidzee.wtf/embed/tv/${tmdbId}/${season}/${episode}`;
      }
      return `https://player.vidzee.wtf/embed/movie/${tmdbId}`;
    },
  },
  {
    id: 'moviesapi-to',
    name: 'MoviesAPI.to',
    tag: 'MoviesAPI Fast Content Delivery',
    speed: 'Fast',
    quality: '1080p HD',
    hasSubtitles: true,
    getUrl: (media: MediaItem, season = 1, episode = 1) => {
      const tmdbId = media.tmdbId || media.id;
      if (media.mediaType === 'tv') {
        return `https://moviesapi.to/tv/${tmdbId}-${season}-${episode}`;
      }
      return `https://moviesapi.to/movie/${tmdbId}`;
    },
  },
  {
    id: 'vidsrc-embed-ru',
    name: 'VidSrc RU Cloud',
    tag: 'VidSrc Embed RU Mirror',
    speed: 'Fast',
    quality: '1080p HD',
    hasSubtitles: true,
    getUrl: (media: MediaItem, season = 1, episode = 1) => {
      const tmdbId = media.tmdbId || media.id;
      if (media.mediaType === 'tv') {
        return `https://vidsrc-embed.ru/embed/tv/${tmdbId}/${season}/${episode}`;
      }
      return `https://vidsrc-embed.ru/embed/movie/${tmdbId}`;
    },
  },
];

export function getEmbedUrl(
  serverId: string,
  media: MediaItem,
  season = 1,
  episode = 1
): string {
  const server = STREAM_SERVERS.find((s) => s.id === serverId) || STREAM_SERVERS[0];
  return server.getUrl(media, season, episode);
}

/**
 * OpenSubtitles query helper (extracted from NotFlix & enhanced)
 */
export function getOpenSubtitlesSearchUrl(
  title: string,
  year?: string,
  season?: number,
  episode?: number,
  languageCode: string = 'all'
): string {
  const query = season && episode
    ? `${title} S${String(season).padStart(2, '0')}E${String(episode).padStart(2, '0')}`
    : `${title} ${year || ''}`.trim();
  return `https://www.opensubtitles.org/en/search2/sublanguageid-${languageCode}/moviename-${encodeURIComponent(query)}`;
}

export interface DownloadSource {
  quality: string;
  name: string;
  format: string;
  type: 'direct' | 'stream' | 'torrent' | 'magnet';
  url: string;
  badge?: string;
}

export function getDownloadSources(
  media: MediaItem,
  season = 1,
  episode = 1
): DownloadSource[] {
  const tmdbId = media.tmdbId || media.id;
  const isTv = media.mediaType === 'tv';
  const query = isTv
    ? `${media.title} S${String(season).padStart(2, '0')}E${String(episode).padStart(2, '0')}`
    : `${media.title} ${media.releaseDate ? media.releaseDate.split('-')[0] : ''}`.trim();

  return [
    {
      quality: '4K Ultra HD',
      name: 'Direct Fast Mirror 1 (VidLink Pro)',
      format: 'MKV / H.265 HDR',
      type: 'stream',
      badge: 'Ultra Fast',
      url: isTv
        ? `https://vidlink.pro/tv/${tmdbId}/${season}/${episode}`
        : `https://vidlink.pro/movie/${tmdbId}`,
    },
    {
      quality: '1080p Full HD',
      name: 'High-Speed Cloud Stream (VidSrc VIP)',
      format: 'MP4 / 1080p',
      type: 'stream',
      badge: 'Recommended',
      url: isTv
        ? `https://vidsrcme.ru/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}`
        : `https://vidsrcme.ru/embed/movie?tmdb=${tmdbId}`,
    },
    {
      quality: '1080p HD',
      name: 'PrimeSrc Turbo Direct CDN',
      format: 'MP4 / AAC',
      type: 'direct',
      badge: 'NotFlix Mirror',
      url: isTv
        ? `https://primesrc.me/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}`
        : `https://primesrc.me/embed/movie?tmdb=${tmdbId}`,
    },
    {
      quality: 'YTS / Torrentio Search',
      name: 'P2P Ultra Seedbox Torrent Search',
      format: 'Torrent / Magnet',
      type: 'torrent',
      badge: 'P2P',
      url: `https://1337x.to/search/${encodeURIComponent(query)}/1/`,
    },
  ];
}

