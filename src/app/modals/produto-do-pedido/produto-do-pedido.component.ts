import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-produto-do-pedido',
  templateUrl: './produto-do-pedido.component.html',
  styleUrls: ['./produto-do-pedido.component.scss'],
})
export class ProdutoDoPedidoComponent {
  @Input() produto: any;

  constructor(private modalCtrl: ModalController) {}

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
