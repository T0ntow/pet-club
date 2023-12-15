import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NovoProdutoComponent } from 'src/app/modals/novo-produto/novo-produto.component';


@Component({
  selector: 'app-produtos-crud',
  templateUrl: './produtos-crud.page.html',
  styleUrls: ['./produtos-crud.page.scss'],
})
export class ProdutosCrudPage implements OnInit {

  constructor(
    private modalCtrl: ModalController,

  ) { }

  ngOnInit() {
  }

  async adicionarProduto() {
    const modal = await this.modalCtrl.create({
      component: NovoProdutoComponent,
    });

    modal.onDidDismiss().then((data) => {
      console.log('Dados do produto atualizados:', data.data);
    });

    return await modal.present();
  }
}
