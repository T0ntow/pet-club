import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PetService {

  private observerPet = new Subject()

  constructor(
    private http: HttpClient
  ) { }

  getObservablePets() {
    return this.observerPet.asObservable()
  }

  updateObservablePets() {
    this.observerPet.next(true)
  }

  newPet(employeeData: any) {
    return this.http.post('http://localhost:5000/novo-pet', employeeData)
  }

  getPets() {
    return this.http.get('http://localhost:5000/pegar-pets')
  }

  deletePet(id: number) {
    return this.http.delete(`http://localhost:5000/pet/${id}`)
  }
}
