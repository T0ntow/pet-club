import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ModalController, LoadingController, ToastController } from '@ionic/angular';
import { Storage } from '@angular/fire/storage';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ProductService } from 'src/app/services/product.service';
import type { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core';
import { maskitoPrice } from '../../../mask';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-novo-produto',
  templateUrl: './novo-produto.component.html',
  styleUrls: ['./novo-produto.component.scss'],
})
export class NovoProdutoComponent implements OnInit {
  newProductForm: FormGroup;
  readonly maskitoPrice = maskitoPrice;
  readonly maskPredicate: MaskitoElementPredicate = async (el) => (el as HTMLIonInputElement).getInputElement();

  constructor(
    private modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private storage: Storage,
    private productService: ProductService,
    private loadingController: LoadingController
  ) {
    this.newProductForm = this.formBuilder.group({
      nome: ['', [Validators.required]],
      preco: ['', [Validators.required]],
      descricao: ['',],
      categoria: ['', [Validators.required]],
      images: [null, [Validators.required]],
    });
  }

  ngOnInit() { }

  fecharModal() {
    this.modalCtrl.dismiss();
  }

  async onFileInputChange(event: any) {
    const selectedFiles = event.target.files;
    this.newProductForm.patchValue({ images: selectedFiles });
  }

  removeCurrencySymbol(price: string): string {
    // Remove espaços e símbolos de moeda, e converte a vírgula para ponto decimal
    return price
      .replace(/\s+/g, '')        // Remove todos os espaços
      .replace(/^\s*R\$\s*/, '')  // Remove o símbolo 'R$' e espaços ao redor
      .replace(',', '.');         // Substitui a vírgula por ponto
  }
  async salvarAlteracoes() {
    const imageFile = this.newProductForm.value.images;

    if (!imageFile || imageFile.length === 0) {
      const toast = await this.toastController.create({
        message: 'Selecione uma imagem para o produto!',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
      return;
    }

    if (this.newProductForm.valid) {
      const loading = await this.loadingController.create({
        message: 'Enviando informações...',
      });

      await loading.present();
      const productData = this.newProductForm.value;
      productData.preco = this.removeCurrencySymbol(this.newProductForm.get('preco')!.value);

      this.productService.newProduct(productData).subscribe({
        next: async (response: any) => {
          const id = response.insertedcod_produto

          try {
            const imageUrls: string[] = [];

            for (const selectedFile of imageFile) {
              const imageUrl = await this.onImageSelect(id, selectedFile);
              imageUrls.push(imageUrl);
            }

            if (!productData.images) {
              productData.images = [];
            }

            const uploadObservables = imageUrls.map((image: string) => {
              return this.productService.uploadImages(id, image);
            });

            forkJoin(uploadObservables).subscribe({
              next: (responses: any[]) => {
                responses.forEach((response: any) => {
                  console.log(response, "imagens enviadas");
                });
              },
              error: async (error: any) => {
                console.log("Erro ao enviar imagem:", error);
              },
              complete: async () => {
                this.productService.updateObservableProducts();
                this.modalCtrl.dismiss();
                await loading.dismiss();
                await this.presentToast('Produto cadastrado com sucesso!', 'success');
              }
            });

          } catch (error) {
            console.error('Erro durante o envio:', error);
            this.modalCtrl.dismiss();
            await loading.dismiss();
            await this.presentToast("Erro durante o envio das informações. Por favor, tente novamente", "danger")
          }
        },
        error: async (error: any) => {
          console.log("error", error);

          this.modalCtrl.dismiss();
          await loading.dismiss();
          await this.presentToast('Falha ao adicionar produto', 'danger');

        }
      })
    } else {
      this.modalCtrl.dismiss();
    }
  }

  async onImageSelect(id: any, selectedFile: File): Promise<string> {
    const storage = getStorage();
    const storageRef = ref(storage, `imagens/${id}/${selectedFile.name}`);

    // Faz o upload da imagem
    await uploadBytes(storageRef, selectedFile);

    // Obtém a URL da imagem após o upload
    const downloadURL = await getDownloadURL(storageRef);
    console.log("downloadURL", downloadURL);
    return downloadURL;
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1800,
      color: color,
    });

    await toast.present();
  }
}
