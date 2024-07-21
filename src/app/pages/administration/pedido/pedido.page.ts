import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController, AlertController, ModalController } from '@ionic/angular';
import { NovoPedidoComponent } from 'src/app/modals/pedidos-modal/novo-pedido/novo-pedido.component';
import { PetService } from 'src/app/services/pet.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { EditarPedidoComponent } from 'src/app/modals/pedidos-modal/editar-pedido/editar-pedido.component';
import { lastValueFrom } from 'rxjs';
import { SupplierService } from 'src/app/services/supplier.service';
import { FornecedorDoPedidoComponent } from 'src/app/modals/fornecedor-do-pedido/fornecedor-do-pedido.component';


interface Pedido {
  cod: string;                    // Código do pedido (INT AI PK)
  cnpj_fornecedor: string;        // CNPJ do fornecedor (CHAR(14))
  data_pedido: Date;              // Data do pedido (DATE)
  previsao_entrega: Date;         // Previsão de entrega (DATE)
  metodo_entrega: string;         // Método de entrega (VARCHAR(20))
  observacoes: string;            // Observações (VARCHAR(255))
  valor_total: number;            // Valor total (DECIMAL(8,2))
  status_pedido: string;          // Status do pedido (VARCHAR(10))
  fornecedor?: Fornecedor;  // A propriedade opcional para associar o fornecedor
}

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
  selector: 'app-pedido',
  templateUrl: './pedido.page.html',
  styleUrls: ['./pedido.page.scss'],
})
export class PedidoPage implements OnInit {
  searchTerm: string = '';
  pedidosFiltrados: any[] = [];
  temPedido: boolean = true;
  pedidos: Pedido[] = [];
  fornecedores: Fornecedor[] = [];

  constructor(
    private alertController: AlertController,
    private modalCtrl: ModalController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private petService: PetService,
    private pedidoService: PedidoService,
    private fornecedoresService: SupplierService
  ) { }

  ngOnInit() {
    this.pedidoService.getObservablePedidos().subscribe(isUpdated => {
      this.getPedidosAndFornecedores();
    });

    this.getPedidosAndFornecedores();
  }

  async getPedidosAndFornecedores() {
    const loading = await this.loadingController.create({
      message: 'Carregando pedidos e fornecedores...',
      spinner: 'crescent',
      translucent: true,
    });

    await loading.present();

    try {
      const [pedidosResponse, fornecedoresResponse] = await Promise.all([
        lastValueFrom(this.pedidoService.getPedidos()) as Promise<Pedido[]>,
        lastValueFrom(this.fornecedoresService.getSuppliers()) as Promise<Fornecedor[]>
      ]);

      // Garante que os arrays pets e tutores não sejam undefined
      this.pedidos = pedidosResponse || [];
      this.fornecedores = fornecedoresResponse || [];
      this.pedidosFiltrados = this.pedidos;
      this.temPedido = this.pedidosFiltrados.length > 0;

      this.associatePedidosWithFornecedores();
    } catch (error) {
      this.presentToast('Falha ao recuperar pets ou clientes', 'danger');
    } finally {
      loading.dismiss();
    }
  }

  associatePedidosWithFornecedores() {
    const fornecedorMap = new Map<string, Fornecedor>();
    // Cria um mapa dos fornecedores com o CNPJ como chave
    this.fornecedores.forEach(fornecedor => {
      fornecedorMap.set(fornecedor.cnpj, fornecedor);
    });

    // Associa cada pedido ao seu respectivo fornecedor
    this.pedidos.forEach(pedido => {
      if (fornecedorMap.has(pedido.cnpj_fornecedor)) {
        pedido.fornecedor = fornecedorMap.get(pedido.cnpj_fornecedor);
      }
    });

    // Atualiza a lista de pedidos filtrados se necessário
    this.pedidosFiltrados = this.pedidos;
    console.log(this.pedidosFiltrados);
  }


  async getPedidos() {
    console.log("chegou ca");

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
  
  async abrirModalFornecedor(fornecedor: Fornecedor | undefined) {
    const modal = await this.modalCtrl.create({
      component: FornecedorDoPedidoComponent,
      componentProps: {fornecedor: fornecedor},
    });
    
    return await modal.present();
  }

  searchPedidos() {
    this.pedidosFiltrados = this.pedidos.filter(pedido =>
      pedido.observacoes.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      pedido.metodo_entrega.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      pedido.status_pedido.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    this.temPedido = this.pedidosFiltrados.length > 0;
  }

  async adicionarPedido() {
    const modal = await this.modalCtrl.create({
      component: NovoPedidoComponent,
    });

    return await modal.present();
  }

  async removerPedido(pedido: Pedido) {
    const alert = await this.alertController.create({
      header: 'Atenção',
      message: 'Você tem certeza de que deseja excluir este pedido? Ele será removido permanentemente.',
      buttons: [
        {
          text: 'cancelar',
          cssClass: 'alert-button-cancel',
        },
        {
          text: 'continuar',
          cssClass: 'alert-button-confirm',
          handler: () => { // Adiciona um handler para o botão 'continuar'
            this.confirmPedidoDelete(pedido);
          },
        },
      ],
    });

    await alert.present();
  }

  confirmPedidoDelete(pedido: Pedido) {
    console.log(pedido);

    this.pedidoService.deletePedido(pedido.cod).subscribe({
      next: async (response: any) => {
        console.log('Pedido removido com sucesso:', response);
        await this.presentToast('Pedido removido com sucesso', 'success');
        this.pedidoService.updateObservablePedidos();
      },
      error: (error: any) => {
        console.error('Falha ao remover pedido:', error);
      },
    });
  }

  async alterarPedido(pedido: Pedido) {
    const modal = await this.modalCtrl.create({
      component: EditarPedidoComponent,
      componentProps: { pedido: pedido },
    });
    return await modal.present();
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