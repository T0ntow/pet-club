import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PedidoService } from 'src/app/services/pedido.service';
import { SupplierService } from 'src/app/services/supplier.service';
import { ToastController, ModalController } from '@ionic/angular';
import { NovoProdutoPedidoComponent } from '../../novo-produto-pedido/novo-produto-pedido.component';
import { ProductService } from 'src/app/services/product.service';
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

interface Pedido {
  cod: string;
  cnpj_fornecedor: string;
  data_pedido: string;
  previsao_entrega: string;
  metodo_entrega: string;
  observacoes: string;
  valor_total: number;
  status_pedido: string;
  produtos?: Produto[];
}

@Component({
  selector: 'app-editar-pedido',
  templateUrl: './editar-pedido.component.html',
  styleUrls: ['./editar-pedido.component.scss'],
})
export class EditarPedidoComponent implements OnInit {
  @Input() pedido!: Pedido;

  updatePedidoForm: FormGroup;
  fornecedores: Fornecedor[] = [];
  fornecedoresFiltrados: Fornecedor[] = [];
  produtosSelecionados: Produto[] = [];
  produtos: Produto[] = [];

  constructor(
    private fb: FormBuilder,
    private pedidoService: PedidoService,
    private fornecedorService: SupplierService,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private productService: ProductService
  ) {
    this.updatePedidoForm = this.fb.group({
      cnpj_fornecedor: ['', Validators.required],
      data_pedido: ['', Validators.required],
      previsao_entrega: ['', Validators.required],
      metodo_entrega: ['', Validators.required],
      observacoes: [''],
      valor_total: ['', Validators.required],
      status_pedido: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.getSuppliersAndProducts();
    this.preencherFormulario();
    console.log("Produtos carregados:", this.produtos);
  }

  preencherFormulario() {
    if (this.pedido) {
      this.updatePedidoForm.patchValue({
        cnpj_fornecedor: this.pedido.cnpj_fornecedor,
        data_pedido: this.formatarData(this.pedido.data_pedido),
        previsao_entrega: this.formatarData(this.pedido.previsao_entrega),
        metodo_entrega: this.pedido.metodo_entrega,
        observacoes: this.pedido.observacoes,
        valor_total: this.pedido.valor_total,
        status_pedido: this.pedido.status_pedido,
      });
      this.produtosSelecionados = this.pedido.produtos || [];
    }
  }

  formatarData(data: string): string {
    const dateFormatTed = data.split('T');
    return dateFormatTed[0];
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

  
  async getSuppliersAndProducts() {
    try {
      const [fornecedoresResponse, produtosResponse] = await Promise.all([
        this.fornecedorService.getSuppliers().toPromise(),
        this.productService.getProducts().toPromise()
      ]);

      this.fornecedores = fornecedoresResponse as Fornecedor[];
      this.produtos = produtosResponse as Produto[];
      this.fornecedoresFiltrados = this.fornecedores;
      // this.produtosFiltrados = this.produtos;
    } catch (error) {
      this.presentToast('Falha ao recuperar fornecedores ou produtos', 'danger');
    }
  }
  filtrarFornecedor() {
    const searchValue = this.updatePedidoForm.get('cnpj_fornecedor')?.value.toLowerCase();
    this.fornecedoresFiltrados = this.fornecedores.filter((fornecedor) =>
      fornecedor.nome.toLowerCase().includes(searchValue)
    );
  }

  removerProduto(produto: Produto) {
    this.produtosSelecionados = this.produtosSelecionados.filter(p => p.cod !== produto.cod);
  }

  salvarAlteracoes() {
    if (this.updatePedidoForm.valid) {
      const pedidoData: Pedido = {
        ...this.updatePedidoForm.value,
        produtos: this.produtosSelecionados
      };

      this.pedidoService.updatePedido(pedidoData, this.pedido.cod).subscribe({
        next: () => {
          this.pedidoService.updateObservablePedidos();
          this.modalCtrl.dismiss(null, 'confirm');
          this.presentToast('Pedido atualizado com sucesso', 'success');
        },
        error: (error) => {
          console.error('Erro ao atualizar o pedido:', error);
          this.presentToast('Erro ao atualizar pedido', 'danger');
        },
      });
    } else {
      this.presentToast('Preencha o formulário corretamente', 'danger');
    }
  }

  fecharModal() {
    this.modalCtrl.dismiss();
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
