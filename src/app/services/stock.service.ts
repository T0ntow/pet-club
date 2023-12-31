import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private observerStock = new Subject()

  constructor(
    private http: HttpClient
  ) { }

  getObservableStock() {
    return this.observerStock.asObservable()
  }

  updateObservableStock() {
    this.observerStock.next(true)
  }

  newStock(stockData: any) {
    return this.http.post('http://localhost:5000/novo-estoque', stockData)
  }

  getStock() {
    return this.http.get('http://localhost:5000/pegar-estoque')
  }

  getStockWithProducts() {
    return this.http.get('http://localhost:5000/pegar-estoque-produtos')
  }
  
  deleteStock(id: number) {
    return this.http.delete(`http://localhost:5000/estoque/${id}`)
  }
}
