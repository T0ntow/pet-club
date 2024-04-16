import { Component, OnInit } from '@angular/core';
import { EditarProdutoComponent } from 'src/app/modals/produtos-modal/editar-produto/editar-produto.component';
import { ProductService } from 'src/app/services/product.service';
import { LoadingController, ToastController, AlertController, ModalController } from '@ionic/angular';
import { NovoProdutoComponent } from 'src/app/modals/produtos-modal/novo-produto/novo-produto.component';
import { getStorage, ref, deleteObject } from "firebase/storage";

interface Produto {
  cod: number;
  nome: string,
  descricao: string,
  categoria: string,
  preco: string,
  images: string[] // ou pode ser um array de objetos dependendo da estrutura das imagens
}

@Component({
  selector: 'app-produtos-crud',
  templateUrl: './produtos-crud.page.html',
  styleUrls: ['./produtos-crud.page.scss'],
})

export class ProdutosCrudPage implements OnInit {
  produtos: Produto[] = [];
  produtosFiltrados: Produto[] = [];
  searchTerm = '';
  temProduto: boolean = true;

  isLoading = true

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

  searchProducts() {
    this.produtosFiltrados = this.produtos.filter(produto =>
      produto.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
      produto.categoria.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    this.temProduto = this.produtosFiltrados.length > 0;
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
        this.produtosFiltrados = this.produtos;


        response.forEach((produto: any) => {
          this.getImages(produto)
        });
        loading.dismiss();
      },
      error: (error: any) => {
        this.presentToast("Falha ao recuperar produtos", "danger")
        loading.dismiss();
      },
    });
  }

  getImages(produto: any) {
    this.productService.getImagesFromProduct(produto.cod).subscribe({
      next: (response: any) => {
        console.log('Imagens recuperadas com sucesso:', response);
        produto.images = response;
        this.isLoading = false
      },
      error: (error: any) => {
        console.error('Falha ao recuperar imagens:', error);
      }
    });
  }

  removerProduto(produto: any) {
    this.presentAlertRemove(produto);
  }

  deleteProduct(produto: any) {
    const storage = getStorage();

    //remover referencia das imagens
    this.productService.getImagesFromProduct(produto.cod).subscribe({
      next: async (response: any) => {
        console.log('Imagens recuperadas com sucesso:', response);

        // Remover as imagens do Firebase Storage
        const imageDeletionPromises = response.map((imageUrl: string) => {
          const imageRef = ref(storage, imageUrl);
          return deleteObject(imageRef);
        });

        try {
          // Aguardar a conclusão de todas as operações de exclusão
          await Promise.all(imageDeletionPromises);

          console.log('Imagens removidas do Firebase Storage com sucesso');
        } catch (error) {
          console.error('Falha ao remover imagens do Firebase Storage:', error);
        }
      },
      error: (error: any) => {
        console.error('Falha ao recuperar imagens:', error);
      },
    });

    this.productService.deleteProduct(produto.cod).subscribe({
      next: (response: any) => {
        this.presentToast('Produto removido com sucesso', "success");
        this.productService.updateObservableProducts();
      },
      error: (error: any) => {
        console.error('Falha ao remover produto:', error);
      },
    });
  }

  async alterarProduto(produto: any) {
    const modal = await this.modalCtrl.create({
      component: EditarProdutoComponent,
      componentProps: { produto: produto },
    });

    return await modal.present();
  }

  async adicionarProduto() {
    const modal = await this.modalCtrl.create({
      component: NovoProdutoComponent,
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
          handler: () => {
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