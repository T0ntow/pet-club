import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class LoginService implements OnInit {

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  login(userData: any): Observable<any> {
    return this.http.post(`http://localhost:5000/login`, userData)
  }

  isTokenValid(): boolean {
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