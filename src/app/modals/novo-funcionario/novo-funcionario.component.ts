import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-novo-funcionario',
  templateUrl: './novo-funcionario.component.html',
  styleUrls: ['./novo-funcionario.component.scss'],
})
export class NovoFuncionarioComponent implements OnInit {

  constructor(private modalCtrl: ModalController, private toastController: ToastController) { }

  ngOnInit() { }

  fecharModal() {
    this.modalCtrl.dismiss();
  }

  salvarAlteracoes() {
    this.modalCtrl.dismiss();
    this.presentToast();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Funcionário cadastrado com sucesso!',
      duration: 1800,
      position: 'top',
    });

    await toast.present();
  }

}
