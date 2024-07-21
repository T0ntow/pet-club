import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { FormBuilder } from '@angular/forms';
import { ClientService } from 'src/app/services/client.service';
import { maskitoNumber, maskitoCPF } from '../../../mask'
import { MaskitoElementPredicate } from '@maskito/core';
import { PetService } from 'src/app/services/pet.service';
@Component({
  selector: 'app-novo-cliente',
  templateUrl: './novo-cliente.component.html',
  styleUrls: ['./novo-cliente.component.scss'],
})
export class NovoClienteComponent  implements OnInit {
  readonly maskitoNumber = maskitoNumber;
  readonly maskitoCpf = maskitoCPF;

  readonly maskPredicate: MaskitoElementPredicate = async (el) => (el as HTMLIonInputElement).getInputElement();
  newClientForm: FormGroup;
  
  maskitoRejectEvent() {
    console.log("maskitoReject");
  }

  constructor(
    private modalCtrl: ModalController,
    private toastController: ToastController,
    private clientService: ClientService,
    private formBuilder: FormBuilder,
    private petService: PetService
  ) {
    this.newClientForm = this.formBuilder.group({
      nome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.required, Validators.minLength(14)]],
      fone: ['', [Validators.required, Validators.minLength(16)]],
      endereco: ['', [Validators.required]],
    })
  }
  ngOnInit() {}

  fecharModal() {
    this.modalCtrl.dismiss();
  }

  removeNonDigits(data: string): string {
    return data.replace(/[^\d]/g, '');
  }

  async salvarAlteracoes() {
    const clientData = this.newClientForm.value;

    if(this.newClientForm.valid) {
      clientData.cpf = this.removeNonDigits(this.newClientForm.get('cpf')!.value);
      clientData.fone = this.removeNonDigits(this.newClientForm.get('fone')!.value);

      this.clientService.newClient(clientData).subscribe({
        next: async (response: any) => {
          this.clientService.updateObservableClients();
          this.modalCtrl.dismiss();
          await this.presentToast("Cliente cadastrado com sucesso", "success")
        },
        error: async (error: any) => {
          if(error.message = "Já existe um cliente com este CPF") {
            return await this.presentToast("Existe um cliente cadastrado com esses dados", "danger")
          }
          await this.presentToast("Falha ao adicionar cliente", "danger")
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
