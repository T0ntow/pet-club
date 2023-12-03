import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-editar-funcionario',
  templateUrl: './editar-funcionario.component.html',
  styleUrls: ['./editar-funcionario.component.scss'],
})
export class EditarFuncionarioComponent  implements OnInit {
  @Input() funcionario: any;

  constructor(private modalCtrl: ModalController, private toastController: ToastController) { }

  ngOnInit() {}

  fecharModal() {
    this.modalCtrl.dismiss();
  }

  salvarAlteracoes() {
    // Adicione a lógica para salvar as alterações do funcionário aqui
    console.log('Salvar alterações para o funcionário:', this.funcionario);
    this.modalCtrl.dismiss();
    this.presentToast()
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Funcionário atualizado com sucesso!',
      duration: 1800,
      position: 'top',
    });

    await toast.present();
  }

}
