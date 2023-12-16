import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController, AlertController, ModalController } from '@ionic/angular';
import { ClientService } from 'src/services/client.service';
import { NovoClienteComponent } from 'src/app/modals/clientes-modal/novo-cliente/novo-cliente.component';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.page.html',
  styleUrls: ['./clients.page.scss'],
})
export class ClientsPage implements OnInit {
  // Atualize o modelo do fornecedor
  clientes: { nome: string, cnpj: string, email: string, telefone: string, produto: string, endereco: string, id: number }[] = [];

  constructor(
    private alertController: AlertController,
    private modalCtrl: ModalController,
    private clientService: ClientService, // Você precisa criar um serviço para fornecedores ou ajustar o existente
    private loadingController: LoadingController,
    private toastController: ToastController,
  ) { }
  ngOnInit() {
    this.clientService.getObservableClients().subscribe(isUpdated => {
      this.getClients();
    });

    this.getClients();
  }

  // Atualize o método getEmployees para getClients
  async getClients() {
    const loading = await this.loadingController.create({
      message: 'Carregando clientes...',
      spinner: 'crescent',
      translucent: true,
    });

    await loading.present();

    this.clientService.getClients().subscribe({
      next: (response: any) => {
        console.log('Clientes recuperados:', response);
        this.clientes = response;
        loading.dismiss();
      },
      error: (error: any) => {
        console.error('Falha ao recuperar clientes:', error);
        loading.dismiss();
      },
    });
  }

  // Atualize o método removerFuncionario para removerCliente
  removerCliente(cliente: any) {
    this.presentAlertRemove(cliente);
  }

  // Atualize o método deleteEmployee para deleteClient
  deleteClient(cliente: any) {
    this.clientService.deleteClient(cliente.id).subscribe({
      next: async (response: any) => {
        console.log('Cliente removido com sucesso:', response);
        await this.presentToast('Cliente removido com sucesso', 'success');
        this.clientService.updateObservableClients();
      },
      error: (error: any) => {
        console.error('Falha ao remover cliente:', error);
      },
    });
  }

  // Atualize o método alterarFuncionario para alterarCliente
  async alterarCliente(fornecedor: any) {
    // const modal = await this.modalCtrl.create({
    //   component: EditarFornecedorComponent,
    //   componentProps: { fornecedor: fornecedor },
    // });

    // modal.onDidDismiss().then((data) => {
    //   console.log('Dados do fornecedor atualizados:', data.data);
    // });

    // return await modal.present();
  }

  // Atualize o método adicionarFuncionario para adicionarCliente
  async adicionarCliente() {
    const modal = await this.modalCtrl.create({
      component: NovoClienteComponent,
    });

    modal.onDidDismiss().then((data) => {
      console.log('Dados do cliente adicionados:', data.data);
    });

    return await modal.present();
  }

  async presentAlertRemove(cliente: any) {
    const alert = await this.alertController.create({
      header: 'Atenção',
      message: 'Você tem certeza de que deseja excluir este cliente? Ele será removido permanentemente.',
      buttons: [
        {
          text: 'cancelar',
          cssClass: 'alert-button-cancel',
        },
        {
          text: 'continuar',
          cssClass: 'alert-button-confirm',
          handler: () => { // Adiciona um handler para o botão 'continuar'
            this.deleteClient(cliente);
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
