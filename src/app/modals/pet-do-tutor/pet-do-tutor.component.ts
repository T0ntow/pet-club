import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

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
  selector: 'app-pet-do-tutor',
  templateUrl: './pet-do-tutor.component.html',
  styleUrls: ['./pet-do-tutor.component.scss'],
})
export class PetDoTutorComponent  implements OnInit {

  constructor(
    private modalController: ModalController
  ) { }

  @Input() pet: Pet | undefined; // Recebe o cliente como entrada

  ngOnInit() {
    if (this.pet) {
      console.log('Cliente recebido:', this.pet);
    } else {
      console.log('Nenhum cliente recebido');
    }
  }

  dismiss() {
    this.modalController.dismiss();
  }

}
