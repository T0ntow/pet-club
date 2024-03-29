import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { maskitoCNPJ, maskitoNumber } from '../../../mask'
import { MaskitoElementPredicate } from '@maskito/core';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-editar-produto',
  templateUrl: './editar-produto.component.html',
  styleUrls: ['./editar-produto.component.scss'],
})
export class EditarProdutoComponent  implements OnInit {
  @Input() produto: any;
  updateProductForm: FormGroup = new FormGroup({});

  constructor(
    private modalCtrl: ModalController,
    private toastController: ToastController,
    private formBuilder: FormBuilder,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.updateProductForm = this.formBuilder.group({
      nome: [this.produto.nome, [Validators.required]],
      preco: [this.produto.preco, [Validators.required]],
      descricao: [this.produto.descricao, [Validators.required]],
      categoria: [this.produto.categoria, [Validators.required]],
      images: [this.produto.images, [Validators.required]],
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

  salvarAlteracoes() {
    const productData = this.updateProductForm.value;
    console.log("productData", productData);
    
    if (this.updateProductForm.valid) {
      this.productService.updateProduct(productData).subscribe({
        next: (response) => {
          this.productService.updateObservableProducts();
          this.modalCtrl.dismiss(null, 'confirm');
          this.presentToast("Produto atualizado com sucesso", "success")
        },
        error: (error) => {
          console.error('Erro ao atualizar o produto:', error);
          this.presentToast("Erro ao atualizar produto", "danger")
        }
      });
    } else {
      this.presentToast("Preencha o formulário corretamente", "danger")
    }
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
