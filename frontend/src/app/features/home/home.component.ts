import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { TopbarComponent } from '../../shared/components/topbar/topbar.component';
import { VideoService } from '../../core/services/video.service';
import { SubscriptionService } from '../../core/services/subscription.service';
import { AuthService } from '../../core/services/auth.service';
import { TokenService } from '../../core/services/token.service';
import { environment } from '../../../environments/environment';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    FormsModule,
    SidebarComponent,
    TopbarComponent,
    BottomNavComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  sidebarOpen = false;
  activeSection = 'home';
  showEpg = false;

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

  sportsFilter = 'All';

  sportsContent = [
    {
      title: 'Cricket Gold',
      meta: 'Cricket • Live Now',
      rating: '8.9',
      gradient: 'linear-gradient(135deg,#f1c40f,#f39c12)',
      emoji: 'fa-cricket-bat-ball',
      live: true,
      sport: 'Cricket',
      streamUrl: 'https://streams2.sofast.tv/scheduler/scheduleMaster/418.m3u8',
    },
    {
      title: 'Champions League',
      meta: 'Football • Live Now',
      rating: '9.5',
      gradient: 'linear-gradient(135deg,#1a6b3a,#2ecc71)',
      emoji: 'fa-futbol',
      live: true,
      sport: 'Football',
      streamUrl: '',
    },
    {
      title: 'NBA Live',
      meta: 'Basketball • Live Now',
      rating: '9.2',
      gradient: 'linear-gradient(135deg,#c0392b,#e74c3c)',
      emoji: 'fa-basketball',
      live: true,
      sport: 'Basketball',
      streamUrl: '',
    },
    {
      title: 'Wimbledon',
      meta: 'Tennis • Live Now',
      rating: '8.8',
      gradient: 'linear-gradient(135deg,#27ae60,#2ecc71)',
      emoji: 'fa-baseball',
      live: true,
      sport: 'Tennis',
      streamUrl: '',
    },
    {
      title: 'IPL Cricket',
      meta: 'Cricket • Live Now',
      rating: '8.5',
      gradient: 'linear-gradient(135deg,#f39c12,#e67e22)',
      emoji: 'fa-cricket-bat-ball',
      live: true,
      sport: 'Cricket',
      streamUrl: '',
    },
    {
      title: 'Formula 1',
      meta: 'F1 • Live Now',
      rating: '9.0',
      gradient: 'linear-gradient(135deg,#c0392b,#922b21)',
      emoji: 'fa-flag-checkered',
      live: true,
      sport: 'Formula 1',
      streamUrl: '',
    },
    {
      title: 'Super Bowl',
      meta: 'Football • Starting Soon',
      rating: '9.3',
      gradient: 'linear-gradient(135deg,#2980b9,#3498db)',
      emoji: 'fa-football',
      live: false,
      sport: 'Football',
      streamUrl: '',
    },
    {
      title: 'French Open',
      meta: 'Tennis • Starting Soon',
      rating: '8.7',
      gradient: 'linear-gradient(135deg,#e74c3c,#c0392b)',
      emoji: 'fa-baseball',
      live: false,
      sport: 'Tennis',
      streamUrl: '',
    },
    {
      title: 'World Cup Qualifier',
      meta: 'Football • Tomorrow',
      rating: '9.1',
      gradient: 'linear-gradient(135deg,#8e44ad,#9b59b6)',
      emoji: 'fa-futbol',
      live: false,
      sport: 'Football',
      streamUrl: '',
    },
  ];

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

  recentSearches: string[] = [];
  trendingSearches = [
    'Action Movies',
    'Live News',
    'Comedy Shows',
    'Sports',
    'Documentaries',
    'Sci-Fi',
    'Horror',
    'Romance',
  ];

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

  seasons: any[] = [
    {
      season: 1,
      episodes: [
        {
          ep: 1,
          title: 'Pilot',
          duration: '52 min',
          desc: 'The story begins as our heroes discover a hidden world.',
          progress: 100,
        },
        {
          ep: 2,
          title: 'The Awakening',
          duration: '48 min',
          desc: 'Strange events unfold as the team investigates further.',
          progress: 60,
        },
        {
          ep: 3,
          title: 'Dark Waters',
          duration: '51 min',
          desc: 'A dangerous journey takes them to uncharted territory.',
          progress: 0,
        },
        {
          ep: 4,
          title: 'The Reckoning',
          duration: '49 min',
          desc: 'Old enemies return with a new plan.',
          progress: 0,
        },
        {
          ep: 5,
          title: 'Into the Storm',
          duration: '53 min',
          desc: 'The team faces their biggest challenge yet.',
          progress: 0,
        },
        {
          ep: 6,
          title: 'Broken Alliances',
          duration: '47 min',
          desc: 'Trust is tested when secrets are revealed.',
          progress: 0,
        },
        {
          ep: 7,
          title: 'The Final Stand',
          duration: '55 min',
          desc: 'Everything comes to a head in this explosive episode.',
          progress: 0,
        },
        {
          ep: 8,
          title: 'Season Finale',
          duration: '62 min',
          desc: 'The shocking conclusion to season one.',
          progress: 0,
        },
      ],
    },
    {
      season: 2,
      episodes: [
        {
          ep: 1,
          title: 'New Beginnings',
          duration: '50 min',
          desc: 'Six months later, the team reunites for a new mission.',
          progress: 0,
        },
        {
          ep: 2,
          title: 'The Resistance',
          duration: '48 min',
          desc: 'A new threat emerges from the shadows.',
          progress: 0,
        },
        {
          ep: 3,
          title: 'Uprising',
          duration: '52 min',
          desc: 'The resistance grows stronger.',
          progress: 0,
        },
        {
          ep: 4,
          title: 'Betrayal',
          duration: '49 min',
          desc: 'One of their own turns against them.',
          progress: 0,
        },
        {
          ep: 5,
          title: 'The Long Night',
          duration: '58 min',
          desc: 'A night that changes everything.',
          progress: 0,
        },
        {
          ep: 6,
          title: 'Season 2 Finale',
          duration: '65 min',
          desc: 'The epic conclusion to season two.',
          progress: 0,
        },
      ],
    },
    {
      season: 3,
      episodes: [
        {
          ep: 1,
          title: 'The Return',
          duration: '51 min',
          desc: 'After a year, the team is back together.',
          progress: 0,
        },
        {
          ep: 2,
          title: 'New Threat',
          duration: '47 min',
          desc: 'A new enemy more powerful than ever.',
          progress: 0,
        },
        {
          ep: 3,
          title: 'The Alliance',
          duration: '53 min',
          desc: 'Unlikely allies join the fight.',
          progress: 0,
        },
        {
          ep: 4,
          title: 'Season 3 Finale',
          duration: '70 min',
          desc: 'The ultimate showdown begins.',
          progress: 0,
        },
      ],
    },
  ];

  selectedSeason = 0;

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

  // Profile
  profile: any = null;
  profileName = '';
  profileLoading = false;
  profileSuccess = '';
  profileError = '';

  // Password
  currentPassword = '';
  newPassword = '';
  confirmNewPassword = '';
  passwordLoading = false;
  passwordSuccess = '';
  passwordError = '';

  // Subscription
  plans: any[] = [];
  mySubscription: any = null;
  subscriptionLoading = false;
  subscriptionSuccess = '';
  subscriptionError = '';
  cancelLoading = false;
  cancelSuccess = '';
  cancelError = '';
  showCancelConfirm = false;
  cancelReason = '';
  selectedPlanId = '';

  // Payment
  payments: any[] = [];
  selectedPaymentMethod = 'card';

  // Payment Methods
  paymentMethods: any[] = [];
  showAddCard = false;
  cardLoading = false;
  cardSuccess = '';
  cardError = '';
  newCard = {
    type: 'visa',
    last4: '',
    expiryMonth: '',
    expiryYear: '',
    holderName: '',
    isDefault: false,
  };

  // Mobile Wallets
  mobileWallets = [
    {
      id: 'paypal',
      name: 'PayPal',
      icon: 'fa-paypal',
      color: '#003087',
      connected: false,
    },
    {
      id: 'googlepay',
      name: 'Google Pay',
      icon: 'fa-google-pay',
      color: '#4285f4',
      connected: false,
    },
    {
      id: 'applepay',
      name: 'Apple Pay',
      icon: 'fa-apple-pay',
      color: '#000000',
      connected: false,
    },
  ];

  // Parental Controls
  parentalEnabled = false;
  parentalPin = '';
  parentalConfirmPin = '';
  parentalRating = 'PG-13';
  parentalLoading = false;
  parentalSuccess = '';
  parentalError = '';
  parentalRatings = ['G', 'PG', 'PG-13', 'R', 'NC-17'];

  // PIN prompt
  showPinPrompt = false;
  pinInput = ['', '', '', ''];
  pinError = '';
  pendingContent: any = null;
  showForgotPin = false;
  forgotPinEmail = '';
  forgotPinOtp = '';
  forgotPinNewPin = '';
  forgotPinStep = 1; // 1=email, 2=otp+pin
  forgotPinLoading = false;
  forgotPinError = '';
  forgotPinSuccess = '';

  // Help & Support
  faqOpen: any = {};
  supportName = '';
  supportEmail = '';
  supportMessage = '';
  supportLoading = false;
  supportSuccess = '';
  cacheSize = '120 MB';

  supportError = '';

  // Downloads
  downloadedItems: any[] = [];

  downloadsEditMode = false;
  selectedDownloads: string[] = [];

  faqs = [
    {
      q: 'How do I cancel my subscription?',
      a: 'Go to Profile → Subscription → Manage Subscription → Cancel Plan. Your access continues until the end of the billing period.',
    },
    {
      q: 'Can I watch on multiple devices?',
      a: 'Yes! Depending on your plan: Basic (1 device), Standard (2 devices), Premium (4 devices).',
    },
    {
      q: 'How do I download content for offline viewing?',
      a: 'Tap the download icon on any movie or show. Downloads are available on Standard and Premium plans.',
    },
    {
      q: 'Why is my video buffering?',
      a: 'Check your internet connection. We recommend at least 5 Mbps for HD and 25 Mbps for 4K streaming.',
    },
    {
      q: 'How do I reset my password?',
      a: 'Go to Login page → Forgot Password → Enter your email → Enter the OTP received → Set new password.',
    },
    {
      q: 'How do I set up Parental Controls?',
      a: 'Go to Parental Controls in the sidebar → Enable → Set age rating → Set a 4-digit PIN → Save.',
    },
    {
      q: 'What payment methods are accepted?',
      a: 'We accept Visa, Mastercard, Amex and PayPal. All transactions are secure and encrypted.',
    },
    {
      q: 'How do I report a problem?',
      a: 'Use the contact form below or email us at support@otttv.com. We respond within 24 hours.',
    },
  ];

  // Watch History
  watchHistory: any[] = [];

  // Favorites
  favorites: any[] = [];
  favoritesMap: any = {};
  myListTab = 'movies';

  // Notifications
  realNotifications: any[] = [];
  unreadCount = 0;

  // EPG
  epgDate = new Date();
  epgCurrentHour = new Date().getHours();
  epgHours = [
    '06:00',
    '07:00',
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00',
    '22:00',
    '23:00',
  ];
  epgChannels = [
    {
      name: 'CNN Live',
      icon: 'fa-tower-broadcast',
      color: 'linear-gradient(135deg,#d63031,#ff7675)',
      programs: [
        { title: 'Morning News', start: '06:00', end: '08:00', live: false },
        { title: 'World Report', start: '08:00', end: '10:00', live: false },
        { title: 'Breaking News', start: '10:00', end: '12:00', live: true },
        { title: 'Midday Update', start: '12:00', end: '14:00', live: false },
        {
          title: 'Afternoon Report',
          start: '14:00',
          end: '16:00',
          live: false,
        },
        { title: 'Evening News', start: '16:00', end: '18:00', live: false },
        { title: 'Prime Time News', start: '18:00', end: '20:00', live: false },
        { title: 'Night Report', start: '20:00', end: '22:00', live: false },
        { title: 'Late News', start: '22:00', end: '00:00', live: false },
      ],
    },
    {
      name: 'ESPN HD',
      icon: 'fa-basketball',
      color: 'linear-gradient(135deg,#0984e3,#74b9ff)',
      programs: [
        { title: 'SportCenter', start: '06:00', end: '08:00', live: false },
        { title: 'NFL Highlights', start: '08:00', end: '10:00', live: false },
        { title: 'NBA Preview', start: '10:00', end: '12:00', live: false },
        { title: 'Live: NBA Game', start: '12:00', end: '14:00', live: true },
        { title: 'Tennis Open', start: '14:00', end: '16:00', live: false },
        { title: 'Football Show', start: '16:00', end: '18:00', live: false },
        { title: 'Live: NFL Game', start: '18:00', end: '21:00', live: true },
        { title: 'SportCenter PM', start: '21:00', end: '23:00', live: false },
      ],
    },
    {
      name: 'Discovery HD',
      icon: 'fa-microscope',
      color: 'linear-gradient(135deg,#1abc9c,#16a085)',
      programs: [
        { title: 'Wild Planet', start: '06:00', end: '08:00', live: false },
        { title: 'Ocean Wonders', start: '08:00', end: '10:00', live: false },
        { title: 'Space Explorers', start: '10:00', end: '12:00', live: false },
        { title: 'MythBusters', start: '12:00', end: '14:00', live: false },
        { title: 'Shark Week', start: '14:00', end: '16:00', live: true },
        {
          title: 'Universe Secrets',
          start: '16:00',
          end: '18:00',
          live: false,
        },
        { title: 'Planet Earth', start: '18:00', end: '20:00', live: false },
        { title: 'Deep Ocean', start: '20:00', end: '22:00', live: false },
      ],
    },
    {
      name: 'Cinema Plus',
      icon: 'fa-clapperboard',
      color: 'linear-gradient(135deg,#3498db,#2980b9)',
      programs: [
        { title: 'Classic Movies', start: '06:00', end: '08:00', live: false },
        { title: 'Action Heroes', start: '08:00', end: '10:00', live: false },
        { title: 'The Dark Knight', start: '10:00', end: '12:30', live: false },
        { title: 'Inception', start: '12:30', end: '14:30', live: false },
        { title: 'Interstellar', start: '14:30', end: '17:00', live: false },
        { title: 'Avengers', start: '17:00', end: '19:30', live: false },
        {
          title: 'Prime: Blockbuster',
          start: '19:30',
          end: '22:00',
          live: true,
        },
        { title: 'Late Night Film', start: '22:00', end: '00:00', live: false },
      ],
    },
    {
      name: 'Music Box',
      icon: 'fa-music',
      color: 'linear-gradient(135deg,#9b59b6,#8e44ad)',
      programs: [
        { title: 'Morning Hits', start: '06:00', end: '09:00', live: false },
        { title: 'Top 40', start: '09:00', end: '12:00', live: false },
        { title: 'Live Concert', start: '12:00', end: '14:00', live: true },
        { title: 'Retro Classics', start: '14:00', end: '17:00', live: false },
        { title: 'Evening Hits', start: '17:00', end: '20:00', live: false },
        { title: 'Live: Music Fest', start: '20:00', end: '23:00', live: true },
      ],
    },
  ];

  // Notifications (mock)
  notifications = [
    {
      icon: 'fa-film',
      color: 'var(--accent-soft)',
      iconColor: 'var(--accent)',
      title: 'New Release: The Last Frontier',
      desc: 'A new blockbuster movie is now available.',
      time: '2 minutes ago',
      unread: true,
    },
    {
      icon: 'fa-crown',
      color: 'var(--success-soft)',
      iconColor: 'var(--success)',
      title: 'Subscription Renewed',
      desc: 'Your Premium plan has been renewed successfully.',
      time: '1 hour ago',
      unread: true,
    },
    {
      icon: 'fa-tower-broadcast',
      color: 'var(--accent2-soft)',
      iconColor: 'var(--accent2)',
      title: 'Live: Champions League Final',
      desc: 'The match is starting now! Tap to watch live.',
      time: '3 hours ago',
      unread: true,
    },
    {
      icon: 'fa-star',
      color: 'var(--gold-soft)',
      iconColor: 'var(--gold)',
      title: 'Rate Your Watch',
      desc: 'How was "Crimson Horizon"? Leave a rating.',
      time: 'Yesterday',
      unread: false,
    },
  ];

  constructor(
    private videoService: VideoService,
    private subscriptionService: SubscriptionService,
    public authService: AuthService,
    private tokenService: TokenService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.buildMockData();
    this.startHeroTimer();
    this.loadRealData();
    this.loadFavorites();
    this.loadContinueWatching();
    this.loadWatchHistory();
    this.loadNotifications();
    this.loadMySubscription();
    this.loadDownloads();
    this.loadParentalControls();
    // Add this line:
    const saved = localStorage.getItem('ott_recent_searches');
    this.recentSearches = saved ? JSON.parse(saved) : [];
  }

  buildMockData(): void {
    const ratings = ['G', 'PG', 'PG-13', 'R', 'NC-17'];

    const makeCard = (names: string[], offset = 0, type = 'movie') =>
      names.map((name, i) => ({
        title: name,
        meta: `${2020 + (i % 5)} • ${1 + (i % 3)}h ${30 * (i % 2)}min`,
        rating: (7 + (i % 3) * 0.5).toFixed(1),
        gradient: this.gradients[(i + offset) % this.gradients.length],
        emoji: this.emojis[(i + offset) % this.emojis.length],
        badge: i < 2 ? 'hd' : null,
        genre: this.movieFilters[1 + (i % (this.movieFilters.length - 1))],
        rating_class: ratings[i % ratings.length],
        type: type,
      }));

    const makeShowCard = (names: string[], offset = 0) =>
      names.map((name, i) => ({
        title: name,
        meta: `${2020 + (i % 5)} • ${(i % 3) + 1} Season${(i % 3) + 1 > 1 ? 's' : ''} • Drama`,
        rating: (7 + (i % 3) * 0.5).toFixed(1),
        gradient: this.gradients[(i + offset) % this.gradients.length],
        emoji: this.emojis[(i + offset) % this.emojis.length],
        badge: i < 2 ? 'hd' : null,
        genre: this.showFilters[1 + (i % (this.showFilters.length - 1))],
        rating_class: ratings[i % ratings.length],
        type: 'series',
      }));

    this.allMovies = makeCard(this.movieNames, 0, 'movie');
    this.filteredMovies = [...this.allMovies];
    this.allShows = makeShowCard(this.showNames, 4);
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
          const existingTitles = this.allMovies.map((m: any) => m.title);
          const newCards = cards.filter(
            (c: any) => !existingTitles.includes(c.title),
          );
          this.allMovies = [...this.allMovies, ...newCards];
          this.filteredMovies = [...this.allMovies];
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
            streamUrl: c.streamUrl,
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

  onSearch(saveToRecent = false): void {
    this.hasSearched = true;
    const q = this.searchQuery.toLowerCase().trim();

    // Only save to recent searches when explicitly searching
    if (saveToRecent && q && !this.recentSearches.includes(q)) {
      this.recentSearches.unshift(q);
      if (this.recentSearches.length > 5) this.recentSearches.pop();
      localStorage.setItem(
        'ott_recent_searches',
        JSON.stringify(this.recentSearches),
      );
    }

    if (!q) {
      this.searchResults = [...this.allMovies, ...this.allShows];
      return;
    }

    this.videoService.getVideos({ search: q, status: 'published' }).subscribe({
      next: (res) => {
        const apiResults = res.data?.videos?.length
          ? res.data.videos.map((v: any, i: number) => ({
              title: v.title,
              meta: `${v.releaseYear || '2024'} • ${v.type}`,
              rating: '8.0',
              gradient: this.gradients[i % this.gradients.length],
              emoji: this.emojis[i % this.emojis.length],
              badge: null,
              genre: v.genre?.[0] || 'Action',
              type: v.type,
              _id: v._id,
            }))
          : [];

        const localResults = [...this.allMovies, ...this.allShows].filter((i) =>
          i.title.toLowerCase().includes(q),
        );

        const merged = [...apiResults];
        localResults.forEach((l) => {
          if (!merged.find((m) => m.title === l.title)) merged.push(l);
        });

        this.searchResults = merged;
        this.cdr.detectChanges();
      },
      error: () => {
        this.searchResults = [...this.allMovies, ...this.allShows].filter((i) =>
          i.title.toLowerCase().includes(q),
        );
        this.cdr.detectChanges();
      },
    });
  }

  openDetail(item: any): void {
    this.selectedMovie = item;
    this.activeSection = 'detail';
    this.showEpg = false;
    this.addToWatchHistory(item);
    this.cdr.detectChanges();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.hasSearched = false;
    this.searchResults = [...this.allMovies, ...this.allShows];
  }

  clearRecentSearches(): void {
    this.recentSearches = [];
    localStorage.removeItem('ott_recent_searches');
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
    this.showEpg = section === 'epg';
    this.sidebarOpen = false;
    if (section === 'profile') this.loadProfile();
    if (section === 'subscription') {
      this.loadPlans();
      this.loadMySubscription();
    }
    if (section === 'payments') this.loadPayments();
    if (section === 'watch-history') this.loadWatchHistory();
    if (section === 'mylist') this.loadFavorites();
    if (section === 'notifications') this.loadNotifications();
    if (section === 'epg') this.epgCurrentHour = new Date().getHours();
    this.cdr.detectChanges();
    if (section === 'payment-methods') this.loadPaymentMethods();
    if (section === 'parental-controls') this.loadParentalControls();
    if (section === 'continue-watching') this.loadContinueWatching();
  }

  toggleSetting(event: Event): void {
    const el = event.target as HTMLElement;
    el.classList.toggle('on');
  }

  // ─── Profile ─────────────────────────────────────────────
  loadProfile(): void {
    this.subscriptionService.getProfile().subscribe({
      next: (res) => {
        this.profile = res.data.user;
        this.profileName = res.data.user.name;
      },
      error: () => {},
    });
  }

  saveProfile(): void {
    this.profileLoading = true;
    this.profileSuccess = '';
    this.profileError = '';
    this.subscriptionService
      .updateProfile({ name: this.profileName })
      .subscribe({
        next: () => {
          this.profileSuccess = 'Profile updated successfully';
          this.profileLoading = false;
        },
        error: (err) => {
          this.profileError = err.error?.message || 'Update failed';
          this.profileLoading = false;
        },
      });
  }

  changePassword(): void {
    if (this.newPassword !== this.confirmNewPassword) {
      this.passwordError = 'Passwords do not match';
      return;
    }
    this.passwordLoading = true;
    this.passwordError = '';
    this.passwordSuccess = '';
    this.subscriptionService
      .changePassword(this.currentPassword, this.newPassword)
      .subscribe({
        next: () => {
          this.passwordSuccess = 'Password changed successfully';
          this.passwordLoading = false;
          this.currentPassword = '';
          this.newPassword = '';
          this.confirmNewPassword = '';
        },
        error: (err) => {
          this.passwordError = err.error?.message || 'Failed';
          this.passwordLoading = false;
        },
      });
  }

  // ─── Subscription ────────────────────────────────────────
  loadPlans(): void {
    this.subscriptionService.getPlans().subscribe({
      next: (res) => {
        this.plans = res.data.plans;
      },
      error: () => {},
    });
  }

  loadMySubscription(): void {
    this.subscriptionService.getMySubscription().subscribe({
      next: (res) => {
        this.mySubscription = res.data.subscription;
      },
      error: () => {},
    });
  }

  subscribePlan(planId: string): void {
    this.subscriptionLoading = true;
    this.subscriptionError = '';
    this.subscriptionSuccess = '';
    this.subscriptionService.subscribe(planId).subscribe({
      next: () => {
        this.subscriptionSuccess = 'Subscribed successfully!';
        this.subscriptionLoading = false;
        this.loadMySubscription();
      },
      error: (err) => {
        this.subscriptionError = err.error?.message || 'Failed';
        this.subscriptionLoading = false;
      },
    });
  }

  // ─── Payments ────────────────────────────────────────────
  loadPayments(): void {
    this.subscriptionService.getMyPayments().subscribe({
      next: (res) => {
        this.payments = res.data.payments;
      },
      error: () => {},
    });
  }

  selectPaymentMethod(method: string): void {
    this.selectedPaymentMethod = method;
  }

  // ─── Watch History ───────────────────────────────────────
  loadWatchHistory(): void {
    const token = this.tokenService.getAccessToken();
    fetch(`${environment.apiUrl}/watch-history`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          this.watchHistory = res.data.history;
          this.cdr.detectChanges();
        }
      })
      .catch(() => {});
  }

  addToWatchHistory(item: any): void {
    const token = this.tokenService.getAccessToken();
    if (!token) return;
    const videoId = item._id || item.title.toLowerCase().replace(/\s+/g, '-');
    fetch(`${environment.apiUrl}/watch-history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        videoId,
        title: item.title,
        type: item.type || 'movie',
        gradient: item.gradient,
        emoji: item.emoji,
        meta: item.meta,
        progress: 0,
        duration: 0,
        percent: 0,
      }),
    }).catch(() => {});
  }

  clearWatchHistory(): void {
    const token = this.tokenService.getAccessToken();
    if (!token) return;
    fetch(`${environment.apiUrl}/watch-history/clear`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        this.watchHistory = [];
        this.cdr.detectChanges();
      })
      .catch(() => {});
  }

  loadContinueWatching(): void {
    const token = this.tokenService.getAccessToken();
    if (!token) return;
    fetch(`${environment.apiUrl}/watch-history?limit=10`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data.history.length) {
          this.continueCards = res.data.history
            .filter((h: any) => h.percent > 0 && h.percent < 90)
            .map((h: any) => ({
              title: h.title,
              meta: h.meta || h.type,
              gradient: h.gradient || this.gradients[0],
              emoji: h.emoji || 'fa-film',
              progress: h.percent,
              videoId: h.videoId,
            }));
          this.cdr.detectChanges();
        }
      })
      .catch(() => {});
  }

  // ─── Favorites ───────────────────────────────────────────
  loadFavorites(): void {
    const token = this.tokenService.getAccessToken();
    if (!token) return;
    fetch(`${environment.apiUrl}/favorites`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          this.favorites = res.data.favorites;
          this.favoritesMap = {};
          this.favorites.forEach(
            (f: any) => (this.favoritesMap[f.videoId] = true),
          );
          this.cdr.detectChanges();
        }
      })
      .catch(() => {});
  }

  get filteredFavorites(): any[] {
    if (this.myListTab === 'movies') {
      return this.favorites.filter((f: any) => f.type === 'movie' || !f.type);
    } else if (this.myListTab === 'tvshows') {
      return this.favorites.filter((f: any) => f.type === 'series');
    } else {
      return this.favorites.filter((f: any) => f.type === 'channel');
    }
  }

  isFavorite(item: any): boolean {
    return !!this.favoritesMap[item._id || item.title];
  }

  toggleFavorite(item: any): void {
    const token = this.tokenService.getAccessToken();
    const videoId = item._id || item.title;
    if (!token) return;

    if (this.isFavorite(item)) {
      fetch(`${environment.apiUrl}/favorites/${videoId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(() => {
          delete this.favoritesMap[videoId];
          this.favorites = this.favorites.filter(
            (f: any) => f.videoId !== videoId,
          );
          this.cdr.detectChanges();
        })
        .catch(() => {});
    } else {
      fetch(`${environment.apiUrl}/favorites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          videoId,
          title: item.title,
          type: item.type || 'movie',
          gradient: item.gradient,
          emoji: item.emoji,
          meta: item.meta,
          rating: item.rating,
        }),
      })
        .then((r) => r.json())
        .then(() => {
          this.favoritesMap[videoId] = true;
          this.favorites.push({ videoId, ...item });
          this.cdr.detectChanges();
        })
        .catch(() => {});
    }
  }

  // ─── Notifications ───────────────────────────────────────
  loadNotifications(): void {
    const token = this.tokenService.getAccessToken();
    if (!token) return;
    fetch(`${environment.apiUrl}/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          this.realNotifications = res.data.notifications;
          this.unreadCount = res.data.unreadCount;
          this.cdr.detectChanges();
        }
      })
      .catch(() => {});
  }

  markAllNotificationsRead(): void {
    const token = this.tokenService.getAccessToken();
    if (!token) return;
    fetch(`${environment.apiUrl}/notifications/read-all`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        this.unreadCount = 0;
        this.realNotifications.forEach((n: any) => (n.isRead = true));
        this.cdr.detectChanges();
      })
      .catch(() => {});
  }

  // ─── EPG ─────────────────────────────────────────────────
  isEpgActive(): boolean {
    return this.activeSection === 'epg';
  }

  isCurrentProgram(program: any): boolean {
    const now = new Date();
    const current = now.getHours() + now.getMinutes() / 60;
    const [startH, startM] = program.start.split(':').map(Number);
    const [endH, endM] = program.end.split(':').map(Number);
    return current >= startH + startM / 60 && current < endH + endM / 60;
  }

  getProgramWidth(program: any): number {
    const [startH, startM] = program.start.split(':').map(Number);
    const [endH, endM] = program.end.split(':').map(Number);
    return (endH + endM / 60 - (startH + startM / 60)) * 120;
  }

  // ─── Navigation ──────────────────────────────────────────
  playChannel(ch: any): void {
    if (!ch.streamUrl) {
      alert('No stream available');
      return;
    }
    this.router.navigate(['/player'], {
      queryParams: {
        title: ch.name,
        subtitle: (ch.cat || 'Live') + ' • LIVE',
        stream: ch.streamUrl,
        live: 'true',
      },
    });
  }

  playVideo(item: any): void {
    this.router.navigate(['/player'], {
      queryParams: { title: item.title, subtitle: item.meta || '' },
    });
  }

  // ─── Payment Methods ─────────────────────────────────────────
  loadPaymentMethods(): void {
    const token = this.tokenService.getAccessToken();
    if (!token) return;
    fetch(`${environment.apiUrl}/payment-methods`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          this.paymentMethods = res.data.methods;
          this.cdr.detectChanges();
        }
      })
      .catch(() => {});
  }

  addPaymentMethod(): void {
    if (
      !this.newCard.last4 ||
      !this.newCard.expiryMonth ||
      !this.newCard.expiryYear ||
      !this.newCard.holderName
    ) {
      this.cardError = 'Please fill all fields';
      return;
    }
    this.cardLoading = true;
    this.cardError = '';
    this.cardSuccess = '';
    const token = this.tokenService.getAccessToken();
    fetch(`${environment.apiUrl}/payment-methods`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(this.newCard),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          this.cardSuccess = 'Card added successfully';
          this.cardLoading = false;
          this.showAddCard = false;
          this.newCard = {
            type: 'visa',
            last4: '',
            expiryMonth: '',
            expiryYear: '',
            holderName: '',
            isDefault: false,
          };
          this.loadPaymentMethods();
          this.cdr.detectChanges();
        }
      })
      .catch(() => {
        this.cardLoading = false;
      });
  }

  deletePaymentMethod(id: string): void {
    const token = this.tokenService.getAccessToken();
    fetch(`${environment.apiUrl}/payment-methods/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        this.paymentMethods = this.paymentMethods.filter(
          (m: any) => m.id !== id,
        );
        this.cdr.detectChanges();
      })
      .catch(() => {});
  }

  setDefaultPaymentMethod(id: string): void {
    const token = this.tokenService.getAccessToken();
    fetch(`${environment.apiUrl}/payment-methods/${id}/default`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        this.loadPaymentMethods();
      })
      .catch(() => {});
  }

  getCardIcon(type: string): string {
    const icons: any = {
      visa: 'fa-cc-visa',
      mastercard: 'fa-cc-mastercard',
      amex: 'fa-cc-amex',
      paypal: 'fa-cc-paypal',
    };
    return icons[type] || 'fa-credit-card';
  }

  // ─── Parental Controls ───────────────────────────────────────
  saveParentalControls(): void {
    if (this.parentalEnabled) {
      if (!this.parentalPin) {
        this.parentalError = 'Please set a PIN';
        return;
      }
      if (this.parentalPin !== this.parentalConfirmPin) {
        this.parentalError = 'PINs do not match';
        return;
      }
      if (this.parentalPin.length !== 4) {
        this.parentalError = 'PIN must be 4 digits';
        return;
      }
    }

    this.parentalLoading = true;
    this.parentalError = '';
    this.parentalSuccess = '';

    // Store in localStorage for now
    localStorage.setItem('parental_enabled', this.parentalEnabled.toString());
    localStorage.setItem('parental_rating', this.parentalRating);
    if (this.parentalPin) {
      localStorage.setItem('parental_pin', this.parentalPin);
    }

    setTimeout(() => {
      this.parentalSuccess = 'Parental controls saved successfully';
      this.parentalLoading = false;
      this.cdr.detectChanges();
    }, 500);
  }

  loadParentalControls(): void {
    this.parentalEnabled = localStorage.getItem('parental_enabled') === 'true';
    this.parentalRating = localStorage.getItem('parental_rating') || 'PG-13';
  }

  // ─── PIN Prompt ──────────────────────────────────────────────
  isContentBlocked(item: any): boolean {
    if (!this.parentalEnabled) return false;
    const savedEnabled = localStorage.getItem('parental_enabled');
    if (savedEnabled !== 'true') return false;

    const ratings: any = { G: 0, PG: 1, 'PG-13': 2, R: 3, 'NC-17': 4 };
    const maxRating =
      ratings[localStorage.getItem('parental_rating') || 'PG-13'] ?? 2;
    const itemRating = ratings[item.rating_class || 'PG-13'] ?? 2;

    // Block content AT and ABOVE the set rating
    return itemRating >= maxRating;
  }
  openWithPinCheck(item: any): void {
    console.log('openWithPinCheck called', item.title);
    console.log('parentalEnabled:', this.parentalEnabled);
    console.log(
      'localStorage enabled:',
      localStorage.getItem('parental_enabled'),
    );
    console.log('isContentBlocked:', this.isContentBlocked(item));

    if (this.isContentBlocked(item)) {
      console.log('BLOCKING content - showing PIN prompt');
      this.pendingContent = item;
      this.showPinPrompt = true;
      this.pinInput = ['', '', '', ''];
      this.pinError = '';
      this.cdr.detectChanges();
    } else {
      console.log('NOT blocking - opening detail');
      this.openDetail(item);
    }
  }

  verifyPin(): void {
    const enteredPin = this.pinInput.join('');
    const savedPin = localStorage.getItem('parental_pin');

    if (enteredPin === savedPin) {
      this.showPinPrompt = false;
      this.pinError = '';
      if (this.pendingContent) {
        this.openDetail(this.pendingContent);
        this.pendingContent = null;
      }
    } else {
      this.pinError = 'Incorrect PIN. Try again.';
      this.pinInput = ['', '', '', ''];
      document.getElementById('pin0')?.focus();
    }
    this.cdr.detectChanges();
  }

  closePinPrompt(): void {
    this.showPinPrompt = false;
    this.pendingContent = null;
    this.pinInput = ['', '', '', ''];
    this.pinError = '';
  }

  onPinInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.value && index < 3) {
      document.getElementById('pin' + (index + 1))?.focus();
    }
    if (this.pinInput.every((d) => d !== '')) {
      this.verifyPin();
    }
  }

  onPinKeydown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace' && !this.pinInput[index] && index > 0) {
      document.getElementById('pin' + (index - 1))?.focus();
    }
  }

  // ─── Forgot PIN ──────────────────────────────────────────────
  sendPinResetOtp(): void {
    if (!this.forgotPinEmail) {
      this.forgotPinError = 'Enter your email';
      return;
    }
    this.forgotPinLoading = true;
    this.forgotPinError = '';

    fetch(`${environment.apiUrl}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: this.forgotPinEmail }),
    })
      .then((r) => r.json())
      .then(() => {
        this.forgotPinStep = 2;
        this.forgotPinLoading = false;
        this.cdr.detectChanges();
      })
      .catch(() => {
        this.forgotPinLoading = false;
      });
  }

  resetPin(): void {
    if (!this.forgotPinOtp) {
      this.forgotPinError = 'Enter OTP';
      return;
    }
    if (!this.forgotPinNewPin || this.forgotPinNewPin.length !== 4) {
      this.forgotPinError = 'PIN must be 4 digits';
      return;
    }
    this.forgotPinLoading = true;
    this.forgotPinError = '';

    fetch(`${environment.apiUrl}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: this.forgotPinEmail,
        otp: this.forgotPinOtp,
        newPassword: 'dummy_not_used_for_pin_reset',
      }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          localStorage.setItem('parental_pin', this.forgotPinNewPin);
          this.forgotPinSuccess = 'PIN reset successfully!';
          this.forgotPinLoading = false;
          this.showForgotPin = false;
          this.forgotPinStep = 1;
          this.forgotPinEmail = '';
          this.forgotPinOtp = '';
          this.forgotPinNewPin = '';
          this.cdr.detectChanges();
        } else {
          this.forgotPinError = 'Invalid OTP';
          this.forgotPinLoading = false;
        }
      })
      .catch(() => {
        this.forgotPinLoading = false;
      });
  }

  // ─── Help & Support ──────────────────────────────────────────
  toggleFaq(index: number): void {
    this.faqOpen[index] = !this.faqOpen[index];
  }

  submitSupport(): void {
    if (!this.supportName || !this.supportEmail || !this.supportMessage) {
      this.supportError = 'Please fill all fields';
      return;
    }
    this.supportLoading = true;
    this.supportError = '';
    this.supportSuccess = '';

    // Simulate sending
    setTimeout(() => {
      this.supportSuccess =
        'Your message has been sent! We will respond within 24 hours.';
      this.supportLoading = false;
      this.supportName = '';
      this.supportEmail = '';
      this.supportMessage = '';
      this.cdr.detectChanges();
    }, 1000);
  }

  cancelSubscription(): void {
    this.cancelLoading = true;
    this.cancelError = '';
    this.cancelSuccess = '';
    this.subscriptionService.cancel(this.cancelReason).subscribe({
      next: () => {
        this.cancelSuccess = 'Subscription cancelled successfully';
        this.cancelLoading = false;
        this.showCancelConfirm = false;
        this.mySubscription = null;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.cancelError = err.error?.message || 'Failed to cancel';
        this.cancelLoading = false;
      },
    });
  }

  // ─── Settings ────────────────────────────────────────────────
  clearCache(): void {
    // Clear localStorage except auth tokens
    const token = localStorage.getItem('ott_access_token');
    const refreshToken = localStorage.getItem('ott_refresh_token');
    const user = localStorage.getItem('ott_user');
    const parentalPin = localStorage.getItem('parental_pin');
    const parentalEnabled = localStorage.getItem('parental_enabled');
    const parentalRating = localStorage.getItem('parental_rating');

    localStorage.clear();

    // Restore important items
    if (token) localStorage.setItem('ott_access_token', token);
    if (refreshToken) localStorage.setItem('ott_refresh_token', refreshToken);
    if (user) localStorage.setItem('ott_user', user);
    if (parentalPin) localStorage.setItem('parental_pin', parentalPin);
    if (parentalEnabled)
      localStorage.setItem('parental_enabled', parentalEnabled);
    if (parentalRating) localStorage.setItem('parental_rating', parentalRating);

    this.cacheSize = '0 MB';
    this.cdr.detectChanges();

    // Show success briefly
    alert('Cache cleared successfully!');
  }

  // ─── Downloads ───────────────────────────────────────────────
  loadDownloads(): void {
    const saved = localStorage.getItem('ott_downloads');
    this.downloadedItems = saved ? JSON.parse(saved) : [];
  }

  isDownloaded(item: any): boolean {
    return this.downloadedItems.some((d: any) => d.title === item.title);
  }

  downloadContent(item: any): void {
    if (this.isDownloaded(item)) return;

    const download = {
      title: item.title,
      meta: item.meta,
      gradient: item.gradient,
      emoji: item.emoji,
      progress: 100,
      size: `${(Math.random() * 2 + 0.5).toFixed(1)} GB`,
      downloadedAt: new Date().toISOString(),
    };

    this.downloadedItems.push(download);
    localStorage.setItem('ott_downloads', JSON.stringify(this.downloadedItems));
    this.cdr.detectChanges();

    // Show feedback
    const btn = document.activeElement as HTMLElement;
    if (btn) btn.blur();
  }

  removeDownload(index: number): void {
    this.downloadedItems.splice(index, 1);
    localStorage.setItem('ott_downloads', JSON.stringify(this.downloadedItems));
    this.cdr.detectChanges();
  }

  clearDownloads(): void {
    this.downloadedItems = [];
    localStorage.setItem('ott_downloads', '[]');
    this.cdr.detectChanges();
  }

  playSports(item: any): void {
    if (!item.live) {
      alert(`${item.title} is not live yet. ${item.meta}`);
      return;
    }
    if (item.streamUrl) {
      this.router.navigate(['/player'], {
        queryParams: {
          title: item.title,
          subtitle: item.meta,
          stream: item.streamUrl,
          live: 'true',
        },
      });
    } else {
      alert('Stream not available. Check back when the event starts!');
    }
  }

  toggleDownloadSelect(title: string): void {
    const idx = this.selectedDownloads.indexOf(title);
    if (idx > -1) {
      this.selectedDownloads.splice(idx, 1);
    } else {
      this.selectedDownloads.push(title);
    }
  }

  deleteSelectedDownloads(): void {
    this.downloadedItems = this.downloadedItems.filter(
      (d: any) => !this.selectedDownloads.includes(d.title),
    );
    localStorage.setItem('ott_downloads', JSON.stringify(this.downloadedItems));
    this.selectedDownloads = [];
    this.downloadsEditMode = false;
    this.cdr.detectChanges();
  }

  toggleWallet(wallet: any): void {
    wallet.connected = !wallet.connected;
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    clearInterval(this.heroTimer);
  }
}
