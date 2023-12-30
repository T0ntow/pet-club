import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ModalController, LoadingController, ToastController } from '@ionic/angular';
import { Storage } from '@angular/fire/storage';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-novo-produto',
  templateUrl: './novo-produto.component.html',
  styleUrls: ['./novo-produto.component.scss'],
})
export class NovoProdutoComponent implements OnInit {
  newProductForm: FormGroup;

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
      descricao: ['', [Validators.required]],
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

      try {
        const imageUrls: string[] = [];

        for (const selectedFile of imageFile) {
          const imageUrl = await this.onImageSelect(selectedFile);
          imageUrls.push(imageUrl);
        }

        const productData = this.newProductForm.value

        // Adiciona as URLs das imagens ao objeto productData
        if (!productData.images) {
          productData.images = [];
        }

        console.log("imageUrls", imageUrls);
        this.newProductForm.controls['images'].setValue(imageUrls);

      } catch (error) {
        console.error('Erro durante o envio:', error);
        await loading.dismiss();

        const toast = await this.toastController.create({
          message: 'Erro durante o envio das informações. Por favor, tente novamente.',
          duration: 3000,
          color: 'danger',
        });

        toast.present();
        return; // Retorna para evitar que o código abaixo seja executado em caso de erro.
      } finally {
        await loading.dismiss();
      }

      const productData = this.newProductForm.value;
      this.productService.newProduct(productData).subscribe({
        next: async (response: any) => {
          this.productService.updateObservableProducts();
          this.modalCtrl.dismiss();

          const images = this.newProductForm.value.images
          const id = response.insertedProductId
          
          images.forEach((image: string) => {
            this.productService.uploadImages(id, image).subscribe({
              next: async (response: any) => {
                console.log(response, "imagens enviadas");
              },
              error: async (error: any) => {
                console.log("error", error);
              }
            });
          });

          await this.presentToast('Produto cadastrado com sucesso!', 'success');
        },
        error: async (error: any) => {
          console.log("error", error);

          await this.presentToast('Falha ao adicionar produto', 'danger');
        }
      });

    } else {
      this.modalCtrl.dismiss();
    }
  }

  async onImageSelect(selectedFile: File): Promise<string> {
    const storage = getStorage();
    const storageRef = ref(storage, `imagens/${selectedFile.name}`);

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
