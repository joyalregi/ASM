import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Authservice {
  isLoggedIn = signal(false);
  constructor() {
    const token = localStorage.getItem('token');
    this.isLoggedIn.set(!!token);
  }
  getToken(): string {
    return localStorage.getItem('token') || '';
  }

  login(token: string) {
    localStorage.setItem('token', token);
    this.isLoggedIn.set(true);
  }
}
