import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { PetService } from 'src/app/services/pet.service';
import { ClientService } from 'src/app/services/client.service';
import { NovoClienteComponent } from '../../clientes-modal/novo-cliente/novo-cliente.component';

@Component({
  selector: 'app-editar-pet',
  templateUrl: './editar-pet.component.html',
  styleUrls: ['./editar-pet.component.scss'],
})
export class EditarPetComponent implements OnInit {
  @Input() pet: any;
  updatePetForm: FormGroup = new FormGroup({});

  tutores: {
    nome: string;
    email: string;
    telefone: string;
    cpf: string;
    endereco: string;
  }[] = [];
  searchTerm: string = '';

  filteredTutores: {
    nome: string;
    email: string;
    telefone: string;
    cpf: string;
    endereco: string;
  }[] = [];
  selectedTutor: any;

  constructor(
    private modalCtrl: ModalController,
    private toastController: ToastController,
    private formBuilder: FormBuilder,
    private petService: PetService,
    private clienteService: ClientService
  ) {}

  ngOnInit() {
    this.getClients();
    this.updatePetForm = this.formBuilder.group({
      id: [this.pet.cod, [Validators.required]],
      nome: [this.pet.nome, [Validators.required]],
      especie: [this.pet.especie, [Validators.required]],
      raca: [this.pet.raca, [Validators.required]],
      cor: [this.pet.cor, [Validators.required]],
      nascimento: [this.formatarData(this.pet.nascimento), [Validators.required]],
      genero: [this.pet.genero, [Validators.required]],
      tutor: [this.pet.cpf_cliente, [Validators.required]],
    });
  }

  formatarData(data: string): string {
    const dateFormatTed = data.split("T");
    return dateFormatTed[0];
  }

  fecharModal() {
    this.modalCtrl.dismiss();
  }

  filterTutors() {
    this.filteredTutores = this.tutores.filter((tutor) =>
      tutor.nome
        .toLowerCase()
        .includes(this.updatePetForm.get('tutor')!.value.toLowerCase())
    );
  }

  getClients() {
    this.clienteService.getClients().subscribe({
      next: async (response: any) => {
        this.tutores = response;
        this.filteredTutores = this.tutores;
      },
      error: async (error: any) => {
        console.log('Falha ao recuperar clientes', error);
      },
    });
  }

  salvarAlteracoes() {
    const petData = this.updatePetForm.value;

    if (this.updatePetForm.valid) {
      this.petService.updatePet(petData, petData.id).subscribe({
        next: (response) => {
          this.petService.updateObservablePets();
          this.clienteService.updateObservableClients();
          this.modalCtrl.dismiss(null, 'confirm');
          this.presentToast('Pet atualizado com sucesso', 'success');
        },
        error: (error) => {
          console.error('Erro ao atualizar o pet:', error);
          this.presentToast('Erro ao atualizar pet', 'danger');
        },
      });
    } else {
      this.presentToast('Preencha o formulário corretamente', 'danger');
    }
  }

  async presentToast(text: string, color: string) {
    const toast = await this.toastController.create({
      message: text,
      duration: 1800,
      color: color,
    });

    await toast.present();
  }

  async newClient() {
    const modal = await this.modalCtrl.create({
      component: NovoClienteComponent,
    });
    
    await modal.present();
  }
}
