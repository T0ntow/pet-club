import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-novo-funcionario',
  templateUrl: './novo-funcionario.component.html',
  styleUrls: ['./novo-funcionario.component.scss'],
})
export class NovoFuncionarioComponent  implements OnInit {
  constructor(private modalCtrl: ModalController) { }


  ngOnInit() {}

  fecharModal() {
    this.modalCtrl.dismiss();
  }

  salvarAlteracoes() {
    this.modalCtrl.dismiss();
  }
}
