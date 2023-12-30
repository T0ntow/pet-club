import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authUsernameKey = 'authUsername';
  private authUsernameSubject: BehaviorSubject<string | null>;
  authUsername$: Observable<string | null>;

  constructor(private jwtHelper: JwtHelperService,) {
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

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token'); // Obtém o token do Local Storage

    if (token) {
      try {
        return !this.jwtHelper.isTokenExpired(token);
      } catch (error) {
        console.error('Erro ao verificar token:', error);
        return false;
      }
    }
    return false;
  }

  logout() {
    localStorage.removeItem('token');
  }
}
