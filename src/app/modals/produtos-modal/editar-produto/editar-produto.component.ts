import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { maskitoPrice } from '../../../mask'
import { MaskitoElementPredicate } from '@maskito/core';
import { ProductService } from 'src/app/services/product.service';
import { deleteObject, getDownloadURL, getStorage, listAll, ref, uploadBytes } from 'firebase/storage';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-editar-produto',
  templateUrl: './editar-produto.component.html',
  styleUrls: ['./editar-produto.component.scss'],
})
export class EditarProdutoComponent implements OnInit {
  @Input() produto: any;
  updateProductForm: FormGroup = new FormGroup({});

  readonly maskitoPrice = maskitoPrice;
  readonly maskPredicate: MaskitoElementPredicate = async (el) => (el as HTMLIonInputElement).getInputElement();

  constructor(
    private modalCtrl: ModalController,
    private toastController: ToastController,
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.updateProductForm = this.formBuilder.group({
      nome: [this.produto.nome, [Validators.required]],
      preco: [this.produto.preco, [Validators.required]],
      descricao: [this.produto.descricao],
      categoria: [this.produto.categoria, [Validators.required]],
      images: ['', []],
      cod: [this.produto.cod, [Validators.required]] // Adicionando o campo ID
    });
  }

  async onFileInputChange(event: any) {
    const selectedFiles = event.target.files;
    this.updateProductForm.patchValue({ images: selectedFiles });
  }

  fecharModal() {
    this.modalCtrl.dismiss();
  }

  removeCurrencySymbol(price: string): string {
    return price.replace(/^R\$/, '');
  }

  async salvarAlteracoes() {
    const productData = this.updateProductForm.value;
    productData.preco = this.removeCurrencySymbol(this.updateProductForm.get('preco')!.value);

    if (this.updateProductForm.valid) {
      const loading = await this.loadingController.create({
        message: 'Enviando informações...',
      });
      await loading.present();

      this.productService.updateProduct(productData).subscribe({
        next: async (response) => {
          if (productData.images.length > 0) {
            await this.listarEExcluirImagens(this.produto.cod)
            await this.updateImagesFromStorage(productData.cod, productData.images);
          }

          this.productService.updateObservableProducts();
          this.modalCtrl.dismiss(null, 'confirm');
          this.presentToast("Produto atualizado com sucesso", "success")
          await loading.dismiss();
        },
        error: (error) => {
          console.error('Erro ao atualizar o produto:', error);
          this.presentToast("Erro ao atualizar produto", "danger")
          loading.dismiss();
        }
      });
    } else {
      this.presentToast("Preencha o formulário corretamente", "danger")
    }
  }

  async listarEExcluirImagens(id: any) {
    const storage = getStorage();
    const listRef = ref(storage, `imagens/${id}`);

    try {
      const res = await listAll(listRef);

      // Iterar sobre cada item (imagem) e excluí-lo
      await Promise.all(res.items.map(async (itemRef) => {
        const imagePath = itemRef.fullPath;
        await deleteObject(ref(storage, imagePath));

        console.log(`Imagem ${imagePath} excluída com sucesso.`);
      }));

      this.productService.deleteImages(id).subscribe({
        next: (response) => {
          console.log(`Todas as imagens associadas ao ID ${id} foram excluídas.`);
        },
        error: (error) => {
          console.error('Erro ao atualizar o fornecedor:', error);
        }
      });

    } catch (error) {
      console.error('Erro ao listar e excluir imagens:', error);
    }
  }

  async updateImagesFromStorage(productId: string, newImages: File[]) {
    if (newImages.length === 0) {
      console.log("sem imagens");
      return;
    }

    const storage = getStorage();
    const downloadURLs = [];

    for (const image of newImages) {
      const storageRef = ref(storage, `imagens/${productId}/${image.name}`);
      await uploadBytes(storageRef, image);
      const downloadURL = await getDownloadURL(storageRef);
      downloadURLs.push(downloadURL);
    }

    this.updateImagesInMySQL(downloadURLs, productId);
  }

  async updateImagesInMySQL(images: string[], id: any) {
    const uploadObservables = images.map((image: string) => {
      return this.productService.uploadImages(id, image);
    });

    forkJoin(uploadObservables).subscribe({
      next: (responses: any[]) => {
        responses.forEach((response: any) => {
          console.log(response, "imagens enviadas");
        });
      },
      error: (error: any) => {
        console.log("Erro ao enviar imagens:", error);
      }
    });
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
