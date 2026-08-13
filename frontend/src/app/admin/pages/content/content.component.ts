import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
})
export class ContentComponent implements OnInit {
  private API = 'http://localhost/api/v1';
  videos: any[] = [];
  channels: any[] = [];
  activeTab = 'videos';
  loading = true;

  newVideo = {
    title: '',
    type: 'movie',
    status: 'draft',
    description: '',
    releaseYear: new Date().getFullYear(),
    isFree: false,
    isPremium: true,
  };
  showAddForm = false;
  saving = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadVideos();
    this.loadChannels();
  }

  loadVideos(): void {
    this.http.get<any>(`${this.API}/videos?limit=20`).subscribe({
      next: (res) => {
        this.videos = res.data.videos;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  loadChannels(): void {
    this.http.get<any>(`${this.API}/channels`).subscribe({
      next: (res) => {
        this.channels = res.data.channels;
      },
      error: () => {},
    });
  }

  saveVideo(): void {
    this.saving = true;
    this.http.post(`${this.API}/videos`, this.newVideo).subscribe({
      next: () => {
        this.loadVideos();
        this.showAddForm = false;
        this.saving = false;
      },
      error: () => {
        this.saving = false;
      },
    });
  }

  deleteVideo(id: string): void {
    if (!confirm('Delete this video?')) return;
    this.http.delete(`${this.API}/videos/${id}`).subscribe({
      next: () => this.loadVideos(),
      error: () => {},
    });
  }
}
