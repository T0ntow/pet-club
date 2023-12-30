import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  private observerEmployee = new Subject()

  constructor(
    private http: HttpClient
  ) { }

  getObservableSuppliers() {
    return this.observerEmployee.asObservable()
  }

  updateObservableSuppliers() {
    this.observerEmployee.next(true)
  }

  newSupplier(employeeData: any) {
    return this.http.post('http://localhost:5000/novo-fornecedor', employeeData)
  }

  getSuppliers() {
    return this.http.get('http://localhost:5000/pegar-fornecedores')
  }

  deleteSupplier(id: number) {
    return this.http.delete(`http://localhost:5000/fornecedores/${id}`)
  }
}
