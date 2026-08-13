import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { TopbarComponent } from '../../shared/components/topbar/topbar.component';
import { VideoService } from '../../core/services/video.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SidebarComponent, TopbarComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  sidebarOpen = false;
  activeSection = 'home';

  // Hero slider
  heroIndex = 0;
  heroTimer: any;
  heroItems = [
    {
      title: 'Crimson Horizon',
      tag: 'New Release',
      meta: '2024 • 2h 18min • Action',
      rating: '8.7',
      desc: "In a dystopian future where humanity's last survivors live in floating cities, a rogue pilot discovers a conspiracy that threatens everything.",
      gradient: 'linear-gradient(135deg,#1a0533 0%,#0d2b3a 50%,#1a0533 100%)',
    },
    {
      title: 'Deep Blue Planet: Season 3',
      tag: 'Documentary',
      meta: '2024 • 8 Episodes • Nature',
      rating: '9.1',
      desc: "Dive into the deepest oceans and discover creatures never seen before. A breathtaking journey through Earth's last frontier.",
      gradient: 'linear-gradient(135deg,#0a1628 0%,#0d3b66 50%,#0a1628 100%)',
    },
    {
      title: 'The Last Kingdom',
      tag: 'Trending',
      meta: '2024 • 5 Seasons • Drama',
      rating: '8.5',
      desc: 'An epic saga of power, betrayal, and redemption set in a crumbling empire. The most-watched series of the year.',
      gradient: 'linear-gradient(135deg,#1a0a0a 0%,#3d1a1a 50%,#1a0a0a 100%)',
    },
    {
      title: 'Live: Champions League',
      tag: 'Live Now',
      meta: 'Sports • HD',
      rating: '',
      desc: 'Watch the biggest match of the season live! Coverage begins with pre-match analysis and expert commentary.',
      gradient: 'linear-gradient(135deg,#0a1a0a 0%,#1a3d1a 50%,#0a1a0a 100%)',
    },
  ];

  gradients = [
    'linear-gradient(135deg,#ff6b6b,#ee5a24)',
    'linear-gradient(135deg,#54a0ff,#2e86de)',
    'linear-gradient(135deg,#5f27cd,#341f97)',
    'linear-gradient(135deg,#ff9ff3,#f368e0)',
    'linear-gradient(135deg,#00d2d3,#01a3a4)',
    'linear-gradient(135deg,#ffa502,#e67e22)',
    'linear-gradient(135deg,#2ed573,#009432)',
    'linear-gradient(135deg,#ff4757,#c0392b)',
    'linear-gradient(135deg,#a55eea,#6c5ce7)',
    'linear-gradient(135deg,#26de81,#20bf6b)',
  ];
  emojis = [
    '🎬',
    '🎭',
    '🚀',
    '🌊',
    '🦁',
    '⚔️',
    '🎪',
    '🏴‍☠️',
    '🦸',
    '🧠',
    '🌋',
    '🏰',
    '🕵️',
    '🐉',
    '🌃',
    '🎸',
  ];

  trendingCards: any[] = [];
  continueCards: any[] = [];
  liveChannels: any[] = [];
  popularMovies: any[] = [];

  movieNames = [
    'Crimson Horizon',
    'Neon Nights',
    'Deep Blue Planet',
    'The Last Frontier',
    'Quantum Shift',
    'Shadow Protocol',
    'Arctic Thunder',
    'Stellar Drift',
    'Code Zero',
    'Phantom Circuit',
  ];
  channelData = [
    {
      name: 'StreamNews',
      icon: '📰',
      color: 'linear-gradient(135deg,#e74c3c,#c0392b)',
      cat: 'News',
      live: true,
    },
    {
      name: 'Sports Arena',
      icon: '⚽',
      color: 'linear-gradient(135deg,#2ecc71,#27ae60)',
      cat: 'Sports',
      live: true,
    },
    {
      name: 'Music Box',
      icon: '🎵',
      color: 'linear-gradient(135deg,#9b59b6,#8e44ad)',
      cat: 'Music',
      live: true,
    },
    {
      name: 'Cinema Plus',
      icon: '🎬',
      color: 'linear-gradient(135deg,#3498db,#2980b9)',
      cat: 'Movies',
      live: true,
    },
    {
      name: 'Kids World',
      icon: '🧸',
      color: 'linear-gradient(135deg,#f39c12,#e67e22)',
      cat: 'Kids',
      live: true,
    },
    {
      name: 'Discovery HD',
      icon: '🔬',
      color: 'linear-gradient(135deg,#1abc9c,#16a085)',
      cat: 'Documentary',
      live: true,
    },
    {
      name: 'Comedy Central',
      icon: '😂',
      color: 'linear-gradient(135deg,#e84393,#fd79a8)',
      cat: 'Entertainment',
      live: true,
    },
    {
      name: 'ESPN HD',
      icon: '🏈',
      color: 'linear-gradient(135deg,#0984e3,#74b9ff)',
      cat: 'Sports',
      live: true,
    },
  ];

  constructor(
    private videoService: VideoService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.buildMockData();
    this.startHeroTimer();
    // Try to load real data from API
    this.loadRealData();
  }

  buildMockData(): void {
    this.trendingCards = this.movieNames.map((name, i) => ({
      title: name,
      meta: `${2020 + (i % 5)} • ${1 + (i % 3)}h ${30 * (i % 2)}min`,
      rating: (7 + (i % 3)).toFixed(1),
      gradient: this.gradients[i % this.gradients.length],
      emoji: this.emojis[i % this.emojis.length],
      badge: i < 2 ? 'hd' : null,
    }));
    this.continueCards = this.trendingCards
      .slice(0, 5)
      .map((c) => ({ ...c, progress: 20 + Math.random() * 60 }));
    this.liveChannels = this.channelData;
    this.popularMovies = this.trendingCards.slice(3, 10);
  }

  loadRealData(): void {
    this.videoService.getTrending(10).subscribe({
      next: (res) => {
        if (res.data?.videos?.length) {
          this.trendingCards = res.data.videos.map((v: any, i: number) => ({
            title: v.title,
            meta: `${v.releaseYear || '2024'} • ${v.type}`,
            rating: '8.0',
            gradient: this.gradients[i % this.gradients.length],
            emoji: this.emojis[i % this.emojis.length],
            badge: null,
          }));
        }
      },
      error: () => {}, // keep mock data on error
    });

    this.videoService.getChannels().subscribe({
      next: (res) => {
        if (res.data?.channels?.length) {
          this.liveChannels = res.data.channels.map((c: any, i: number) => ({
            name: c.name,
            icon: this.emojis[i % this.emojis.length],
            color: this.gradients[i % this.gradients.length],
            cat: c.category,
            live: c.isActive,
          }));
        }
      },
      error: () => {},
    });
  }

  startHeroTimer(): void {
    this.heroTimer = setInterval(() => {
      this.heroIndex = (this.heroIndex + 1) % this.heroItems.length;
    }, 6000);
  }

  setHero(i: number): void {
    this.heroIndex = i;
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }
  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  onNavigate(section: string): void {
    this.activeSection = section;
    this.sidebarOpen = false;
  }

  ngOnDestroy(): void {
    clearInterval(this.heroTimer);
  }
}
