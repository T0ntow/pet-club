import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PedidoService } from 'src/app/services/pedido.service';
import { SupplierService } from 'src/app/services/supplier.service';
import { ToastController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';

interface Fornecedor {
  cnpj: string;
  email: string;
  endereco: string;
  nome: string;
  representante: string;
  fone: string;
  id: number;
}
interface Pedido {
  cod: string;                    // Código do pedido (INT AI PK)
  cnpj_fornecedor: string;        // CNPJ do fornecedor (CHAR(14))
  data_pedido: String;              // Data do pedido (Date)
  previsao_entrega: String;         // Previsão de entrega (DATE)
  metodo_entrega: string;         // Método de entrega (VARCHAR(20))
  observacoes: string;            // Observações (VARCHAR(255))
  valor_total: number;            // Valor total (DECIMAL(8,2))
  status_pedido: string;          // Status do pedido (VARCHAR(10))
}

@Component({
  selector: 'app-editar-pedido',
  templateUrl: './editar-pedido.component.html',
  styleUrls: ['./editar-pedido.component.scss'],
})
export class EditarPedidoComponent  implements OnInit {
  @Input()
  pedido!: Pedido;

  updatePedidoForm: FormGroup = new FormGroup({});
  fornecedores: Fornecedor[] = []
  fornecedoresFiltrados: any[] = []; // Supondo que seja uma lista de fornecedores
  fornecedorSearch: string = '';

  constructor(
    private fb: FormBuilder,
    private pedidoService: PedidoService,
    private fornecedorService: SupplierService,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.getFornecedores();

    this.updatePedidoForm = this.fb.group({
      cnpj_fornecedor: [this.pedido?.cnpj_fornecedor, Validators.required],
      data_pedido: [this.formatarData(this.pedido.data_pedido), Validators.required],
      previsao_entrega: [this.formatarData(this.pedido?.previsao_entrega), Validators.required],
      metodo_entrega: [this.pedido?.metodo_entrega, Validators.required],
      observacoes: [this.pedido?.observacoes],
      valor_total: [this.pedido?.valor_total, Validators.required],
      status_pedido: [this.pedido?.status_pedido, Validators.required],
    });

  }
  
  formatarData(data: String): string {
    const dateFormatTed = data.split("T");
    return dateFormatTed[0];
  }

  getFornecedores() {
    this.fornecedorService.getSuppliers().subscribe({
      next: async (response: any) => {
        this.fornecedores = response;
        this.fornecedoresFiltrados = this.fornecedores;
      },
      error: async (error: any) => {
        console.log('Falha ao recuperar clientes', error);
      },
    });
  }

  novoFornecedor() {
    // Lógica para adicionar novo fornecedor
    // Redirecionar ou abrir um modal para adicionar um novo fornecedor
  }

  async getSuppliers() {
    this.fornecedorService.getSuppliers().subscribe({
      next: (response: any) => {
        this.fornecedores = response;
        this.fornecedoresFiltrados = this.fornecedores; 
      },
      error: (error: any) => {
        this.presentToast('Falha ao recuperar fornecedores', 'danger');
      },
    });
  }

  salvarAlteracoes() {
    const pedidoData = this.updatePedidoForm.value;
    console.log(this.pedido);

    if (this.updatePedidoForm.valid) {
      this.pedidoService.updatePedido(pedidoData, this.pedido.cod).subscribe({
        next: (response) => {
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

  filtrarFornecedor() {
    this.fornecedoresFiltrados = this.fornecedores.filter((fornecedor) =>
      fornecedor.nome
        .toLowerCase()
        .includes(this.updatePedidoForm.get('cnpj_fornecedor')!.value.toLowerCase())
    );
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
