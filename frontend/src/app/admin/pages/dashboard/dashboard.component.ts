import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  private API = 'http://localhost/api/v1';

  stats = [
    {
      label: 'Total Users',
      value: '—',
      change: '+12.5%',
      up: true,
      icon: 'fa-users',
      color: 'var(--accent-soft)',
      iconColor: 'var(--accent)',
    },
    {
      label: 'Revenue',
      value: '—',
      change: '+8.3%',
      up: true,
      icon: 'fa-dollar-sign',
      color: 'var(--success-soft)',
      iconColor: 'var(--success)',
    },
    {
      label: 'Active Streams',
      value: '—',
      change: '+5.1%',
      up: true,
      icon: 'fa-tower-broadcast',
      color: 'var(--accent2-soft)',
      iconColor: 'var(--accent2)',
    },
    {
      label: 'Subscriptions',
      value: '—',
      change: '-2.1%',
      up: false,
      icon: 'fa-crown',
      color: 'var(--gold-soft)',
      iconColor: 'var(--gold)',
    },
  ];

  recentActivity = [
    {
      user: 'Alice Chen',
      action: 'Subscribed',
      detail: 'Premium Plan',
      time: '2 min ago',
      avatar: 'AC',
      color: 'linear-gradient(135deg,#ff6b6b,#ee5a24)',
    },
    {
      user: 'Bob Wilson',
      action: 'Watched',
      detail: 'Crimson Horizon',
      time: '15 min ago',
      avatar: 'BW',
      color: 'linear-gradient(135deg,#54a0ff,#2e86de)',
    },
    {
      user: 'Carol Davis',
      action: 'Downloaded',
      detail: 'Space Explorers',
      time: '32 min ago',
      avatar: 'CD',
      color: 'linear-gradient(135deg,#5f27cd,#341f97)',
    },
    {
      user: 'Dave Martinez',
      action: 'Registered',
      detail: 'New user',
      time: '1 hour ago',
      avatar: 'DM',
      color: 'linear-gradient(135deg,#ff9ff3,#f368e0)',
    },
    {
      user: 'Eve Laurent',
      action: 'Cancelled',
      detail: 'Basic Plan',
      time: '2 hours ago',
      avatar: 'EL',
      color: 'linear-gradient(135deg,#ffa502,#e67e22)',
    },
  ];

  topContent = [
    {
      rank: 1,
      title: 'Crimson Horizon',
      views: '124,521',
      trend: '+15%',
      up: true,
    },
    {
      rank: 2,
      title: 'Deep Blue Planet S3',
      views: '98,340',
      trend: '+8%',
      up: true,
    },
    {
      rank: 3,
      title: 'The Last Kingdom',
      views: '87,210',
      trend: '+3%',
      up: true,
    },
    { rank: 4, title: 'Neon Nights', views: '76,890', trend: '-2%', up: false },
    {
      rank: 5,
      title: 'Space Explorers',
      views: '65,440',
      trend: '+22%',
      up: true,
    },
  ];

  userChartPoints = [
    { x: 0, y: 120 },
    { x: 55, y: 100 },
    { x: 110, y: 80 },
    { x: 165, y: 90 },
    { x: 220, y: 60 },
    { x: 275, y: 40 },
    { x: 330, y: 50 },
    { x: 400, y: 20 },
  ];

  chartLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  userChartStats = [
    { label: 'New Users', value: '2,350', color: '#ff2d55' },
    { label: 'Active', value: '18.2K', color: '#30d158' },
    { label: 'Churned', value: '142', color: '#ff9f0a' },
  ];

  contentPieData = [
    { label: 'Movies', percent: 33, color: '#ff2d55' },
    { label: 'TV Shows', percent: 27, color: '#5856d6' },
    { label: 'Live TV', percent: 20, color: '#30d158' },
    { label: 'Sports', percent: 20, color: '#ffd60a' },
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.http.get<any>(`${this.API}/users`).subscribe({
      next: (res) => {
        this.stats[0].value = res.data.pagination.total.toLocaleString();
      },
      error: () => {
        this.stats[0].value = '24,581';
      },
    });

    this.http.get<any>(`${this.API}/subscriptions`).subscribe({
      next: (res) => {
        this.stats[3].value = res.data.pagination.total.toLocaleString();
      },
      error: () => {
        this.stats[3].value = '18,942';
      },
    });

    // Mock values for revenue and streams
    this.stats[1].value = '$148.2K';
    this.stats[2].value = '3,247';
  }
}
