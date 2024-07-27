import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { EditarPetComponent } from 'src/app/modals/pet-modal/editar-pet/editar-pet.component';
import { NovoPetComponent } from 'src/app/modals/pet-modal/novo-pet/novo-pet.component';
import { ClientService } from 'src/app/services/client.service';
import { PetService } from 'src/app/services/pet.service';

import { TutorDoPetComponent } from 'src/app/modals/tutor-do-pet/tutor-do-pet.component';

interface Cliente {
  cpf: string; // pk
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
  selector: 'app-pet',
  templateUrl: './pet.page.html',
  styleUrls: ['./pet.page.scss'],
})

export class PetPage implements OnInit {
  pets: Pet[] = [];
  tutores: Cliente[] = [];
  petsFiltrados: Pet[] = [];
  searchTerm: string = '';
  temPet: boolean = true;

  constructor(
    private alertController: AlertController,
    private modalCtrl: ModalController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private petService: PetService,
    private clientService: ClientService
  ) { }

  ngOnInit() {
    this.petService.getObservablePets().subscribe(isUpdated => {
      this.getPetsAndClients()
    })
    
    this.getPetsAndClients()
  }

  loadPets(): void {
    this.petService.getPets().subscribe((isUpdated) => {
      this.getPetsAndClients()
    });
  }

  searchPet() {
    this.petsFiltrados = this.pets.filter(pet =>
      pet.nome.toLowerCase().includes(this.searchTerm) || 
      pet.especie.toLowerCase().includes(this.searchTerm) || 
      pet.tutor?.nome.toLowerCase().includes(this.searchTerm)
    );

    this.temPet = this.petsFiltrados.length > 0;
  }

  async getPetsAndClients() {
    const loading = await this.loadingController.create({
      message: 'Carregando pets e clientes...',
      spinner: 'crescent',
      translucent: true,
    });
  
    await loading.present();
  
    try {
      const [petsResponse, clientsResponse] = await Promise.all([
        lastValueFrom(this.petService.getPets()) as Promise<Pet[]>,
        lastValueFrom(this.clientService.getClients()) as Promise<Cliente[]>
      ]);
  
      // Garante que os arrays pets e tutores não sejam undefined
      this.pets = petsResponse || [];
      this.tutores = clientsResponse || [];
      this.petsFiltrados = this.pets;
      this.temPet = this.petsFiltrados.length > 0;

      this.associatePetsWithTutors();
    } catch (error) {
      this.presentToast('Falha ao recuperar pets ou clientes', 'danger');
    } finally {
      loading.dismiss();
    }
  }
  
  associatePetsWithTutors() {
    const tutorMap = new Map<string, Cliente>();
    // Cria um mapa dos tutores com o CPF como chave
    this.tutores.forEach(tutor => {
      tutorMap.set(tutor.cpf, tutor);
    });
  
    // Associa cada pet ao seu respectivo tutor
    this.pets.forEach(pet => {
      if (tutorMap.has(pet.cpf_cliente)) {
        pet.tutor = tutorMap.get(pet.cpf_cliente);
      }
    });
  
    // Atualiza a lista de pets filtrados se necessário
    this.petsFiltrados = this.pets;
    console.log(this.pets);
  }

  removerPet(pet: Pet) {
    this.presentAlertRemove(pet);
  }

  deletePet(pet: Pet) {
    this.petService.deletePet(pet.cod).subscribe({
      next: async (response: any) => {
        await this.presentToast('Pet removido com sucesso', "success")
        this.petService.updateObservablePets()
        this.clientService.updateObservableClients()
      },
      error: (error: any) => {
        console.error('Falha ao remover pet:', error);
      },
    });
  }

  async presentAlertRemove(pet: any) {
    const alert = await this.alertController.create({
      header: 'Atenção',
      message: 'Você tem certeza de que deseja excluir este funcionário? Ele será removido permanentemente.',
      buttons: [
        {
          text: 'cancelar',
          cssClass: 'alert-button-cancel',
        },
        {
          text: 'continuar',
          cssClass: 'alert-button-confirm',
          handler: () => { // Adiciona um handler para o botão 'continuar'
            this.deletePet(pet);
          },
        },
      ],
    });

    await alert.present();
  }

  async adicionarPet() {
    const modal = await this.modalCtrl.create({
      component: NovoPetComponent,
    });

    return await modal.present();
  }

  async atualizarPet(pet: Pet) {
    const modal = await this.modalCtrl.create({
      component: EditarPetComponent,
      componentProps: {pet: pet},
    });

    return await modal.present();
  }

  async abrirModalTutor(cliente: Cliente | undefined) {
    const modal = await this.modalCtrl.create({
      component: TutorDoPetComponent,
      componentProps: {cliente: cliente},
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
