import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { EditarFuncionarioComponent } from 'src/app/modals/editar-funcionario/editar-funcionario.component';
import { NovoFuncionarioComponent } from 'src/app/modals/novo-funcionario/novo-funcionario.component';

@Component({
  selector: 'app-funcionarios',
  templateUrl: './funcionarios.page.html',
  styleUrls: ['./funcionarios.page.scss'],
})
export class FuncionariosPage implements OnInit {

  constructor(private alertController: AlertController, private modalCtrl: ModalController) {}

  ngOnInit() {
  }

  funcionarios = [
    { nome: 'João Silva', cpf: '123.456.789-01', cargo: 'Desenvolvedor' },
    { nome: 'Maria Santos', cpf: '987.654.321-09', cargo: 'Analista de Sistemas' },
    { nome: 'Pedro Oliveira', cpf: '111.222.333-44', cargo: 'Gerente de Projetos' },
    { nome: 'Ana Pereira', cpf: '555.666.777-88', cargo: 'Designer UX' },
    { nome: 'Carlos Costa', cpf: '999.888.777-66', cargo: 'Analista de Qualidade' },
  ];

  removerFuncionario(funcionario: any) {
    this.presentAlertRemove(funcionario);
  }

  async presentAlertRemove(funcionario: any) {
    const alert = await this.alertController.create({
      header: 'Atenção',
      message: 'Você tem certeza de que deseja excluir este funcionário? Ele será removido permanentemente.',
      buttons: [ {
        text: 'cancelar',
        cssClass: 'alert-button-cancel',
      },
      {
        text: 'continuar',
        cssClass: 'alert-button-confirm',
      },],
    });

    await alert.present();
  }

  async alterarFuncionario(funcionario: any) {
    const modal = await this.modalCtrl.create({
      component: EditarFuncionarioComponent,
      componentProps: { funcionario: funcionario },
    });

    modal.onDidDismiss().then((data) => {
      console.log('Dados do funcionário atualizados:', data.data);
    });

    return await modal.present();
  }

  async adicionarFuncionario() {
    const modal = await this.modalCtrl.create({
      component: NovoFuncionarioComponent,
    });

    modal.onDidDismiss().then((data) => {
      console.log('Dados do funcionário atualizados:', data.data);
    });

    return await modal.present();
  }



}
