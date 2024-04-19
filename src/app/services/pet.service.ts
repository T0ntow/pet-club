import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpService } from './httpSevice.service';

@Injectable({
  providedIn: 'root'
})
export class PetService {

  private observerPet = new Subject()
  port = this.httpService.getPort();

  constructor(
    private http: HttpClient,
    private httpService: HttpService
  ) { }

  getObservablePets() {
    return this.observerPet.asObservable()
  }

  updateObservablePets() {
    this.observerPet.next(true)
  }

  newPet(petData: any) {
    return this.http.post(`${this.port}/novo-pet`, petData)
  }

  getPets() {
    return this.http.get(`${this.port}/pegar-pets`)
  }

  updatePet(petData: any, id: any) {
    return this.http.put(`${this.port}/atualizar-pet/${id}`, petData)
  }

  deletePet(id: string) {
    return this.http.delete(`${this.port}/deletar-pet/${id}`)
  }
}
