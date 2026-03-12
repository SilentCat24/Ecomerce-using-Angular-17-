import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../environment/environment';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  phone?: string;
}

@Injectable({ providedIn: 'root' })
export class Auth {
  private apiUrl = `${environment.apiUrl}/auth`;

  // Reactive state
  token = signal<string | null>(null); // now token is a signal
  currentUser = signal<User | null>(null);

  isLoggedIn = computed(() => !!this.token());
  isAdmin = computed(() => this.currentUser()?.role === 'admin');

  constructor(private http: HttpClient, private router: Router) {
    // Only access localStorage in the browser
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        this.token.set(savedToken);
        this.loadProfile();
      }
    }
  }

  login(email: string, password: string) {
    return this.http
      .post<{ user: User; token: string }>(`${this.apiUrl}/login`, { email, password })
      .pipe(tap(res => this.setSession(res)));
  }

  register(name: string, email: string, password: string) {
    return this.http
      .post<{ user: User; token: string }>(`${this.apiUrl}/register`, { name, email, password })
      .pipe(tap(res => this.setSession(res)));
  }

  loadProfile() {
    return this.http.get<User>(`${this.apiUrl}/me`).subscribe({
      next: user => this.currentUser.set(user),
      error: () => this.logout()
    });
  }

  updateProfile(data: Partial<User>) {
    return this.http
      .put<User>(`${this.apiUrl}/profile`, data)
      .pipe(tap(user => this.currentUser.set(user)));
  }

  changePassword(currentPassword: string, newPassword: string) {
    return this.http.put(`${this.apiUrl}/change-password`, { currentPassword, newPassword });
  }

  private setSession(res: { user: User; token: string }) {
    // Only access localStorage in the browser
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', res.token);
    }
    this.token.set(res.token);
    this.currentUser.set(res.user);
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    this.token.set(null);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }
}