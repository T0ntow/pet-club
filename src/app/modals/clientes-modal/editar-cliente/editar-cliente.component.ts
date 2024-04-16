import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { maskitoCPF, maskitoNumber } from '../../../mask'
import { MaskitoElementPredicate } from '@maskito/core';
import { ClientService } from 'src/app/services/client.service';
@Component({
  selector: 'app-editar-cliente',
  templateUrl: './editar-cliente.component.html',
  styleUrls: ['./editar-cliente.component.scss'],
})
export class EditarClienteComponent  implements OnInit {
  @Input() cliente: any;
  updateClientForm: FormGroup = new FormGroup({});

  readonly maskitoNumber = maskitoNumber;
  readonly maskitoCpf = maskitoCPF;

  readonly maskPredicate: MaskitoElementPredicate = async (el) => (el as HTMLIonInputElement).getInputElement();

  maskitoRejectEvent() {
    console.log("maskitoReject");
  }

  constructor(
    private modalCtrl: ModalController,
    private toastController: ToastController,
    private formBuilder: FormBuilder,
    private clientService: ClientService
  ) {}

  ngOnInit() { 
    this.updateClientForm = this.formBuilder.group({
      nome: [this.cliente.nome, [Validators.required]],
      email: [this.cliente.email, [Validators.required, Validators.email]],
      cpf: [this.cliente.cpf, [Validators.required, Validators.minLength(14)]],
      fone: [this.cliente.fone, [Validators.required, Validators.minLength(16)]],
      endereco: [this.cliente.endereco, [Validators.required]],
    })
  }

  formatarTelefone(telefone: string): string {
    return telefone.replace(/^(\d{2})(\d{1})(\d{4})(\d{4})$/, "($1) $2 $3-$4");
  }

  removeNonDigits(data: string): string {
    return data.replace(/[^\d]/g, '');
  }
  
  fecharModal() {
    this.modalCtrl.dismiss();
  }

  salvarAlteracoes() {
    const clientData = this.updateClientForm.value;

    if (this.updateClientForm.valid) {
      clientData.cpf = this.removeNonDigits(this.updateClientForm.get('cpf')!.value);
      clientData.fone = this.removeNonDigits(this.updateClientForm.get('fone')!.value);
      const oldCpf = this.cliente.cpf;
  
      this.clientService.updateClient(clientData, oldCpf).subscribe({
        next: (response) => {
          this.clientService.updateObservableClients();
          this.modalCtrl.dismiss(null, 'confirm');
          this.presentToast("cliente atualizado com sucesso", "success")
        },
        error: (error) => {
          console.error('Erro ao atualizar o cliente:', error);
          if(error.error.error === "Já existe um cliente com este CPF") {
            this.presentToast("Já existe um cliente cadastrado com este CPF", "danger")
          } else {
            this.presentToast("Erro ao atualizar cliente", "danger")
          }
        }
      });
    } else {
      this.presentToast("Preencha o formulário corretamente", "danger")
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
