import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController, AlertController, ModalController } from '@ionic/angular';
import { ClientService } from 'src/app/services/client.service';
import { NovoClienteComponent } from 'src/app/modals/clientes-modal/novo-cliente/novo-cliente.component';
import { EditarClienteComponent } from 'src/app/modals/clientes-modal/editar-cliente/editar-cliente.component';
import { lastValueFrom } from 'rxjs';
import { PetService } from 'src/app/services/pet.service';
import { PetDoTutorComponent } from 'src/app/modals/pet-do-tutor/pet-do-tutor.component';

interface Cliente {
  cpf: string; //pk
  nome: string;
  email: string;
  endereco: string;
  fone: string;
}

interface Pet {
  cpf_cliente: string;
  cod: string;
  nome: string;
  especie: string;
  raca: string;
  nascimento: string;
  genero: string;
  cor: string;
  tutor?: Cliente; // Adicionado para associar o tutor
}

@Component({
  selector: 'app-clients',
  templateUrl: './clients.page.html',
  styleUrls: ['./clients.page.scss'],
})
export class ClientsPage implements OnInit {
  clientes: Cliente[] = [];
  pets: Pet[] = [];

  clientesFiltrados: Cliente[] = [];
  searchTerm: string = '';
  temCliente: boolean = true;

  constructor(
    private alertController: AlertController,
    private modalCtrl: ModalController,
    private clientService: ClientService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private petService: PetService,
  ) { }

  ngOnInit() {
    this.clientService.getObservableClients().subscribe(() => {
      this.getPetsAndClients();
    });
    this.getPetsAndClients();
  }

  searchClients() {
    const term = this.searchTerm.toLowerCase();
    this.clientesFiltrados = this.clientes.filter(cliente =>
      cliente.nome.toLowerCase().includes(term) || 
      cliente.cpf.toLowerCase().includes(term) || 
      this.getPetsByCliente(cliente.cpf).some(pet => pet.nome.toLowerCase().includes(term))
    );

    this.temCliente = this.clientesFiltrados.length > 0;
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

  async getPetsAndClients() {
    const loading = await this.loadingController.create({
      message: 'Carregando pets e clientes...',
      spinner: 'crescent',
      translucent: true,
    });

    await loading.present();

    try {
      // Faz a chamada para os serviços e aguarda as respostas
      const [petsResponse, clientsResponse] = await Promise.all([
        lastValueFrom(this.petService.getPets()) as Promise<Pet[]>,
        lastValueFrom(this.clientService.getClients()) as Promise<Cliente[]>
      ]);

      // Garante que os arrays pets e clientes não sejam undefined
      this.pets = petsResponse || [];
      this.clientes = clientsResponse || [];
      this.clientesFiltrados = this.clientes;
      this.temCliente = this.clientesFiltrados.length > 0;

      this.associatePetsWithTutors();
    } catch (error) {
      // Exibe uma mensagem de erro
      this.presentToast('Falha ao recuperar pets ou clientes', 'danger');
    } finally {
      // Encerra o carregamento
      loading.dismiss();
    }
  }
  
  getPetsByCliente(cpf: string): Pet[] {
    return this.pets.filter(pet => pet.cpf_cliente === cpf);
  }

  associatePetsWithTutors() {
    const tutorMap = new Map<string, Cliente>();

    // Cria um mapa dos tutores com o CPF como chave
    this.clientes.forEach(tutor => {
      tutorMap.set(tutor.cpf, tutor);
    });

    // Associa cada pet ao seu respectivo tutor
    this.pets.forEach(pet => {
      if (tutorMap.has(pet.cpf_cliente)) {
        pet.tutor = tutorMap.get(pet.cpf_cliente);
      }
    });
  }

  confirmClientDelete(cliente: Cliente) {
    this.clientService.deleteClient(cliente.cpf).subscribe({
      next: async (response: any) => {
        console.log('Cliente removido com sucesso:', response);
        await this.presentToast('Cliente removido com sucesso', 'success');
        this.clientService.updateObservableClients();
        this.petService.updateObservablePets();
      },
      error: (error: any) => {
        console.error('Falha ao remover cliente:', error);
        if (error.error = "Não é possível excluir o cliente, pois há pets associados") {
          this.presentToast("Não é possível excluir o cliente, pois há pets associados", "danger");
        }
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

  async abrirModalPet(pet: Pet | undefined) {
    const modal = await this.modalCtrl.create({
      component: PetDoTutorComponent,
      componentProps: { pet: pet },
    });

    return await modal.present();
  }

  async deleteClient(cliente: Cliente) {
    const alert = await this.alertController.create({
      header: 'Atenção',
      message: 'Tem certeza de que deseja excluir este cliente? Esta ação é irreversível.',
      buttons: [
        {
          text: 'Cancelar',
          cssClass: 'alert-button-cancel',
        },
        {
          text: 'Continuar',
          cssClass: 'alert-button-confirm',
          handler: () => { // Adiciona um handler para o botão 'continuar'
            this.confirmClientDelete(cliente);
          },
        },
      ],
    });

    await alert.present();
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
