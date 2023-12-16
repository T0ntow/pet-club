import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { FormBuilder } from '@angular/forms';
import { ClientService } from 'src/services/client.service';

@Component({
  selector: 'app-novo-cliente',
  templateUrl: './novo-cliente.component.html',
  styleUrls: ['./novo-cliente.component.scss'],
})
export class NovoClienteComponent  implements OnInit {
  newClientForm: FormGroup;

  constructor(
    private modalCtrl: ModalController,
    private toastController: ToastController,
    private clientService: ClientService,
    private formBuilder: FormBuilder
  ) {
    this.newClientForm = this.formBuilder.group({
      nome: ['', [Validators.required]],
      email: ['', [Validators.required]],
      cpf: ['', [Validators.required]],
      telefone: ['', [Validators.required]],
      endereco: ['', [Validators.required]],
    })
  }
  ngOnInit() {}

  fecharModal() {
    this.modalCtrl.dismiss();
  }

  async salvarAlteracoes() {
    const clientData = this.newClientForm.value;

    if(this.newClientForm.valid) {
      this.clientService.newClient(clientData).subscribe({
        next: async (response: any) => {
          this.clientService.updateObservableClients();
          this.modalCtrl.dismiss();
          await this.presentToast("Cliente cadastrado com sucesso", "success")
        },
        error: async (error: any) => {
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
