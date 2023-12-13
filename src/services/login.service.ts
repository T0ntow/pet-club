import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class LoginService implements OnInit {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  login(userData: any): Observable<any> {
    return this.http.post(`http://localhost:5000/login`, userData)
  }


}