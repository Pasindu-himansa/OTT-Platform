import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import Hls from 'hls.js';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('videoEl') videoEl!: ElementRef<HTMLVideoElement>;

  hls: Hls | null = null;

  // Player state
  isPlaying = false;
  isMuted = false;
  isFullscreen = false;
  showControls = true;
  controlsTimer: any;

  // Progress
  currentTime = 0;
  duration = 0;
  buffered = 0;
  volume = 0.8;

  // Content info
  title = 'Crimson Horizon';
  subtitle = '2024 • Action • 2h 18min';

  // Demo stream — replace with real HLS stream URL
  streamUrl = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';

  // Quality levels
  qualityLevels: any[] = [];
  currentQuality = -1; // auto

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Get title from query params if passed
    this.route.queryParams.subscribe((params) => {
      if (params['title']) this.title = params['title'];
      if (params['subtitle']) this.subtitle = params['subtitle'];
      if (params['stream']) this.streamUrl = params['stream'];
    });
  }

  ngAfterViewInit(): void {
    this.initPlayer();
  }

  initPlayer(): void {
    const video = this.videoEl.nativeElement;
    video.volume = this.volume;

    if (Hls.isSupported()) {
      this.hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });
      this.hls.loadSource(this.streamUrl);
      this.hls.attachMedia(video);

      this.hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        this.qualityLevels = data.levels;
        this.play();
      });

      this.hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          console.error('HLS fatal error:', data);
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari native HLS
      video.src = this.streamUrl;
      video.addEventListener('loadedmetadata', () => this.play());
    }

    // Video events
    video.addEventListener('timeupdate', () => this.onTimeUpdate());
    video.addEventListener('ended', () => (this.isPlaying = false));
    video.addEventListener('waiting', () => {});
    video.addEventListener('canplay', () => {});
    video.addEventListener('progress', () => this.onProgress());
    video.addEventListener('volumechange', () => {
      this.volume = video.volume;
      this.isMuted = video.muted;
    });
  }

  play(): void {
    this.videoEl.nativeElement.play();
    this.isPlaying = true;
  }

  togglePlay(): void {
    const video = this.videoEl.nativeElement;
    if (video.paused) {
      video.play();
      this.isPlaying = true;
    } else {
      video.pause();
      this.isPlaying = false;
    }
  }

  toggleMute(): void {
    const video = this.videoEl.nativeElement;
    video.muted = !video.muted;
    this.isMuted = video.muted;
  }

  setVolume(event: Event): void {
    const val = parseFloat((event.target as HTMLInputElement).value);
    this.videoEl.nativeElement.volume = val;
    this.volume = val;
    this.isMuted = val === 0;
  }

  seek(event: Event): void {
    const val = parseFloat((event.target as HTMLInputElement).value);
    this.videoEl.nativeElement.currentTime = val;
    this.currentTime = val;
  }

  seekBy(seconds: number): void {
    const video = this.videoEl.nativeElement;
    video.currentTime = Math.min(
      Math.max(video.currentTime + seconds, 0),
      this.duration,
    );
  }

  onTimeUpdate(): void {
    const video = this.videoEl.nativeElement;
    this.currentTime = video.currentTime;
    this.duration = video.duration || 0;
  }

  onProgress(): void {
    const video = this.videoEl.nativeElement;
    if (video.buffered.length > 0) {
      this.buffered =
        (video.buffered.end(video.buffered.length - 1) / video.duration) * 100;
    }
  }

  toggleFullscreen(): void {
    const el = document.documentElement;
    if (!document.fullscreenElement) {
      el.requestFullscreen();
      this.isFullscreen = true;
    } else {
      document.exitFullscreen();
      this.isFullscreen = false;
    }
  }

  setQuality(index: number): void {
    if (this.hls) {
      this.hls.currentLevel = index;
      this.currentQuality = index;
    }
  }

  formatTime(seconds: number): string {
    if (isNaN(seconds)) return '0:00';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0)
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  get progressPercent(): number {
    return this.duration ? (this.currentTime / this.duration) * 100 : 0;
  }

  showControlsTemporarily(): void {
    this.showControls = true;
    clearTimeout(this.controlsTimer);
    this.controlsTimer = setTimeout(() => {
      if (this.isPlaying) this.showControls = false;
    }, 3000);
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  ngOnDestroy(): void {
    if (this.hls) {
      this.hls.destroy();
    }
    clearTimeout(this.controlsTimer);
  }
}
