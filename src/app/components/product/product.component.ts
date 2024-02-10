import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {

  produtos: { 
    id: number;
    nome: string, 
    descricao: string, 
    categoria: string, 
    preco: number, 
    images: string[] // ou pode ser um array de objetos dependendo da estrutura das imagens
  }[] = [];

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
  
  verDetalhes(produto: any) {
    const id = produto.id
    this.router.navigate(['/produto', id]);
  }

  async getProducts() {
    const loading = await this.loadingController.create({
      message: 'Carregando produtos...',
      spinner: 'crescent',
      translucent: true,
    });

    await loading.present();

    this.productService.getProducts().subscribe({
      next: (response: any) => {
        this.produtos = response;
        response.forEach((produto: any) => {
            this.getImages(produto)
        });
        loading.dismiss();
      },
      error: (error: any) => {
        loading.dismiss();
      },
    });
  }

  getImages(produto: any) {
    this.productService.getImagesFromProduct(produto.id).subscribe({
      next: (response: any) => {
        console.log('Imagens recuperadas com sucesso:', response);
        produto.images = response; 
      },
      error: (error: any) => {
        console.error('Falha ao recuperar imagens:', error);
      }
    });
  }

  amei(produto: any) {
  }

  adicionarAoCarrinho(produto: any) {
  }


}
