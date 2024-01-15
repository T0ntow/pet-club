import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private observerSale = new Subject<boolean>();

  constructor(private http: HttpClient) { }

  getObservableSales() {
    return this.observerSale.asObservable();
  }

  updateObservableSales() {
    this.observerSale.next(true);
  }

  newSale(saleData: any) {
    return this.http.post('http://localhost:5000/nova-venda', saleData);
  }

  getSales() {
    return this.http.get('http://localhost:5000/pegar-vendas');
  }

  GetFullSaleDetails() {
    return this.http.get('http://localhost:5000/pegar-vendas-completa');
  }

  deleteSale(id: number) {
    return this.http.delete(`http://localhost:5000/venda/${id}`);
  }
}