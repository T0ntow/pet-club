import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ProductService } from 'src/app/services/product.service';
import { ModalController } from '@ionic/angular';
import { NovoEstoqueComponent } from 'src/app/modals/estoque-modal/novo-estoque/novo-estoque.component';
import { StockService } from 'src/app/services/stock.service';

import { format } from 'date-fns'

@Component({
  selector: 'app-estoque',
  templateUrl: './estoque.page.html',
  styleUrls: ['./estoque.page.scss'],
})
export class EstoquePage implements OnInit {
  produtos: { 
    id: number;
    nome: string, 
    preco: number, 
  }[] = [];

  estoqueComProduto: { 
    id_produto: number;
    id_estoque: number,
    nome_produto: string,
    preco_produto: number,
    categoria: string
    quantidade: number,
    validade: Date
  }[] = [];

  constructor(
    private loadingController: LoadingController,
    private productService: ProductService,
    private modalCtrl: ModalController,
    private stockService: StockService
  ) { }

  ngOnInit() {
    this.stockService.getObservableStock().subscribe(isUpdated => {
      this.getStockWithProducts();
    });
    
    this.getProducts();
    this.getStockWithProducts();
  }

  formatarData(data: Date): string {
    return format(data, 'dd/MM/yyyy');
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
        console.log('Produtos recuperados:', response);
        this.produtos = response;

        loading.dismiss();
      },
      error: (error: any) => {
        console.error('Falha ao recuperar produtos:', error);
        loading.dismiss();
      },
    });
  }

  async getStockWithProducts() {
    const loading = await this.loadingController.create({
      message: 'Carregando estoque...',
      spinner: 'crescent',
      translucent: true,
    });

    await loading.present();

    this.stockService.getStockWithProducts().subscribe({
      next: (response: any) => {
        console.log('Estoque recuperado:', response);
        this.estoqueComProduto = response;

        loading.dismiss();
      },
      error: (error: any) => {
        console.error('Falha ao recuperar produtos:', error);
        loading.dismiss();
      },
    });
  }

  async adicionarEstoque() {
    console.log('Produtos a serem passados para o modal:', this.produtos);

    const modal = await this.modalCtrl.create({
      component: NovoEstoqueComponent,
      componentProps: {
        produtos: this.produtos,
      },
  
    });

    return await modal.present();
  }
}
