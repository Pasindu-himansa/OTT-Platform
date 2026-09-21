import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-live-tv',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './live-tv.component.html',
  styleUrls: ['./live-tv.component.scss'],
})
export class LiveTvComponent implements OnInit {
  channels: any[] = [];
  loading = true;
  showAddForm = false;
  saving = false;
  error = '';
  success = '';

  newChannel = {
    name: '',
    description: '',
    streamUrl: '',
    category: 'News',
    language: 'en',
    country: 'US',
    isActive: true,
    isFree: true,
    isPremium: false,
    sortOrder: 0,
  };

  categories = [
    'News',
    'Sports',
    'Entertainment',
    'Music',
    'Kids',
    'Documentary',
    'Movies',
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadChannels();
  }

  loadChannels(): void {
    this.loading = true;
    this.http.get<any>(`${environment.apiUrl}/channels?limit=50`).subscribe({
      next: (res) => {
        this.channels = res.data.channels;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  saveChannel(): void {
    if (!this.newChannel.name || !this.newChannel.streamUrl) {
      this.error = 'Name and Stream URL are required';
      return;
    }
    this.saving = true;
    this.error = '';
    this.http
      .post(`${environment.apiUrl}/channels`, this.newChannel)
      .subscribe({
        next: () => {
          this.success = 'Channel added successfully!';
          this.saving = false;
          this.showAddForm = false;
          this.newChannel = {
            name: '',
            description: '',
            streamUrl: '',
            category: 'News',
            language: 'en',
            country: 'US',
            isActive: true,
            isFree: true,
            isPremium: false,
            sortOrder: 0,
          };
          this.loadChannels();
          setTimeout(() => (this.success = ''), 3000);
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to add channel';
          this.saving = false;
        },
      });
  }

  toggleChannel(ch: any): void {
    this.http
      .put(`${environment.apiUrl}/channels/${ch._id}`, {
        isActive: !ch.isActive,
      })
      .subscribe({
        next: () => {
          ch.isActive = !ch.isActive;
        },
        error: () => {},
      });
  }

  deleteChannel(id: string): void {
    if (!confirm('Delete this channel?')) return;
    this.http.delete(`${environment.apiUrl}/channels/${id}`).subscribe({
      next: () => this.loadChannels(),
      error: () => {},
    });
  }
}
