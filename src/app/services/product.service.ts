import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private observerProduct = new Subject()

  constructor(
    private http: HttpClient
  ) { }

  getObservableProducts() {
    return this.observerProduct.asObservable()
  }

  updateObservableProducts() {
    this.observerProduct.next(true)
  }

  newProduct(productData: any) {
    return this.http.post('http://localhost:5000/novo-produto', productData)
  }

  uploadImages(id: number, url: string) {
    const productData = {
      id: id,
      url: url
    }
    return this.http.post('http://localhost:5000/upload-images', productData)
  }

  getImagesFromProduct(id: number) {
    return this.http.get(`http://localhost:5000/pegar-imagens/${id}`)
  }

  getProducts() {
    return this.http.get('http://localhost:5000/pegar-produtos')
  }

  getProductById(id: string) {
    return this.http.get(`http://localhost:5000/pegar-produto/${id}`)
  }


  deleteProduct(id: number) {
    return this.http.delete(`http://localhost:5000/produtos/${id}`)
  }
}
