import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-novo-estoque',
  templateUrl: './novo-estoque.component.html',
  styleUrls: ['./novo-estoque.component.scss'],
})

export class NovoEstoqueComponent  implements OnInit {
  newStockForm: FormGroup
  @Input() produtos: { id: number; nome: string; preco: number }[] = [];

  constructor(
    private modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private stockService: StockService,
    private toastController: ToastController
  ) { 
    this.newStockForm = this.formBuilder.group({
      id_produto: [null, [Validators.required]],
      quantidade: ['', [Validators.required]],
      validade: [''],
    })
  }

  ngOnInit() {
    console.log(this.produtos);
  }

  fecharModal() {
    this.modalCtrl.dismiss();
  }

  async salvarAlteracoes() {
    const stockData = this.newStockForm.value;
    console.log(stockData);
    
    if(this.newStockForm.valid) {
      this.stockService.newStock(stockData).subscribe({
        next: async (response: any) => {
          this.stockService.updateObservableStock();
          this.modalCtrl.dismiss();
          await this.presentToast("Estoque cadastrado com sucesso", "success")
        },
        error: async (error: any) => {
          if(error.message = "ID de produto já existente no estoque" ) {
            return await this.presentToast("Estoque de produto já cadastrado", "danger")
          }
          return await this.presentToast("Falha ao adicionar estoque", "danger")
        }
      })
    } else {
      await this.presentToast("Preencha o formulário corretamente", "danger")
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
