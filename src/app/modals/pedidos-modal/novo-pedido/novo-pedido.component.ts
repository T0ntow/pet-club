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
import { NovoProdutoPedidoComponent } from '../../novo-produto-pedido/novo-produto-pedido.component';

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
  nome: string;
  descricao: string;
  categoria: string;
  preco: string;
  images: string[];
  quantidade?: number;
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
  produtosFiltrados: Produto[] = [];
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
    return price
      .replace(/\s+/g, '')
      .replace(/^\s*R\$\s*/, '')
      .replace(',', '.');
  }

  fecharModal() {
    this.modalCtrl.dismiss();
  }

  async salvarAlteracoes() {
    const pedidoData = this.pedidoForm.value;
    console.log(pedidoData);
    

    // Adiciona os produtos selecionados aos dados do pedido
    pedidoData.produtos = this.produtosSelecionados.map(p => ({
      cod: p.cod,
      nome: p.nome,
      quantidade: p.quantidade
    }));

    if (this.pedidoForm.valid) {
      pedidoData.valor_total = this.removeCurrencySymbol(this.pedidoForm.get('valor_total')!.value);

      this.pedidoService.newPedido(pedidoData).subscribe({
        next: async (response: any) => {
          this.pedidoService.updateObservablePedidos();
          this.modalCtrl.dismiss();
          await this.presentToast("Pedido cadastrado com sucesso", "success");
        },
        error: async (error: any) => {
          if (error.message === 'Já existe um pedido com esses dados') {
            return await this.presentToast("Falha ao adicionar pedido", "danger");
          }
          await this.presentToast("Falha ao adicionar pedido", "danger");
        }
      });
    } else {
      await this.presentToast("Preencha o formulário corretamente", "danger");
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

  removerProduto(produto: Produto) {
    const index = this.produtosSelecionados.findIndex(p => p.cod === produto.cod);
    if (index !== -1) {
      this.produtosSelecionados.splice(index, 1);
    }
  }

  async novoProduto() {
    const modal = await this.modalCtrl.create({
      component: NovoProdutoPedidoComponent
    });

    modal.onDidDismiss().then((result) => {
      const { data } = result;
      if (data) {
        const produtoSelecionado = this.produtos.find(p => p.cod === data.produto_cod);
        if (produtoSelecionado) {
          const produtoExistente = this.produtosSelecionados.find(p => p.cod === produtoSelecionado.cod);
          if (produtoExistente) {
            produtoExistente.quantidade += data.quantidade_produto;
          } else {
            this.produtosSelecionados.push({ ...produtoSelecionado, quantidade: data.quantidade_produto });
            console.log("this.produtosSelecionados", this.produtosSelecionados);
          }
        }
      }
    });

    return await modal.present();
  }

  atualizarQuantidade(produto: Produto) {
    // Atualiza a quantidade do produto na lista de produtos selecionados
    const produtoExistente = this.produtosSelecionados.find(p => p.cod === produto.cod);
    if (produtoExistente) {
      produtoExistente.quantidade = produto.quantidade;
    }
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
