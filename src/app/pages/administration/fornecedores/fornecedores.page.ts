import { Component, OnInit } from '@angular/core';
import { NovoFornecedorComponent } from 'src/app/modals/fornecedores-modal/novo-fornecedor/novo-fornecedor.component';
import { LoadingController, ToastController, AlertController, ModalController } from '@ionic/angular';
import { SupplierService } from 'src/app/services/supplier.service';
import { EditarFornecedorComponent } from 'src/app/modals/fornecedores-modal/editar-fornecedor/editar-fornecedor.component';
import { PedidoService } from 'src/app/services/pedido.service';
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
  selector: 'app-fornecedores',
  templateUrl: './fornecedores.page.html',
  styleUrls: ['./fornecedores.page.scss'],
})

export class FornecedoresPage implements OnInit {
  fornecedores: Fornecedor[] = [];
  fornecedoresFiltrados: Fornecedor[] = [];
  searchTerm: string = '';
  temFornecedor: boolean = true;

  constructor(
    private alertController: AlertController,
    private modalCtrl: ModalController,
    private supplierService: SupplierService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private pedidoService: PedidoService
  ) { }

  formatarCnpj(cnpj: string): string {
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  }

  formatarTelefone(telefone: string): string {
    return telefone.replace(/^(\d{2})(\d{1})(\d{4})(\d{4})$/, "($1) $2 $3-$4");
  }

  searchSupplier() {
    this.fornecedoresFiltrados = this.fornecedores.filter(fornecedor =>
      fornecedor.representante.toLowerCase().includes(this.searchTerm) ||
      fornecedor.nome.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    this.temFornecedor = this.fornecedoresFiltrados.length > 0;
  }

  ngOnInit() {
    this.supplierService.getObservableSuppliers().subscribe(isUpdated => {
      this.getSuppliers();
    });

    this.getSuppliers();
  }

  async getSuppliers() {
    const loading = await this.loadingController.create({
      message: 'Carregando fornecedores...',
      spinner: 'crescent',
      translucent: true,
    });

    await loading.present();

    this.supplierService.getSuppliers().subscribe({
      next: (response: any) => {
        this.fornecedores = response;
        this.fornecedoresFiltrados = this.fornecedores
        this.temFornecedor = this.fornecedoresFiltrados.length > 0;

        loading.dismiss();
      },
      error: (error: any) => {
        this.presentToast('Falha ao recuperar fornecedores', 'danger');
        loading.dismiss();
      },
    });
  }

  async deleteSupplier(fornecedor: Fornecedor) {
    const alert = await this.alertController.create({
      header: 'Atenção',
      message: 'Tem certeza de que deseja excluir este fornecedor? Esta ação é irreversível.',

      buttons: [
        {
          text: 'cancelar',
          cssClass: 'alert-button-cancel',
        },
        {
          text: 'continuar',
          cssClass: 'alert-button-confirm',
          handler: () => {
            this.confirmSupplierDelete(fornecedor);
          },
        },
      ],
    });

    await alert.present();
  }

  confirmSupplierDelete(fornecedor: Fornecedor) {
    console.log("fornecedor", fornecedor);

    this.supplierService.deleteSupplier(fornecedor.cnpj).subscribe({
      next: async (response: any) => {
        await this.presentToast('Fornecedor removido com sucesso', 'success');
        this.supplierService.updateObservableSuppliers();
        this.pedidoService.updateObservablePedidos();
      },
      error: (error: any) => {
        console.error('Falha ao remover fornecedor:', error);
        if(error.error = "FORNECEDOR_ASSOCIADO_A_PEDIDOS") {
          this.presentToast("Existem pedidos associados a este fornecedor", "danger")
        }
      },
    });
  }

  async atualizarFornecedor(fornecedor: Fornecedor) {
    const modal = await this.modalCtrl.create({
      component: EditarFornecedorComponent,
      componentProps: { fornecedor: fornecedor },
    });

    return await modal.present();
  }

  async adicionarFornecedor() {
    const modal = await this.modalCtrl.create({
      component: NovoFornecedorComponent,
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
