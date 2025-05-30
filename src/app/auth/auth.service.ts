import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment.development';
import { JwtHelperService } from '@auth0/angular-jwt';

interface AuthResponse {
  jwtToken: string;
  refreshToken: string;
  jwtTokenExpires: string;
  refreshTokenExpires: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private apiBaseUrl = environment.baseUrl;
  private jwtHelper = inject(JwtHelperService);

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private loadingSubject = new BehaviorSubject<boolean>(true);

  public userId$: Observable<number | null>;
  private userIdSubject = new BehaviorSubject<number | null>(null);

  private loginSuccessSubject = new BehaviorSubject<void>(undefined);
  loginSuccess$ = this.loginSuccessSubject.asObservable();


  loading$ = this.loadingSubject.asObservable();
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    this.userId$ = this.userIdSubject.asObservable();

    if (this.isBrowser()) {
      this.isAuthenticatedSubject.next(false);
      this.checkAuthStatus();
    } else {
      this.loadingSubject.next(false);
    }
  }

  get isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  private updateUserId(): void {
    const token = this.getJwtToken();
    if (!token) {
      this.userIdSubject.next(null);
      return;
    }

    try {
      const decoded = this.jwtHelper.decodeToken(token);
      const userId = decoded?.nameid ? parseInt(decoded.nameid) : null;
      this.userIdSubject.next(userId);
    } catch (e) {
      console.error('Error decoding token:', e);
      this.userIdSubject.next(null);
    }
  }

  getUserId(): number | null {
    const token = this.getJwtToken();
    if (!token) return null;

    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      const userId = decodedToken.nameid;

      return userId ? parseInt(userId) : null;
    } catch (e) {
      console.error('Error decoding token', e);
      return null;
    }
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  checkAuthStatus() {
    if (!this.isBrowser()) return;

    this.updateUserId();

    const token = this.getJwtToken();
    const isAuth = !!token;

    if (this.isAuthenticatedSubject.value !== isAuth) {
      this.isAuthenticatedSubject.next(isAuth);
    }
    this.loadingSubject.next(false);
  }

  login(authId: string, password: string, roleId: number) {
    return this.http.post<AuthResponse>(
      `${this.apiBaseUrl}/Auth/token`,
      { authId, password, roleId }
    ).pipe(
      tap(response => {
        this.storeTokens(response);
        this.isAuthenticatedSubject.next(true);
        this.updateUserId();
        this.loginSuccessSubject.next();
      })
    );
  }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('refreshToken');
    }
    this.isAuthenticatedSubject.next(false);
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.isBrowser() ? localStorage.getItem('refreshToken') : null;
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }
    this.updateUserId();
    return this.http.post<AuthResponse>(`${this.apiBaseUrl}/Auth/refresh-token`, { refreshToken }).pipe(
      tap(response => this.storeTokens(response))
    );
  }

  getJwtToken(): string | null {
    return this.isBrowser() ? localStorage.getItem('jwtToken') : null;
  }

  private storeTokens(response: AuthResponse) {
    if (this.isBrowser()) {
      localStorage.setItem('jwtToken', response.jwtToken);
      localStorage.setItem('refreshToken', response.refreshToken);
    }
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.put(`${this.apiBaseUrl}/User/forget-password`, null, {
      params: { email }
    });
  }

  resetPassword(password: string, token: string): Observable<any> {
    return this.http.put(
      `${this.apiBaseUrl}/User/reset-password`,
      `"${password}"`,
      {
        params: { token },
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*'
        }
      }
    );
  }
}