import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController, AlertController, ModalController } from '@ionic/angular';
import { NovoClienteComponent } from 'src/app/modals/clientes-modal/novo-cliente/novo-cliente.component';
import { NovoPedidoComponent } from 'src/app/modals/pedidos-modal/novo-pedido/novo-pedido.component';
import { PetService } from 'src/app/services/pet.service';
import { PedidoService } from 'src/app/services/pedido.service';
export interface Pedido {
  cod: number;                    // Código do pedido (INT AI PK)
  cnpj_fornecedor: string;        // CNPJ do fornecedor (CHAR(14))
  data_pedido: Date;              // Data do pedido (DATE)
  previsao_entrega: Date;         // Previsão de entrega (DATE)
  metodo_entrega: string;         // Método de entrega (VARCHAR(20))
  observacoes: string;            // Observações (VARCHAR(255))
  valor_total: number;            // Valor total (DECIMAL(8,2))
  status_pedido: string;          // Status do pedido (VARCHAR(10))
}

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.page.html',
  styleUrls: ['./pedido.page.scss'],
})
export class PedidoPage implements OnInit {
  searchTerm: string = '';
  pedidosFiltrados: any[] = [];
  temPedido: boolean = true;
  pedidos: Pedido[] = [];

  constructor(
    private alertController: AlertController,
    private modalCtrl: ModalController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private petService: PetService,
    private pedidoService: PedidoService
  ) { }

  ngOnInit() {
    this.pedidoService.getObservablePedidos().subscribe(isUpdated => {
      this.getPedidos();
    });

    this.getPedidos();
  }

  async getPedidos() {
    const loading = await this.loadingController.create({
      message: 'Carregando fornecedores...',
      spinner: 'crescent',
      translucent: true,
    });

    await loading.present();

    this.pedidoService.getPedidos().subscribe({
      next: (response: any) => {
        this.pedidos = response;
        this.pedidosFiltrados = this.pedidos
        this.temPedido = this.pedidosFiltrados.length > 0;

        loading.dismiss();
      },
      error: (error: any) => {
        this.presentToast('Falha ao recuperar fornecedores', 'danger');
        loading.dismiss();
      },
    });
  }

  searchPedidos() {
    // Adicione a lógica de busca aqui
  }

  async adicionarPedido() {
    const modal = await this.modalCtrl.create({
      component: NovoPedidoComponent,
    });

    return await modal.present();
  }

  removerPedido(pedido: any) {
    // Adicione a lógica para remover um pedido aqui
  }

  alterarPedido(pedido: any) {
    // Adicione a lógica para alterar um pedido aqui
  }

  async presentToast(text: string, color: string,) {
    const toast = await this.toastController.create({
      message: text,
      duration: 1800,
      color: color
    });

    await toast.present();
  }

}