import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpEventType } from '@angular/common/http';

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
  showAddForm = false;
  uploadMode = 'url'; // 'url' or 'file'
  saving = false;

  // Upload progress
  uploadProgress = 0;
  uploading = false;
  uploadSuccess = '';
  uploadError = '';
  selectedFile: File | null = null;

  newVideo = {
    title: '',
    type: 'movie',
    status: 'draft',
    description: '',
    releaseYear: new Date().getFullYear(),
    isFree: false,
    isPremium: true,
    streamUrl: '',
    genre: '',
    categories: '',
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadVideos();
    this.loadChannels();
  }

  loadVideos(): void {
    this.loading = true;
    this.http.get<any>(`${this.API}/videos?limit=50`).subscribe({
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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
      if (!this.newVideo.title) {
        this.newVideo.title = this.selectedFile.name.replace(/\.[^/.]+$/, '');
      }
    }
  }

  uploadFile(): void {
    if (!this.selectedFile) {
      this.uploadError = 'Please select a file';
      return;
    }
    if (!this.newVideo.title) {
      this.uploadError = 'Please enter a title';
      return;
    }

    this.uploading = true;
    this.uploadError = '';
    this.uploadSuccess = '';
    this.uploadProgress = 0;

    const formData = new FormData();
    formData.append('video', this.selectedFile);
    formData.append('title', this.newVideo.title);
    formData.append('type', this.newVideo.type);
    formData.append('description', this.newVideo.description);
    formData.append('releaseYear', this.newVideo.releaseYear.toString());
    formData.append('isFree', this.newVideo.isFree.toString());
    if (this.newVideo.genre) formData.append('genre', this.newVideo.genre);

    this.http
      .post(`${this.API}/videos/upload`, formData, {
        reportProgress: true,
        observe: 'events',
      })
      .subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress && event.total) {
            this.uploadProgress = Math.round(
              (100 * event.loaded) / event.total,
            );
          } else if (event.type === HttpEventType.Response) {
            this.uploadSuccess = `"${this.newVideo.title}" uploaded successfully!`;
            this.uploading = false;
            this.uploadProgress = 100;
            this.selectedFile = null;
            this.newVideo.title = '';
            this.loadVideos();
            setTimeout(() => {
              this.uploadSuccess = '';
              this.showAddForm = false;
            }, 3000);
          }
        },
        error: (err) => {
          this.uploadError = err.error?.message || 'Upload failed';
          this.uploading = false;
        },
      });
  }

  saveVideo(): void {
    this.saving = true;
    const payload = {
      ...this.newVideo,
      genre: this.newVideo.genre ? [this.newVideo.genre] : [],
      categories: this.newVideo.categories ? [this.newVideo.categories] : [],
    };
    this.http.post(`${this.API}/videos`, payload).subscribe({
      next: () => {
        this.loadVideos();
        this.showAddForm = false;
        this.saving = false;
        this.newVideo = {
          title: '',
          type: 'movie',
          status: 'draft',
          description: '',
          releaseYear: new Date().getFullYear(),
          isFree: false,
          isPremium: true,
          streamUrl: '',
          genre: '',
          categories: '',
        };
      },
      error: (err) => {
        this.uploadError = err.error?.message || 'Failed to save';
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

  getFileSize(bytes: number): string {
    if (!bytes) return '—';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}
