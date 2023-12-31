import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
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
    private stockService: StockService,
    private toastController: ToastController,
    private alertController: AlertController
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
        this.estoqueComProduto = response;
        loading.dismiss();
      },
      error: (error: any) => {
        this.presentToast('Falha ao recuperar estoque', 'danger');
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

  removerEstoque(estoque: any) {
    this.presentAlertRemove(estoque);
  }

  async presentAlertRemove(estoque: any) {
    const alert = await this.alertController.create({
      header: 'Atenção',
      message: 'Você tem certeza de que deseja excluir este estoque? Ele será removido permanentemente.',
      buttons: [
        {
          text: 'cancelar',
          cssClass: 'alert-button-cancel',
        },
        {
          text: 'continuar',
          cssClass: 'alert-button-confirm',
          handler: () => { // Adiciona um handler para o botão 'continuar'
            this.deleteStock(estoque);
          },
        },
      ],
    });

    await alert.present();
  }

  deleteStock(estoque: any) {
    this.stockService.deleteStock(estoque.id_estoque).subscribe({
      next: (response: any) => {
        this.presentToast('Estoque removido com sucesso', 'success');
        this.stockService.updateObservableStock();
      },
      error: (error: any) => {
        this.presentToast('Falha ao remover estoque', 'danger');
      },
    });
  }

  async presentToast(text: string, color: string,) {
    const toast = await this.toastController.create({
      message: text,
      duration: 1800,
      color: color
    });

    await toast.present();
  }
}
