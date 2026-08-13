import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  private readonly API = 'http://localhost/api/v1';

  constructor(private http: HttpClient) {}

  getPlans(): Observable<any> {
    return this.http.get(`${this.API}/subscriptions/plans`);
  }

  getMySubscription(): Observable<any> {
    return this.http.get(`${this.API}/subscriptions/my`);
  }

  subscribe(planId: string): Observable<any> {
    return this.http.post(`${this.API}/subscriptions/subscribe`, { planId });
  }

  cancel(reason: string): Observable<any> {
    return this.http.post(`${this.API}/subscriptions/cancel`, { reason });
  }

  getMyPayments(): Observable<any> {
    return this.http.get(`${this.API}/payments/my`);
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.API}/users/profile`);
  }

  updateProfile(data: any): Observable<any> {
    return this.http.put(`${this.API}/users/profile`, data);
  }

  changePassword(
    currentPassword: string,
    newPassword: string,
  ): Observable<any> {
    return this.http.put(`${this.API}/users/change-password`, {
      currentPassword,
      newPassword,
    });
  }
}
