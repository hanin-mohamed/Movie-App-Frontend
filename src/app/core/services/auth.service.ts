import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthResponse, LoginRequest } from '../models/auth.models';
import { TokenStorage } from './token-storage.service';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = environment.apiBaseUrl;

  private refreshing = false;
  private refresh$ = new Subject<string>();

  constructor(private http: HttpClient, private store: TokenStorage) {}

  login(body: LoginRequest) {
    return this.http
      .post<{ data: AuthResponse }>(`${this.base}/auth/login`, body)
      .pipe(
        map(r => r.data),
        tap(res => this.store.setTokens(res.accessToken, res.refreshToken))
      );
  }

  logout() {
    return this.http.post(`${this.base}/auth/logout`, {}).pipe(
      tap(() => this.store.clear()),
      catchError(err => { this.store.clear(); return throwError(() => err); })
    );
  }

  role() { return this.store.role; }
  isLoggedIn() { return this.store.isLoggedIn(); }

  refreshToken(): Observable<string> {
    if (this.refreshing) return this.refresh$.asObservable();

    const refresh = this.store.refresh;
    if (!refresh) return throwError(() => new Error('No refresh token'));

    this.refreshing = true;
    return this.http
      .post<{ data: AuthResponse }>(`${this.base}/auth/refresh`, { refreshToken: refresh })
      .pipe(
        map(r => r.data),
        tap(res => this.store.setTokens(res.accessToken, res.refreshToken)),
        map(res => res.accessToken),
        tap(token => { this.refreshing = false; this.refresh$.next(token); }),
        catchError(err => { this.refreshing = false; this.store.clear(); return throwError(() => err); })
      );
  }
}
