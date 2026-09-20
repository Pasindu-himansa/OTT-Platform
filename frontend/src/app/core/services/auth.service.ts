import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { TokenService } from './token.service';
import { User, AuthResponse } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router,
  ) {
    const user = this.tokenService.getUser();
    if (user) this.currentUserSubject.next(user);
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return this.tokenService.isLoggedIn();
  }

  get isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  register(
    name: string,
    email: string,
    password: string,
  ): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.API}/register`, { name, email, password })
      .pipe(tap((res) => this.handleAuth(res)));
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.API}/login`, { email, password })
      .pipe(tap((res) => this.handleAuth(res)));
  }

  logout(): void {
    const refreshToken = this.tokenService.getRefreshToken();
    this.http.post(`${this.API}/logout`, { refreshToken }).subscribe();
    this.tokenService.clear();
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.tokenService.getRefreshToken();
    return this.http.post<any>(`${this.API}/refresh`, { refreshToken }).pipe(
      tap((res) => {
        if (res.success) {
          this.tokenService.setTokens(
            res.data.accessToken,
            res.data.refreshToken,
          );
        }
      }),
    );
  }

  private handleAuth(res: AuthResponse): void {
    if (res.success) {
      this.tokenService.setTokens(res.data.accessToken, res.data.refreshToken);
      this.tokenService.setUser(res.data.user);
      this.currentUserSubject.next(res.data.user);
    }
  }
}
