import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VideoService {
  private readonly API = 'http://localhost/api/v1';

  constructor(private http: HttpClient) {}

  getVideos(params?: any): Observable<any> {
    let p = new HttpParams();
    if (params) Object.keys(params).forEach((k) => (p = p.set(k, params[k])));
    return this.http.get(`${this.API}/videos`, { params: p });
  }

  getTrending(limit = 10): Observable<any> {
    return this.http.get(`${this.API}/videos/trending?limit=${limit}`);
  }

  getVideoById(id: string): Observable<any> {
    return this.http.get(`${this.API}/videos/${id}`);
  }

  getChannels(params?: any): Observable<any> {
    let p = new HttpParams();
    if (params) Object.keys(params).forEach((k) => (p = p.set(k, params[k])));
    return this.http.get(`${this.API}/channels`, { params: p });
  }

  getCategories(): Observable<any> {
    return this.http.get(`${this.API}/categories`);
  }

  getPlans(): Observable<any> {
    return this.http.get(`${this.API}/subscriptions/plans`);
  }

  getMySubscription(): Observable<any> {
    return this.http.get(`${this.API}/subscriptions/my`);
  }

  subscribe(planId: string): Observable<any> {
    return this.http.post(`${this.API}/subscriptions/subscribe`, { planId });
  }
}
