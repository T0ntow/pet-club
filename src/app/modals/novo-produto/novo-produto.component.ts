import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ModalController, LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { FormBuilder } from '@angular/forms';
import { Storage } from '@angular/fire/storage';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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
    private loadingController: LoadingController // Inject LoadingController
  ) {
    this.newProductForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      price: ['', [Validators.required]],
      description: ['', [Validators.required]],
      images: [null, [Validators.required]],
    });
  }

  ngOnInit() {}

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
        color: "danger"
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
        for (const selectedFile of imageFile) {
          await this.onImageSelect(selectedFile);
        }

        await loading.dismiss();
        this.modalCtrl.dismiss();
        this.presentToast()
      } catch (error) {
        console.error('Erro durante o envio:', error);
        await loading.dismiss();
        const toast = await this.toastController.create({
          message: 'Erro durante o envio das informações. Por favor, tente novamente.',
          duration: 3000,
          color: "danger",
        });
        toast.present();
      }
    } else {
      this.modalCtrl.dismiss();
    }
  }

  async onImageSelect(selectedFile: File) {
    console.log('selectedFile', selectedFile);

    const storage = getStorage();
    const storageRef = ref(storage, `imagens/${selectedFile.name}`);

    await uploadBytes(storageRef, selectedFile);
    await getDownloadURL(storageRef);
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Produto cadastrado com sucesso!',
      duration: 1800,
      color: 'success'
    });

    await toast.present();
  }
}
