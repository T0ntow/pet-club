import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpService } from './httpSevice.service';

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  port = this.httpService.getPort();

  constructor(
    private http: HttpClient,
    private httpService: HttpService
  ) { }

  signup(userData: any) {
    return this.http.post(`${this.port}/signup`, userData )
  }
}
