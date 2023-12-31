import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { PetService } from 'src/app/services/pet.service';

@Component({
  selector: 'app-novo-pet',
  templateUrl: './novo-pet.component.html',
  styleUrls: ['./novo-pet.component.scss'],
})
export class NovoPetComponent  implements OnInit {
  newPetForm: FormGroup;

  constructor(
    private modalCtrl: ModalController,
    private toastController: ToastController,
    private petService: PetService,
    private formBuilder: FormBuilder
  ) {
    this.newPetForm = this.formBuilder.group({
      nome: ['', [Validators.required]],
      especie: ['', [Validators.required]],
      raca: ['', [Validators.required]],
      cor: ['', [Validators.required]],
      nascimento: ['', [Validators.required]],
      genero: ['', [Validators.required]],
    })
  }

  ngOnInit() {}

  fecharModal() {
    this.modalCtrl.dismiss();
  }

  async salvarAlteracoes() {
    const petData = this.newPetForm.value;

    if(this.newPetForm.valid) {
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

}
