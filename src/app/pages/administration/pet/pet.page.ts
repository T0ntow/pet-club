import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { EditarPetComponent } from 'src/app/modals/pet-modal/editar-pet/editar-pet.component';
import { NovoPetComponent } from 'src/app/modals/pet-modal/novo-pet/novo-pet.component';
import { PetService } from 'src/app/services/pet.service';

interface Pet {
  cpf: string;
  cod: string;
  nome: string;
  especie: string;
  raca: string;
  nascimento: string;
  genero: string;
  cor: string;
}

@Component({
  selector: 'app-pet',
  templateUrl: './pet.page.html',
  styleUrls: ['./pet.page.scss'],
})

export class PetPage implements OnInit {
  pets: Pet[] = [];
  petsFiltrados: Pet[] = [];
  searchTerm: string = '';
  temPet: boolean = true;

  constructor(
    private alertController: AlertController,
    private modalCtrl: ModalController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private petService: PetService
  ) { }

  ngOnInit() {
    this.petService.getObservablePets().subscribe(isUpdated => {
      this.getPets()
    })

    this.getPets()
  }

  searchPet() {
    this.petsFiltrados = this.pets.filter(pet =>
      pet.nome.toLowerCase().includes(this.searchTerm) || 
      pet.especie.toLowerCase().includes(this.searchTerm)

    );

    this.temPet = this.petsFiltrados.length > 0;
  }

  async getPets() {
    const loading = await this.loadingController.create({
      message: 'Carregando pets...',
      spinner: 'crescent',
      translucent: true,
    });

    await loading.present();

    this.petService.getPets().subscribe({
      next: (response: any) => {
        this.pets = response;
        this.petsFiltrados = this.pets;

        loading.dismiss();
      },
      error: (error: any) => {
        this.presentToast('Falha ao recuperar pets', "danger")
        loading.dismiss();
      },
    });
  }

  removerPet(pet: Pet) {
    this.presentAlertRemove(pet);
  }

  deletePet(pet: Pet) {
    this.petService.deletePet(pet.cod).subscribe({
      next: async (response: any) => {
        await this.presentToast('Pet removido com sucesso', "success")
        this.petService.updateObservablePets()
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

  async presentToast(text: string, color: string,) {
    const toast = await this.toastController.create({
      message: text,
      duration: 1800,
      color: color
    });

    await toast.present();
  }

}
