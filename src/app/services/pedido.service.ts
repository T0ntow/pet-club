import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpService } from './httpSevice.service';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private observerPedido = new Subject<boolean>();
  port = this.httpService.getPort();

  constructor(
    private http: HttpClient,
    private httpService: HttpService
  ) { }

  // Obter o Observable para atualizações de pedidos
  getObservablePedidos() {
    return this.observerPedido.asObservable();
  }

  // Atualizar o estado dos pedidos
  updateObservablePedidos() {
    this.observerPedido.next(true);
  }

  // Criar um novo pedido
  newPedido(pedidoData: any) {
    return this.http.post(`${this.port}/novo-pedido`, pedidoData);
  }

  // Obter todos os pedidos
  getPedidos() {
    return this.http.get(`${this.port}/pegar-pedidos`);
  }

  // Deletar um pedido
  deletePedido(cod: number) {
    return this.http.delete(`${this.port}/deletar-pedido/${cod}`);
  }

  // Atualizar um pedido
  updatePedido(pedidoData: any, cod: number) {
    return this.http.put(`${this.port}/atualizar-pedido/${cod}`, pedidoData);
  }
}
