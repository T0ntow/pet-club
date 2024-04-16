import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController, AlertController, ModalController } from '@ionic/angular';
import { ClientService } from 'src/app/services/client.service';
import { NovoClienteComponent } from 'src/app/modals/clientes-modal/novo-cliente/novo-cliente.component';
import { EditarClienteComponent } from 'src/app/modals/clientes-modal/editar-cliente/editar-cliente.component';

interface Cliente {
  cpf: string; //pk
  nome: string;
  email: string;
  endereco: string;
  fone: string;
}

@Component({
  selector: 'app-clients',
  templateUrl: './clients.page.html',
  styleUrls: ['./clients.page.scss'],
})
export class ClientsPage implements OnInit {
  // Atualize o modelo do fornecedor
  clientes: Cliente[] = [];

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

  formatarCpf(cpf: string) {
    cpf = cpf.replace(/\D/g, '');
    
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    
    return cpf;
  }

  formatarTelefone(telefone: string): string {
    return telefone.replace(/^(\d{2})(\d{1})(\d{4})(\d{4})$/, "($1) $2 $3-$4");
  }

  async getClients() {
    const loading = await this.loadingController.create({
      message: 'Carregando clientes...',
      spinner: 'crescent',
      translucent: true,
    });

    await loading.present();

    this.clientService.getClients().subscribe({
      next: (response: any) => {
        this.clientes = response;
        loading.dismiss();
      },
      error: (error: any) => {
        this.presentToast("Falha ao recuperar clientes", "danger")
        loading.dismiss();
      },
    });
  }

  confirmClientDelete(cliente: Cliente) {
    this.clientService.deleteClient(cliente.cpf).subscribe({
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

  async atualizarCliente(cliente: Cliente) {
    const modal = await this.modalCtrl.create({
      component: EditarClienteComponent,
      componentProps: { cliente: cliente },
    });

    return await modal.present();
  }

  // Atualize o método adicionarFuncionario para adicionarCliente
  async adicionarCliente() {
    const modal = await this.modalCtrl.create({
      component: NovoClienteComponent,
    });

    return await modal.present();
  }

  async deleteClient(cliente: Cliente) {
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
            this.confirmClientDelete(cliente);
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
