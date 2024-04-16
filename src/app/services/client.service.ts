import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpService } from './httpSevice.service';

@Injectable({
  providedIn: 'root'
})

export class ClientService {

  private observerClient = new Subject()
  port = this.httpService.getPort();

  constructor(
    private http: HttpClient,
    private httpService: HttpService
  ) { }

  getObservableClients() {
    return this.observerClient.asObservable()
  }

  updateObservableClients() {
    this.observerClient.next(true)
  }

  newClient(clientData: any) {
    return this.http.post(`${this.port}/novo-cliente`, clientData)
  }

  getClients() {
    return this.http.get(`${this.port}/pegar-clientes`)
  }

  deleteClient(cpf: string) {
    return this.http.delete(`${this.port}/deletar-cliente/${cpf}`)
  }

  updateClient(clientData: any, cpf: string) {
    return this.http.put(`${this.port}/atualizar-cliente/${cpf}`,clientData )
  }
}
