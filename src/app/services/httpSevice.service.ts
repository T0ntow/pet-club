import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor() { }

  httpPort : string = 'http://localhost:5000'

  getPort(): string {
    return this.httpPort;
  }

}
