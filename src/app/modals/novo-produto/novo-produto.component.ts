import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { FormBuilder } from '@angular/forms';

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
  ) {
    this.newProductForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      price: ['', [Validators.required]],
      description: ['', [Validators.required]],
      images: ['', [Validators.required]]
    });
  }

  ngOnInit() {

  }

  fecharModal() {
    this.modalCtrl.dismiss();
  }

  salvarAlteracoes() {
    if (this.newProductForm.valid) {
      console.log(this.newProductForm);
      this.modalCtrl.dismiss();
    } else {
      this.modalCtrl.dismiss();
    }
  }

  // async onSubmit() {
  //   const formData = this.newProductForm.value;

  //   // Enviar a imagem para o Firebase Storage
  //   const imageName = `images/${new Date().getTime()}`;
  //   const imageRef = this.storage.ref(imageName);
  //   const imageUploadTask = imageRef.putString(formData.images, 'data_url');

  //   // Aguarde o upload ser concluído
  //   await imageUploadTask.then();

  //   // Obtenha a URL da imagem no Firebase Storage
  //   const imageUrl = await imageRef.getDownloadURL();

  //   // Agora você pode usar a URL da imagem como desejar, por exemplo, salvar no banco de dados
  //   console.log('URL da imagem:', imageUrl);
  // }


}