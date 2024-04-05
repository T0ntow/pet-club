import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpService } from './httpSevice.service';

@Injectable({
  providedIn: 'root'
})

export class LoginService implements OnInit {
  port = this.httpService.getPort();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private httpService: HttpService
  ) { }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  login(userData: any): Observable<any> {
    return this.http.post(`${this.port}/login`, userData )
  }


}