import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-novo-produto',
  templateUrl: './novo-produto.component.html',
  styleUrls: ['./novo-produto.component.scss'],
})
export class NovoProdutoComponent  implements OnInit {

  constructor(private modalCtrl: ModalController, private toastController: ToastController) { }

  ngOnInit() {}

  fecharModal() {
    this.modalCtrl.dismiss();
  }

  salvarAlteracoes() {
    this.modalCtrl.dismiss();
  }
}
