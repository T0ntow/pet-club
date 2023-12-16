import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private observerEmployee = new Subject()

  constructor(
    private http: HttpClient
  ) { }

  getObservableEmployees() {
    return this.observerEmployee.asObservable()
  }

  updateObservableProducts() {
    this.observerEmployee.next(true)
  }

  newEmployee(employeeData: any) {
    return this.http.post('http://localhost:5000/novo-funcionario', employeeData)
  }

  getEmployees() {
    return this.http.get('http://localhost:5000/pegar-funcionarios')
  }

  deleteEmployee(id: number) {
    return this.http.delete(`http://localhost:5000/funcionarios/${id}`)
  }
}
