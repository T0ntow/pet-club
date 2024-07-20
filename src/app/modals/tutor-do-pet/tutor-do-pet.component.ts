import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
interface Cliente {
  cpf: string; // pk
  nome: string;
  email: string;
  endereco: string;
  fone: string;
}

@Component({
  selector: 'app-tutor-do-pet',
  templateUrl: './tutor-do-pet.component.html',
  styleUrls: ['./tutor-do-pet.component.scss'],
})

export class TutorDoPetComponent implements OnInit {

  constructor(
    private modalController: ModalController
  ) { }

  @Input() cliente: Cliente | undefined; // Recebe o cliente como entrada

  ngOnInit() {
    if (this.cliente) {
      console.log('Cliente recebido:', this.cliente);
    } else {
      console.log('Nenhum cliente recebido');
    }
  }

  dismiss() {
    this.modalController.dismiss();

  }

}
