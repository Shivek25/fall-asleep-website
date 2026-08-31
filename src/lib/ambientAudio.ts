/**
 * Bedtime ambient audio engine for MP3 playback.
 * Lazy-loaded (0 KB initial page load overhead), continuous seamless looping.
 */

export type SoundscapeType = 'sleep-583079' | 'sleep-music-571041' | 'lofi-sleep-587590' | 'ambient-576612';

export interface SoundscapeOption {
  id: SoundscapeType;
  label: string;
  artist: string;
  description: string;
  icon: string;
  src: string;
}

export const SOUNDSCAPES: SoundscapeOption[] = [
  {
    id: 'sleep-583079',
    label: 'Deep Sleep',
    artist: 'Leberch',
    description: 'Peaceful spiritual sleep meditation',
    icon: '🌙',
    src: '/audio/leberch-sleep-583079.mp3',
  },
  {
    id: 'sleep-music-571041',
    label: 'Sleep Music',
    artist: 'Verclub Music',
    description: 'Calming gentle bedtime melody',
    icon: '✨',
    src: '/audio/verclub_music-sleep-music-571041.mp3',
  },
  {
    id: 'lofi-sleep-587590',
    label: 'Lofi Sleep',
    artist: 'The Mountain',
    description: 'Cozy relaxing lo-fi bedtime chill',
    icon: '☕',
    src: '/audio/the_mountain-lofi-sleep-lofi-sleep-music-587590.mp3',
  },
  {
    id: 'ambient-576612',
    label: 'Ambient Calm',
    artist: 'Atlas Audio',
    description: 'Atmospheric serene ambient pad',
    icon: '🌌',
    src: '/audio/atlasaudio-ambient-ambient-music-576612.mp3',
  },
];

class AmbientEngine {
  private audioElement: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private currentTrack: SoundscapeType = 'sleep-583079';
  private volume: number = 0.35;
  private fadeInterval: number | null = null;

  private getAudio(): HTMLAudioElement {
    if (!this.audioElement && typeof window !== 'undefined') {
      this.audioElement = new Audio();
      this.audioElement.loop = true;
      this.audioElement.preload = 'none'; // Zero initial network payload
    }
    return this.audioElement!;
  }

  private fadeTo(targetVolume: number, durationMs: number = 800, onComplete?: () => void): void {
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }

    const audio = this.getAudio();
    const startVolume = audio.volume;
    const steps = 20;
    const stepTime = durationMs / steps;
    const volumeStep = (targetVolume - startVolume) / steps;
    let currentStep = 0;

    this.fadeInterval = window.setInterval(() => {
      currentStep++;
      const newVol = Math.max(0, Math.min(1, startVolume + volumeStep * currentStep));
      audio.volume = newVol;

      if (currentStep >= steps) {
        if (this.fadeInterval) {
          clearInterval(this.fadeInterval);
          this.fadeInterval = null;
        }
        audio.volume = targetVolume;
        if (onComplete) onComplete();
      }
    }, stepTime);
  }

  public play(track?: SoundscapeType): void {
    try {
      const audio = this.getAudio();
      const selectedId = track || this.currentTrack;
      const option = SOUNDSCAPES.find((s) => s.id === selectedId) || SOUNDSCAPES[0];

      this.currentTrack = option.id;

      // Check if source changed
      const currentSrc = audio.src.replace(window.location.origin, '');
      if (currentSrc !== option.src) {
        audio.src = option.src;
        audio.load();
      }

      audio.volume = 0;
      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.isPlaying = true;
            this.fadeTo(this.volume, 1000);
            this.notifyListeners();
          })
          .catch(() => {
            this.isPlaying = false;
            this.notifyListeners();
          });
      } else {
        this.isPlaying = true;
        this.fadeTo(this.volume, 1000);
        this.notifyListeners();
      }
    } catch {
      this.isPlaying = false;
      this.notifyListeners();
    }
  }

  public pause(): void {
    if (!this.isPlaying || !this.audioElement) {
      this.isPlaying = false;
      this.notifyListeners();
      return;
    }

    this.fadeTo(0, 600, () => {
      if (this.audioElement && !this.isPlaying) {
        this.audioElement.pause();
      }
    });

    this.isPlaying = false;
    this.notifyListeners();
  }

  public toggle(): void {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public setTrack(track: SoundscapeType): void {
    const wasPlaying = this.isPlaying;
    this.currentTrack = track;

    if (wasPlaying) {
      this.play(track);
    } else {
      const audio = this.getAudio();
      const option = SOUNDSCAPES.find((s) => s.id === track);
      if (option) {
        audio.src = option.src;
      }
      this.notifyListeners();
    }
  }

  public setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.audioElement && this.isPlaying && !this.fadeInterval) {
      this.audioElement.volume = this.volume;
    }
    this.notifyListeners();
  }

  public getState() {
    return {
      isPlaying: this.isPlaying,
      currentTrack: this.currentTrack,
      volume: this.volume,
    };
  }

  private listeners: (() => void)[] = [];

  public subscribe(fn: () => void): () => void {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((fn) => fn());
  }
}

export const ambientEngine = new AmbientEngine();
