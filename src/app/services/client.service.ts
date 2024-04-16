import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ClientService {

  private observerClient = new Subject()

  constructor(
    private http: HttpClient
  ) { }

  getObservableClients() {
    return this.observerClient.asObservable()
  }

  updateObservableClients() {
    this.observerClient.next(true)
  }

  newClient(clientData: any) {
    return this.http.post('http://localhost:5000/novo-cliente', clientData)
  }

  getClients() {
    return this.http.get('http://localhost:5000/pegar-clientes')
  }

  deleteClient(cpf: string) {
    return this.http.delete(`http://localhost:5000/deletar-cliente/${cpf}`)
  }

  updateClient(clientData: any, cpf: string) {
    return this.http.put(`http://localhost:5000/atualizar-cliente/${cpf}`, clientData)
  }
}
