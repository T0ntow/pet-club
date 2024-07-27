// pedido.page.ts
import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController, AlertController, ModalController } from '@ionic/angular';
import { NovoPedidoComponent } from 'src/app/modals/pedidos-modal/novo-pedido/novo-pedido.component';
import { PedidoService } from 'src/app/services/pedido.service';
import { EditarPedidoComponent } from 'src/app/modals/pedidos-modal/editar-pedido/editar-pedido.component';
import { lastValueFrom } from 'rxjs';
import { SupplierService } from 'src/app/services/supplier.service';
import { FornecedorDoPedidoComponent } from 'src/app/modals/fornecedor-do-pedido/fornecedor-do-pedido.component';
import { ProdutoDoPedidoComponent } from 'src/app/modals/produto-do-pedido/produto-do-pedido.component';
interface Pedido {
  cod: string;
  cnpj_fornecedor: string;
  data_pedido: Date;
  previsao_entrega: Date;
  metodo_entrega: string;
  observacoes: string;
  valor_total: number;
  status_pedido: string;
  fornecedor?: Fornecedor;
  produtos?: Produto[]; // Adiciona a lista de produtos
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

interface Produto {
  cod: string;
  nome: string;
  descricao: string;
  preco: number;
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
    private pedidoService: PedidoService,
    private fornecedoresService: SupplierService
  ) { }

  ngOnInit() {
    this.pedidoService.getObservablePedidos().subscribe(isUpdated => {
      this.getPedidosAndFornecedores();
    });

    this.getPedidosAndFornecedores();

    console.log(this.pedidos);
    
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

      this.pedidos = pedidosResponse || [];
      this.fornecedores = fornecedoresResponse || [];
      this.pedidosFiltrados = this.pedidos;
      this.temPedido = this.pedidosFiltrados.length > 0;

      this.associatePedidosWithFornecedores();
      await this.associateProductsWithPedidos(); // Associa produtos aos pedidos
    } catch (error) {
      this.presentToast('Falha ao recuperar pedidos ou fornecedores', 'danger');
    } finally {
      loading.dismiss();
    }
  }

  associatePedidosWithFornecedores() {
    const fornecedorMap = new Map<string, Fornecedor>();
    this.fornecedores.forEach(fornecedor => {
      fornecedorMap.set(fornecedor.cnpj, fornecedor);
    });

    this.pedidos.forEach(pedido => {
      if (fornecedorMap.has(pedido.cnpj_fornecedor)) {
        pedido.fornecedor = fornecedorMap.get(pedido.cnpj_fornecedor);
      }
    });

    this.pedidosFiltrados = this.pedidos;
    console.log(this.pedidosFiltrados);
  }

  async associateProductsWithPedidos() {
    for (const pedido of this.pedidos) {
      try {
        const produtos = await lastValueFrom(this.pedidoService.getProductsByOrder(pedido.cod)) as Produto[];
        pedido.produtos = produtos || [];
        console.log(pedido.produtos);
        
      } catch (error) {
        console.error(`Erro ao recuperar produtos do pedido ${pedido.cod}:`, error);
      }
    }
  }

  searchPedidos() {
    this.pedidosFiltrados = this.pedidos.filter(pedido =>
      pedido.observacoes.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      pedido.metodo_entrega.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      pedido.status_pedido.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    this.temPedido = this.pedidosFiltrados.length > 0;
  }

  async abrirModalFornecedor(fornecedor: Fornecedor | undefined) {
    console.log(fornecedor);
    
    const modal = await this.modalCtrl.create({
      component: FornecedorDoPedidoComponent,
      componentProps: { fornecedor: fornecedor },
    });

    return await modal.present();
  }

  async abrirlModalProduto(produto: Produto | undefined) {
    console.log(produto);
    
    const modal = await this.modalCtrl.create({
      component: ProdutoDoPedidoComponent,
      componentProps: { produto: produto },
    });

    return await modal.present();
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
          handler: () => { 
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

  async presentToast(text: string, color: string) {
    const toast = await this.toastController.create({
      message: text,
      duration: 1800,
      color: color
    });

    await toast.present();
  }
}
