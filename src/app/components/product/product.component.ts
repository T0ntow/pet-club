import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { ProductService } from 'src/app/services/product.service';

interface Produto {
  cod: number;
  nome: string,
  descricao: string,
  categoria: string,
  preco: number,
  images: string[] // ou pode ser um array de objetos dependendo da estrutura das imagens
}
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  produtos: Produto[] = [];
  isLoading = true

  constructor(
    private productService: ProductService,
    private loadingController: LoadingController,
    public navCtrl: NavController,
    private router: Router
  ) { }

  ngOnInit() {
    this.productService.getObservableProducts().subscribe(isUpdated => {
      this.getProducts();
    });

    this.getProducts();
  }

  verDetalhes(produto: Produto) {
    const id = produto.cod
    this.router.navigate(['/produto', id]);
  }

  async getProducts() {
    this.productService.getProducts().subscribe({
      next: (response: any) => {
        this.produtos = response;

        if(response) {
          response.forEach((produto: any) => {
            this.getImages(produto)
          });
        }
      },
      error: (error: any) => {
      },
    });
  }

  getImages(produto: Produto) {
    this.productService.getImagesFromProduct(produto.cod).subscribe({
      next: (response: any) => {
        console.log('Imagens recuperadas com sucesso:', response);
        produto.images = response;
      },
      error: (error: any) => {
        console.error('Falha ao recuperar imagens:', error);
      }
    });
  }

  amei(produto: Produto) {
  }

  adicionarAoCarrinho(produto: Produto) {
  }


}
