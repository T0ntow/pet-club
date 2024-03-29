import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpService } from './httpSevice.service';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  private observerEmployee = new Subject()
  port = this.httpService.getPort();

  constructor(
    private http: HttpClient,
    private httpService: HttpService
  ) { }


  getObservableSuppliers() {
    return this.observerEmployee.asObservable()
  }

  updateObservableSuppliers() {
    this.observerEmployee.next(true)
  }

  newSupplier(supplierData: any) {
    return this.http.post(`${this.port}/novo-fornecedor`, supplierData)
  }

  getSuppliers() {
    return this.http.get(`${this.port}/pegar-fornecedores`)
  }

  deleteSupplier(cnpj: string) {
    return this.http.delete(`${this.port}/deletar-fornecedor/${cnpj}`)
  }

  updateSupplier(supplierData: any, cnpj: any) {
    return this.http.put(`${this.port}/atualizar-fornecedor/${cnpj}`, supplierData)
  }
}
