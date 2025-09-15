import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
const ACCESS = 'access_token';
const REFRESH = 'refresh_token';
const ROLE = 'role';

@Injectable({ providedIn: 'root' })
export class TokenStorage {
  setTokens(access: string, refresh: string) {
    localStorage.setItem(ACCESS, access);
    localStorage.setItem(REFRESH, refresh);
    try {
      const decoded: any = jwtDecode(access);
      localStorage.setItem(ROLE, decoded?.role ?? 'USER');
    } catch {
      localStorage.setItem(ROLE, 'USER');
    }
  }
  clear() {
    localStorage.removeItem(ACCESS);
    localStorage.removeItem(REFRESH);
    localStorage.removeItem(ROLE);
  }
  get access() { return localStorage.getItem(ACCESS); }
  get refresh() { return localStorage.getItem(REFRESH); }
  get role(): 'ADMIN' | 'USER' | null {
    return (localStorage.getItem(ROLE) as any) ?? null;
  }
  isLoggedIn() { return !!this.access; }
}
