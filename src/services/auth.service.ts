import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authUsernameKey = 'authUsername';
  private authUsernameSubject: BehaviorSubject<string | null>;
  authUsername$: Observable<string | null>;

  constructor() {
    this.authUsernameSubject = new BehaviorSubject<string | null>(null);
    this.authUsername$ = this.authUsernameSubject.asObservable();

    const storedUsername = localStorage.getItem(this.authUsernameKey);
    this.authUsernameSubject.next(storedUsername);
  }

  setAuthUsername(username: string): void {
    this.authUsernameSubject.next(username);
    localStorage.setItem(this.authUsernameKey, username);
  }

  getAuthUsername(): string | null {
    return this.authUsernameSubject.value;
  }
}
