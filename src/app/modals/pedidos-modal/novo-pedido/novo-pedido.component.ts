import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { PedidoService } from 'src/app/services/pedido.service';
import { ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

import { SupplierService } from 'src/app/services/supplier.service';
import { MaskitoElementPredicate } from '@maskito/core';
import { maskitoPrice } from '../../../mask';

interface Fornecedor {
  cnpj: string;
  email: string;
  endereco: string;
  nome: string;
  representante: string;
  fone: string;
  id: number;
}

@Component({
  selector: 'app-novo-pedido',
  templateUrl: './novo-pedido.component.html',
  styleUrls: ['./novo-pedido.component.scss'],
})
export class NovoPedidoComponent implements OnInit {
  fornecedores: Fornecedor[] = [];
  fornecedoresFiltrados: Fornecedor[] = [];
  pedidoForm: FormGroup;

  readonly maskitoPrice = maskitoPrice;
  readonly maskPredicate: MaskitoElementPredicate = async (el) => (el as HTMLIonInputElement).getInputElement();

  constructor(
    private fb: FormBuilder,
    private pedidoService: PedidoService,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private loadingController: LoadingController,
    private supplierService: SupplierService
  ) {
    this.pedidoForm = this.fb.group({
      cnpj_fornecedor: ['', Validators.required],
      data_pedido: ['', Validators.required],
      previsao_entrega: ['', Validators.required],
      metodo_entrega: ['', Validators.required],
      observacoes: [''],
      valor_total: ['', [Validators.required]],
      status_pedido: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.getSuppliers();
  }

  removeCurrencySymbol(price: string): string {
    // Remove espaços e símbolos de moeda, e converte a vírgula para ponto decimal
    return price
      .replace(/\s+/g, '')        // Remove todos os espaços
      .replace(/^\s*R\$\s*/, '')  // Remove o símbolo 'R$' e espaços ao redor
      .replace(',', '.');         // Substitui a vírgula por ponto
  }
  fecharModal() {
    this.modalCtrl.dismiss();
  }

  async salvarAlteracoes() {
    const pedidoData = this.pedidoForm.value;

    if (this.pedidoForm.valid) {
      const pedidoData = this.pedidoForm.value;
      pedidoData.valor_total = this.removeCurrencySymbol(this.pedidoForm.get('valor_total')!.value);

      console.log(pedidoData);
      

      this.pedidoService.newPedido(pedidoData).subscribe({
        next: async (response: any) => {
          this.pedidoService.updateObservablePedidos();
          this.modalCtrl.dismiss();
          await this.presentToast("Fornecedor cadastrado com sucesso", "success")
        },
        error: async (error: any) => {
          if (error.message = 'Já existe um fornecedor com este CNPJ') {
            return await this.presentToast("Existe um fornecedor cadastrado com esses dados", "danger")
          }
          await this.presentToast("Falha ao adicionar fornecedor", "danger")
        }
      })
    } else {
      await this.presentToast("Preencha o formulário corretamente", "danger")
    }
  }

  async getSuppliers() {
    this.supplierService.getSuppliers().subscribe({
      next: (response: any) => {
        this.fornecedores = response;
        this.fornecedoresFiltrados = this.fornecedores;
      },
      error: (error: any) => {
        this.presentToast('Falha ao recuperar fornecedores', 'danger');
      },
    });
  }

  filtrarFornecedor() {

  }

  novoFornecedor() {

  }

  async presentToast(text: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: text,
      duration: 1800,
      color: color
    });

    await toast.present();
  }
}
