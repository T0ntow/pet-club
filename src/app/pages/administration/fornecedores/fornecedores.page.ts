import { Component, OnInit } from '@angular/core';
import { NovoFornecedorComponent } from 'src/app/modals/fornecedores-modal/novo-fornecedor/novo-fornecedor.component';
import { LoadingController, ToastController, AlertController, ModalController } from '@ionic/angular';
import { SupplierService } from 'src/app/services/supplier.service';

@Component({
  selector: 'app-fornecedores',
  templateUrl: './fornecedores.page.html',
  styleUrls: ['./fornecedores.page.scss'],
})
export class FornecedoresPage implements OnInit {

  // Atualize o modelo do fornecedor
  fornecedores: { cnpj: string, email: string, endereco: string, nome_empresa: string, representante: string, telefone: string, id: number }[] = [];
  searchTerm: string = '';

  fornecedoresFiltrados: { cnpj: string, email: string, endereco: string, nome_empresa: string, representante: string, telefone: string, id: number }[] = [];
  temFornecedor: boolean = true;

  // Atualize o serviço de fornecedores
  constructor(
    private alertController: AlertController,
    private modalCtrl: ModalController,
    private supplierService: SupplierService, // Você precisa criar um serviço para fornecedores ou ajustar o existente
    private loadingController: LoadingController,
    private toastController: ToastController,
  ) { }

  searchSupplier() {
    this.fornecedoresFiltrados = this.fornecedores.filter(fornecedor =>
      fornecedor.representante.toLowerCase().includes(this.searchTerm) || fornecedor.nome_empresa.toLowerCase().includes(this.searchTerm)
    );

    if (this.fornecedoresFiltrados.length === 0) {
      this.temFornecedor = false
    } else {
      this.temFornecedor = true
    }
  }

  // Atualize o método ngOnInit para chamar getSuppliers
  ngOnInit() {
    this.supplierService.getObservableSuppliers().subscribe(isUpdated => {
      this.getSuppliers();
    });

    this.getSuppliers();
  }

  // Atualize o método getEmployees para getSuppliers
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

        loading.dismiss();
      },
      error: (error: any) => {
        this.presentToast('Falha ao recuperar fornecedores', 'danger');
        loading.dismiss();
      },
    });
  }

  // Atualize o método removerfornecedor para removerFornecedor
  removerFornecedor(fornecedor: any) {
    this.presentAlertRemove(fornecedor);
  }

  // Atualize o método deleteEmployee para deleteSupplier
  deleteSupplier(fornecedor: any) {
    this.supplierService.deleteSupplier(fornecedor.id).subscribe({
      next: async (response: any) => {
        await this.presentToast('Fornecedor removido com sucesso', 'success');
        this.supplierService.updateObservableSuppliers();
      },
      error: (error: any) => {
        console.error('Falha ao remover fornecedor:', error);
      },
    });
  }

  // Atualize o método alterarFuncionario para alterarFornecedor
  async alterarFornecedor(fornecedor: any) {
    // const modal = await this.modalCtrl.create({
    //   component: EditarFornecedorComponent,
    //   componentProps: { fornecedor: fornecedor },
    // });

    // modal.onDidDismiss().then((data) => {
    //   console.log('Dados do fornecedor atualizados:', data.data);
    // });

    // return await modal.present();
  }

  // Atualize o método adicionarFuncionario para adicionarFornecedor
  async adicionarFornecedor() {
    const modal = await this.modalCtrl.create({
      component: NovoFornecedorComponent,
    });

    modal.onDidDismiss().then((data) => {
      console.log('Dados do fornecedor adicionados:', data.data);
    });

    return await modal.present();
  }

  async presentAlertRemove(fornecedor: any) {
    const alert = await this.alertController.create({
      header: 'Atenção',
      message: 'Você tem certeza de que deseja excluir este fornecedor? Ele será removido permanentemente.',
      buttons: [
        {
          text: 'cancelar',
          cssClass: 'alert-button-cancel',
        },
        {
          text: 'continuar',
          cssClass: 'alert-button-confirm',
          handler: () => { // Adiciona um handler para o botão 'continuar'
            this.deleteSupplier(fornecedor);
          },
        },
      ],
    });

    await alert.present();
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
