import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { TopbarComponent } from '../../shared/components/topbar/topbar.component';
import { VideoService } from '../../core/services/video.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, TopbarComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  sidebarOpen = false;
  activeSection = 'home';

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
    'linear-gradient(135deg,#fd79a8,#e84393)',
    'linear-gradient(135deg,#fdcb6e,#f39c12)',
    'linear-gradient(135deg,#6c5ce7,#a29bfe)',
    'linear-gradient(135deg,#00cec9,#00b894)',
    'linear-gradient(135deg,#e17055,#d63031)',
    'linear-gradient(135deg,#74b9ff,#0984e3)',
  ];

  emojis = [
    'fa-film',
    'fa-masks-theater',
    'fa-rocket',
    'fa-water',
    'fa-paw',
    'fa-shield-halved',
    'fa-star',
    'fa-skull-crossbones',
    'fa-user-ninja',
    'fa-brain',
    'fa-mountain',
    'fa-chess-rook',
    'fa-magnifying-glass',
    'fa-dragon',
    'fa-city',
    'fa-guitar',
  ];

  trendingCards: any[] = [];
  continueCards: any[] = [];
  liveChannels: any[] = [];
  popularMovies: any[] = [];
  newReleases: any[] = [];

  allMovies: any[] = [];
  filteredMovies: any[] = [];
  movieFilter = 'All';
  movieFilters = [
    'All',
    'Action',
    'Comedy',
    'Drama',
    'Sci-Fi',
    'Horror',
    'Romance',
  ];

  allShows: any[] = [];
  filteredShows: any[] = [];
  showFilter = 'All';
  showFilters = ['All', 'Drama', 'Reality', 'Documentary', 'Animation'];

  allChannels: any[] = [];
  filteredChannels: any[] = [];
  channelFilter = 'All';
  channelFilters = ['All', 'Entertainment', 'News', 'Sports', 'Music', 'Kids'];

  searchQuery = '';
  searchResults: any[] = [];
  hasSearched = false;

  categories = [
    {
      name: 'Action',
      count: '245 movies',
      gradient: 'linear-gradient(135deg,#ff4757,#c0392b)',
    },
    {
      name: 'Comedy',
      count: '189 movies',
      gradient: 'linear-gradient(135deg,#ffd32a,#ff9f1a)',
    },
    {
      name: 'Drama',
      count: '312 movies',
      gradient: 'linear-gradient(135deg,#7c5cbf,#4834d4)',
    },
    {
      name: 'Sci-Fi',
      count: '156 movies',
      gradient: 'linear-gradient(135deg,#0abde3,#48dbfb)',
    },
    {
      name: 'Horror',
      count: '98 movies',
      gradient: 'linear-gradient(135deg,#2d3436,#636e72)',
    },
    {
      name: 'Romance',
      count: '201 movies',
      gradient: 'linear-gradient(135deg,#fd79a8,#e84393)',
    },
    {
      name: 'Documentary',
      count: '167 shows',
      gradient: 'linear-gradient(135deg,#00b894,#55efc4)',
    },
    {
      name: 'Animation',
      count: '134 shows',
      gradient: 'linear-gradient(135deg,#6c5ce7,#a29bfe)',
    },
    {
      name: 'Sports',
      count: '89 channels',
      gradient: 'linear-gradient(135deg,#00cec9,#81ecec)',
    },
    {
      name: 'News',
      count: '45 channels',
      gradient: 'linear-gradient(135deg,#d63031,#ff7675)',
    },
    {
      name: 'Kids',
      count: '156 shows',
      gradient: 'linear-gradient(135deg,#fdcb6e,#ffeaa7)',
    },
    {
      name: 'Music',
      count: '32 channels',
      gradient: 'linear-gradient(135deg,#e056fd,#be2edd)',
    },
  ];

  selectedMovie: any = null;

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
    'Iron Tide',
    'Velvet Sky',
    'Night Shift',
    'Pulse',
    'Zero Gravity',
    'The Signal',
  ];
  showNames = [
    'The Last Kingdom',
    'Code Black',
    'Empire Falls',
    'Night Watch',
    'Silent Witness',
    'The Crown',
    'Dark Matter',
    'Altered Carbon',
    'Stranger Tides',
    'The Expanse',
    'Breaking Point',
    'Lost City',
  ];

  channelData = [
    {
      name: 'StreamNews',
      icon: 'fa-newspaper',
      color: 'linear-gradient(135deg,#e74c3c,#c0392b)',
      cat: 'News',
      live: true,
    },
    {
      name: 'Sports Arena',
      icon: 'fa-football',
      color: 'linear-gradient(135deg,#2ecc71,#27ae60)',
      cat: 'Sports',
      live: true,
    },
    {
      name: 'Music Box',
      icon: 'fa-music',
      color: 'linear-gradient(135deg,#9b59b6,#8e44ad)',
      cat: 'Music',
      live: true,
    },
    {
      name: 'Cinema Plus',
      icon: 'fa-clapperboard',
      color: 'linear-gradient(135deg,#3498db,#2980b9)',
      cat: 'Entertainment',
      live: true,
    },
    {
      name: 'Kids World',
      icon: 'fa-child',
      color: 'linear-gradient(135deg,#f39c12,#e67e22)',
      cat: 'Kids',
      live: true,
    },
    {
      name: 'Discovery HD',
      icon: 'fa-microscope',
      color: 'linear-gradient(135deg,#1abc9c,#16a085)',
      cat: 'Documentary',
      live: true,
    },
    {
      name: 'Comedy Central',
      icon: 'fa-face-laugh',
      color: 'linear-gradient(135deg,#e84393,#fd79a8)',
      cat: 'Entertainment',
      live: true,
    },
    {
      name: 'ESPN HD',
      icon: 'fa-basketball',
      color: 'linear-gradient(135deg,#0984e3,#74b9ff)',
      cat: 'Sports',
      live: true,
    },
    {
      name: 'CNN Live',
      icon: 'fa-tower-broadcast',
      color: 'linear-gradient(135deg,#d63031,#ff7675)',
      cat: 'News',
      live: true,
    },
    {
      name: 'Nat Geo',
      icon: 'fa-earth-americas',
      color: 'linear-gradient(135deg,#f1c40f,#f9ca24)',
      cat: 'Documentary',
      live: true,
    },
    {
      name: 'MTV Hits',
      icon: 'fa-guitar',
      color: 'linear-gradient(135deg,#e056fd,#be2edd)',
      cat: 'Music',
      live: true,
    },
    {
      name: 'Cartoon Net',
      icon: 'fa-pen-nib',
      color: 'linear-gradient(135deg,#ff6348,#ff4757)',
      cat: 'Kids',
      live: false,
    },
  ];

  cast = [
    { name: 'Chris Evans', role: 'Commander', icon: 'fa-user-tie' },
    { name: 'Zendaya', role: 'Maya', icon: 'fa-user-astronaut' },
    { name: 'Oscar Isaac', role: 'Dr. Park', icon: 'fa-user-doctor' },
    { name: 'Florence Pugh', role: 'Agent Lee', icon: 'fa-user-secret' },
    { name: 'Pedro Pascal', role: 'Captain', icon: 'fa-user-shield' },
  ];

  constructor(
    private videoService: VideoService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.buildMockData();
    this.startHeroTimer();
    this.loadRealData();
  }

  buildMockData(): void {
    const makeCard = (names: string[], offset = 0) =>
      names.map((name, i) => ({
        title: name,
        meta: `${2020 + (i % 5)} • ${1 + (i % 3)}h ${30 * (i % 2)}min`,
        rating: (7 + (i % 3) * 0.5).toFixed(1),
        gradient: this.gradients[(i + offset) % this.gradients.length],
        emoji: this.emojis[(i + offset) % this.emojis.length],
        badge: i < 2 ? 'hd' : null,
        genre: this.movieFilters[1 + (i % (this.movieFilters.length - 1))],
      }));

    this.allMovies = makeCard(this.movieNames);
    this.filteredMovies = [...this.allMovies];
    this.allShows = makeCard(this.showNames, 4);
    this.filteredShows = [...this.allShows];
    this.allChannels = this.channelData;
    this.filteredChannels = [...this.allChannels];
    this.trendingCards = this.allMovies.slice(0, 8);
    this.continueCards = this.allMovies
      .slice(0, 5)
      .map((c) => ({ ...c, progress: 20 + Math.floor(Math.random() * 60) }));
    this.liveChannels = this.channelData.slice(0, 8);
    this.popularMovies = this.allMovies.slice(3, 11);
    this.newReleases = this.allShows.slice(0, 8);
    this.searchResults = [...this.allMovies, ...this.allShows];
  }

  loadRealData(): void {
    this.videoService.getTrending(10).subscribe({
      next: (res) => {
        if (res.data?.videos?.length) {
          const cards = res.data.videos.map((v: any, i: number) => ({
            title: v.title,
            meta: `${v.releaseYear || '2024'} • ${v.type}`,
            rating: '8.0',
            gradient: this.gradients[i % this.gradients.length],
            emoji: this.emojis[i % this.emojis.length],
            badge: null,
            genre: 'Action',
          }));
          this.trendingCards = cards;
          this.allMovies = cards;
          this.filteredMovies = cards;
        }
      },
      error: () => {},
    });

    this.videoService.getChannels().subscribe({
      next: (res) => {
        if (res.data?.channels?.length) {
          this.allChannels = res.data.channels.map((c: any, i: number) => ({
            name: c.name,
            icon: this.channelData[i % this.channelData.length].icon,
            color: this.gradients[i % this.gradients.length],
            cat: c.category,
            live: c.isActive,
          }));
          this.filteredChannels = [...this.allChannels];
          this.liveChannels = this.allChannels.slice(0, 8);
        }
      },
      error: () => {},
    });
  }

  filterMovies(genre: string): void {
    this.movieFilter = genre;
    this.filteredMovies =
      genre === 'All'
        ? [...this.allMovies]
        : this.allMovies.filter((m) => m.genre === genre);
  }

  filterShows(genre: string): void {
    this.showFilter = genre;
    this.filteredShows =
      genre === 'All'
        ? [...this.allShows]
        : this.allShows.filter((s) => s.genre === genre);
  }

  filterChannels(cat: string): void {
    this.channelFilter = cat;
    this.filteredChannels =
      cat === 'All'
        ? [...this.allChannels]
        : this.allChannels.filter((c) => c.cat === cat);
  }

  onSearch(): void {
    this.hasSearched = true;
    const q = this.searchQuery.toLowerCase();
    this.searchResults = q
      ? [...this.allMovies, ...this.allShows].filter((i) =>
          i.title.toLowerCase().includes(q),
        )
      : [...this.allMovies, ...this.allShows];
  }

  openDetail(item: any): void {
    this.selectedMovie = item;
    this.activeSection = 'detail';
    this.cdr.detectChanges();
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
    this.cdr.detectChanges();
  }

  toggleSetting(event: Event): void {
    const el = event.target as HTMLElement;
    el.classList.toggle('on');
  }

  ngOnDestroy(): void {
    clearInterval(this.heroTimer);
  }
}
