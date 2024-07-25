import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { PedidoService } from 'src/app/services/pedido.service';
import { ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

import { ProductService } from 'src/app/services/product.service';
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

interface Produto {
  cod: number;
  nome: string,
  descricao: string,
  categoria: string,
  preco: string,
  images: string[] // ou pode ser um array de objetos dependendo da estrutura das imagens
}

@Component({
  selector: 'app-novo-pedido',
  templateUrl: './novo-pedido.component.html',
  styleUrls: ['./novo-pedido.component.scss'],
})
export class NovoPedidoComponent implements OnInit {
  fornecedores: Fornecedor[] = [];
  produtos: Produto[] = [];

  produtosSelecionados: Produto[] = [];

  fornecedoresFiltrados: Fornecedor[] = [];
  produtosFiltrados: Produto[] = []

  pedidoForm: FormGroup;

  readonly maskitoPrice = maskitoPrice;
  readonly maskPredicate: MaskitoElementPredicate = async (el) => (el as HTMLIonInputElement).getInputElement();

  constructor(
    private fb: FormBuilder,
    private pedidoService: PedidoService,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private loadingController: LoadingController,
    private supplierService: SupplierService,
    private productService: ProductService
  ) {
    this.pedidoForm = this.fb.group({
      produto_cod: ['', Validators.required],
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
    this.getSuppliersAndProducts();
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

  async getSuppliersAndProducts() {
    try {
      const [fornecedoresResponse, produtosResponse] = await Promise.all([
        this.supplierService.getSuppliers().toPromise(),
        this.productService.getProducts().toPromise()
      ]);

      this.fornecedores = fornecedoresResponse as Fornecedor[];
      this.produtos = produtosResponse as Produto[];

      this.fornecedoresFiltrados = this.fornecedores;
      this.produtosFiltrados = this.produtos;
    } catch (error) {
      this.presentToast('Falha ao recuperar fornecedores ou produtos', 'danger');
    }
  }
  
  filtrarFornecedor() {

  }

  filterProducts() {
  }

  novoFornecedor() {

  }

  novoProduto() {
    const produtoSelecionado = this.pedidoForm.get('produto_cod')!.value;
    
    if (produtoSelecionado) {
      const produto = this.produtos.find(p => p.cod === produtoSelecionado);
      if (produto && !this.produtosSelecionados.includes(produto)) {
        this.produtosSelecionados.push(produto);
      }
    }

  }

  get produtosSelecionadosNomes(): string {
    return this.produtosSelecionados.map(p => p.nome).join(', ');
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
