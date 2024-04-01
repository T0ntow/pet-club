import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor() { }

  private httpPort : string = 'https://server-pet2.onrender.com'

  getPort(): string {
    return this.httpPort;
  }

}
