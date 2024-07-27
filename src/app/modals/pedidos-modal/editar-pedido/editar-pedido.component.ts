import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PedidoService } from 'src/app/services/pedido.service';
import { SupplierService } from 'src/app/services/supplier.service';
import { ToastController, ModalController } from '@ionic/angular';

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
  nome: string;
  quantidade: number;
}

interface Pedido {
  cod: string;                    // Código do pedido (INT AI PK)
  cnpj_fornecedor: string;        // CNPJ do fornecedor (CHAR(14))
  data_pedido: string;            // Data do pedido (Date)
  previsao_entrega: string;       // Previsão de entrega (DATE)
  metodo_entrega: string;         // Método de entrega (VARCHAR(20))
  observacoes: string;            // Observações (VARCHAR(255))
  valor_total: number;            // Valor total (DECIMAL(8,2))
  status_pedido: string;          // Status do pedido (VARCHAR(10))
  produtos?: Produto[];           // Produtos selecionados
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

  constructor(
    private fb: FormBuilder,
    private pedidoService: PedidoService,
    private fornecedorService: SupplierService,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController
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
    this.getFornecedores();
    this.preencherFormulario();
  }

  preencherFormulario() {
    if (this.pedido) {
      this.updatePedidoForm.setValue({
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
    const dateFormatTed = data.split("T");
    return dateFormatTed[0];
  }

  getFornecedores() {
    this.fornecedorService.getSuppliers().subscribe({
      next: (response: any) => {
        this.fornecedores = response;
        this.fornecedoresFiltrados = this.fornecedores;
      },
      error: (error) => {
        console.log('Falha ao recuperar fornecedores', error);
        this.presentToast('Falha ao recuperar fornecedores', 'danger');
      },
    });
  }

  filtrarFornecedor() {
    const searchValue = this.updatePedidoForm.get('cnpj_fornecedor')?.value.toLowerCase();
    this.fornecedoresFiltrados = this.fornecedores.filter((fornecedor) =>
      fornecedor.nome.toLowerCase().includes(searchValue)
    );
  }

  adicionarProduto() {
    // Lógica para adicionar um novo produto (abrir um modal ou similar)
  }

  removerProduto(produto: Produto) {
    this.produtosSelecionados = this.produtosSelecionados.filter(p => p !== produto);
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
