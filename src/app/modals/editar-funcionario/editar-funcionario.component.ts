import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-editar-funcionario',
  templateUrl: './editar-funcionario.component.html',
  styleUrls: ['./editar-funcionario.component.scss'],
})
export class EditarFuncionarioComponent  implements OnInit {
  @Input() funcionario: any;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  fecharModal() {
    this.modalCtrl.dismiss();
  }

  salvarAlteracoes() {
    // Adicione a lógica para salvar as alterações do funcionário aqui
    console.log('Salvar alterações para o funcionário:', this.funcionario);
    this.modalCtrl.dismiss();
  }

}
