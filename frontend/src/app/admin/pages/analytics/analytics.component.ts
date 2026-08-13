import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <h2 style="margin-bottom:24px">Analytics</h2>
      <div class="stats-grid">
        <div class="stat-card" *ngFor="let s of stats">
          <div
            class="stat-icon"
            [style.background]="s.bg"
            [style.color]="s.color"
          >
            <i class="fa-solid" [class]="'fa-solid ' + s.icon"></i>
          </div>
          <h4>{{ s.label }}</h4>
          <div class="stat-number">{{ s.value }}</div>
          <div class="stat-change up">
            <i class="fa-solid fa-arrow-up"></i> {{ s.change }}
          </div>
        </div>
      </div>
      <div class="analytics-cards">
        <div class="dash-card">
          <div class="dash-card-header"><h3>Top Content This Week</h3></div>
          <table class="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Views</th>
                <th>Watch Time</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let c of topContent">
                <td style="color:var(--text-muted)">{{ c.rank }}</td>
                <td>{{ c.title }}</td>
                <td>{{ c.views }}</td>
                <td style="color:var(--text-dim)">{{ c.watchTime }}</td>
                <td [style.color]="c.up ? 'var(--success)' : 'var(--live)'">
                  {{ c.trend }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="dash-card">
          <div class="dash-card-header"><h3>User Demographics</h3></div>
          <div style="padding:24px">
            <div *ngFor="let d of demographics" style="margin-bottom:16px">
              <div
                style="display:flex;justify-content:space-between;margin-bottom:6px"
              >
                <span style="font-size:14px">{{ d.label }}</span>
                <span style="font-size:14px;color:var(--text-dim)"
                  >{{ d.value }}%</span
                >
              </div>
              <div
                style="height:6px;background:var(--surface);border-radius:3px;overflow:hidden"
              >
                <div
                  [style.width.%]="d.value"
                  [style.background]="d.color"
                  style="height:100%;border-radius:3px"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 20px;
        margin-bottom: 28px;
      }
      .stat-card {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        padding: 24px;
      }
      .stat-icon {
        width: 48px;
        height: 48px;
        border-radius: var(--radius-sm);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        margin-bottom: 16px;
      }
      h4 {
        font-size: 13px;
        color: var(--text-dim);
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .stat-number {
        font-size: 32px;
        font-weight: 800;
        margin: 4px 0;
      }
      .stat-change {
        font-size: 13px;
        display: flex;
        align-items: center;
        gap: 4px;
      }
      .up {
        color: var(--success);
      }
      .analytics-cards {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
      }
      .dash-card {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        overflow: hidden;
      }
      .dash-card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 24px;
        border-bottom: 1px solid var(--border);
      }
      .dash-card-header h3 {
        font-size: 16px;
        font-weight: 700;
      }
      @media (max-width: 900px) {
        .analytics-cards {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class AnalyticsComponent {
  stats = [
    {
      label: 'Total Views',
      value: '1.2M',
      change: '+18% this week',
      icon: 'fa-eye',
      bg: 'var(--accent-soft)',
      color: 'var(--accent)',
    },
    {
      label: 'Watch Time',
      value: '48.2K h',
      change: '+12% this week',
      icon: 'fa-clock',
      bg: 'var(--success-soft)',
      color: 'var(--success)',
    },
    {
      label: 'New Users',
      value: '2,350',
      change: '+9% this week',
      icon: 'fa-user-plus',
      bg: 'var(--accent2-soft)',
      color: 'var(--accent2)',
    },
    {
      label: 'Revenue',
      value: '$23.4K',
      change: '+6% this week',
      icon: 'fa-dollar-sign',
      bg: 'var(--gold-soft)',
      color: 'var(--gold)',
    },
  ];

  topContent = [
    {
      rank: 1,
      title: 'Crimson Horizon',
      views: '124,521',
      watchTime: '42,100h',
      trend: '+15%',
      up: true,
    },
    {
      rank: 2,
      title: 'Deep Blue Planet S3',
      views: '98,340',
      watchTime: '38,200h',
      trend: '+8%',
      up: true,
    },
    {
      rank: 3,
      title: 'The Last Kingdom',
      views: '87,210',
      watchTime: '31,500h',
      trend: '+3%',
      up: true,
    },
    {
      rank: 4,
      title: 'Neon Nights',
      views: '76,890',
      watchTime: '28,100h',
      trend: '-2%',
      up: false,
    },
    {
      rank: 5,
      title: 'Space Explorers',
      views: '65,440',
      watchTime: '24,800h',
      trend: '+22%',
      up: true,
    },
  ];

  demographics = [
    { label: '18-24 years', value: 32, color: 'var(--accent)' },
    { label: '25-34 years', value: 28, color: 'var(--accent2)' },
    { label: '35-44 years', value: 21, color: 'var(--success)' },
    { label: '45-54 years', value: 12, color: 'var(--gold)' },
    { label: '55+ years', value: 7, color: 'var(--text-dim)' },
  ];
}
