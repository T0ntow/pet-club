import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { ClientService } from 'src/app/services/client.service';
import { PetService } from 'src/app/services/pet.service';
import { NovoClienteComponent } from '../../clientes-modal/novo-cliente/novo-cliente.component';
@Component({
  selector: 'app-novo-pet',
  templateUrl: './novo-pet.component.html',
  styleUrls: ['./novo-pet.component.scss'],
})

export class NovoPetComponent implements OnInit {
  newPetForm: FormGroup;

  tutores: { nome: string, email: string, telefone: string, cpf: string, endereco: string }[] = [];
  searchTerm: string = '';

  filteredTutores: { nome: string, email: string, telefone: string, cpf: string, endereco: string }[] = [];
  selectedTutor: any; // Tutor selecionado no ion-select

  constructor(
    private modalCtrl: ModalController,
    private toastController: ToastController,
    private petService: PetService,
    private formBuilder: FormBuilder,
    private clienteService: ClientService,
  ) {
    this.newPetForm = this.formBuilder.group({
      nome: ['', [Validators.required]],
      especie: ['', [Validators.required]],
      raca: ['', [Validators.required]],
      cor: ['', [Validators.required]],
      nascimento: ['', [Validators.required]],
      genero: ['', [Validators.required]],
      tutor: ['', [Validators.required]],
    })
  }

  ngOnInit() {
    this.getClients()
  }

  fecharModal() {
    this.modalCtrl.dismiss();
  }

  filterTutors() {
    this.filteredTutores = this.tutores.filter(tutor =>
      tutor.nome.toLowerCase().includes(this.newPetForm.get('tutor')!.value.toLowerCase())
    );
  }

  getClients() {
    this.clienteService.getClients().subscribe({
      next: async (response: any) => {
        this.tutores = response
        this.filteredTutores = this.tutores
      },
      error: async (error: any) => {
        console.log("Falha ao recuperar clientes", error);
      }
    })
  }

  async salvarAlteracoes() {
    const petData = this.newPetForm.value;

    if (this.newPetForm.valid) {
      this.petService.newPet(petData).subscribe({
        next: async (response: any) => {
          this.petService.updateObservablePets();
          this.modalCtrl.dismiss();
          await this.presentToast("Pet cadastrado com sucesso", "success")
        },
        error: async (error: any) => {
          await this.presentToast("Falha ao adicionar pet", "danger")
        }
      })
    } else {
      await this.presentToast("Preencha o formulário corretamente", "danger")
    }
  }

  async presentToast(text: string, color: string) {
    const toast = await this.toastController.create({
      message: text,
      duration: 1800,
      color: color
    });

    await toast.present();
  }

  async newClient() {
    const modal = await this.modalCtrl.create({
      component: NovoClienteComponent
    });

    modal.onDidDismiss().then((data) => {
      console.log('Clientes atualizados:', data.data);
      this.getClients()
    });

    await modal.present();

  }
}
