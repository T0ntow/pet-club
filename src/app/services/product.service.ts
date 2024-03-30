import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpService } from './httpSevice.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private observerProduct = new Subject()
  port = this.httpService.getPort();

  constructor(
    private http: HttpClient,
    private httpService: HttpService
  ) { }

  getObservableProducts() {
    return this.observerProduct.asObservable()
  }

  updateObservableProducts() {
    this.observerProduct.next(true)
  }

  newProduct(productData: any) {
    return this.http.post(`${this.port}/novo-produto`, productData)
  }

  uploadImages(id: number, url: string) {
    const productData = {
      id: id,
      url: url
    }
    return this.http.post(`${this.port}/upload-images`, productData)
  }

  getImagesFromProduct(id: number) {
    return this.http.get(`${this.port}/pegar-imagens/${id}`)
  }

  getProducts() {
    return this.http.get(`${this.port}/pegar-produtos`)
  }

  getProductById(id: string) {
    return this.http.get(`${this.port}/pegar-produto/${id}`)
  }

  updateProduct(productData: any) {
    return this.http.put(`${this.port}/atualizar-produto/${productData.cod}`, productData)
  }

  deleteProduct(id: number) {
    return this.http.delete(`${this.port}/deletar-produto/${id}`)
  }

  deleteImages(id: number) {
    return this.http.delete(`${this.port}/deletar-imagens/${id}`)
  }
}
