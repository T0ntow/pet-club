import { Component, OnInit } from '@angular/core';
import { EditarFuncionarioComponent } from 'src/app/modals/funcionarios-modal/editar-funcionario/editar-funcionario.component';
import { ProductService } from 'src/services/product.service';
import { LoadingController, ToastController, AlertController, ModalController } from '@ionic/angular';
import { NovoProdutoComponent } from 'src/app/modals/produtos-modal/novo-produto/novo-produto.component';

@Component({
  selector: 'app-produtos-crud',
  templateUrl: './produtos-crud.page.html',
  styleUrls: ['./produtos-crud.page.scss'],
})
export class ProdutosCrudPage implements OnInit {

  produtos: { nome: string, descricao: string, categoria: string, preco: number }[] = []

  constructor(
    private alertController: AlertController,
    private modalCtrl: ModalController,
    private productService: ProductService,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.productService.getObservableProducts().subscribe(isUpdated => {
      this.getProducts();
    });

    this.getProducts();
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

  removerProduto(produto: any) {
    this.presentAlertRemove(produto);
  }

  deleteProduct(produto: any) {
    this.productService.deleteProduct(produto.id).subscribe({
      next: async (response: any) => {
        console.log('Produto removido com sucesso:', response);
        await this.presentToast('Produto removido com sucesso', "success");
        this.productService.updateObservableProducts();
      },
      error: (error: any) => {
        console.error('Falha ao remover produto:', error);
      },
    });
  }

  async alterarProduto(produto: any) {
    const modal = await this.modalCtrl.create({
      component: EditarFuncionarioComponent,
      componentProps: { funcionario: produto },
    });

    modal.onDidDismiss().then((data) => {
      console.log('Dados do produto atualizados:', data.data);
    });

    return await modal.present();
  }

  async adicionarProduto() {
    const modal = await this.modalCtrl.create({
      component:NovoProdutoComponent ,
    });

    modal.onDidDismiss().then((data) => {
      console.log('Dados do produto adicionados:', data.data);
    });

    return await modal.present();
  }

  async presentAlertRemove(produto: any) {
    const alert = await this.alertController.create({
      header: 'Atenção',
      message: 'Você tem certeza de que deseja excluir este produto? Ele será removido permanentemente.',
      buttons: [
        {
          text: 'cancelar',
          cssClass: 'alert-button-cancel',
        },
        {
          text: 'continuar',
          cssClass: 'alert-button-confirm',
          handler: () => { // Adiciona um handler para o botão 'continuar'
            this.deleteProduct(produto);
          },
        },
      ],
    });

    await alert.present();
  }

  async presentToast(text: string, color: string) {
    const toast = await this.toastController.create({
      message: text,
      duration: 1800,
      color: color
    });

    await toast.present();
  }
}