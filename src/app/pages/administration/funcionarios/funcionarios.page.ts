import { Component, OnInit } from '@angular/core';
import { EditarFuncionarioComponent } from 'src/app/modals/funcionarios-modal/editar-funcionario/editar-funcionario.component';
import { NovoFuncionarioComponent } from 'src/app/modals/funcionarios-modal/novo-funcionario/novo-funcionario.component';
import { EmployeeService } from 'src/app/services/employee.service';
import { LoadingController, ToastController, AlertController, ModalController} from '@ionic/angular';

@Component({
  selector: 'app-funcionarios',
  templateUrl: './funcionarios.page.html',
  styleUrls: ['./funcionarios.page.scss'],
})
export class FuncionariosPage implements OnInit {

  funcionarios: {nome: string, cpf: string, email: string; telefone: string; cargo: string; endereco: string; id: number}[] = []

  constructor(
    private alertController: AlertController, 
    private modalCtrl: ModalController,
    private employeeService: EmployeeService,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.employeeService.getObservableEmployees().subscribe(isUpdated => {
      this.getEmployees()
    })

    this.getEmployees()
  }

  async getEmployees() {
    const loading = await this.loadingController.create({
      message: 'Carregando funcionarios...',
      spinner: 'crescent',
      translucent: true,
    });

    await loading.present();

    this.employeeService.getEmployees().subscribe({
      next: (response: any) => {
        console.log('Funcionários recuperados:', response);
        this.funcionarios = response;
        loading.dismiss(); 
      },
      error: (error: any) => {
        console.error('Falha ao recuperar funcionários:', error);
        loading.dismiss();
      },
    });
  }

  removerFuncionario(funcionario: any) {
    this.presentAlertRemove(funcionario);
  }

  deleteEmployee(funcionario: any) {
    this.employeeService.deleteEmployee(funcionario.id).subscribe({
      next: async (response: any) => {
        console.log('Funcionário removido com sucesso:', response);
        await this.presentToast('Funcionário removido com sucesso', "success")
        this.employeeService.updateObservableProducts()
      },
      error: (error: any) => {
        console.error('Falha ao remover funcionário:', error);
      },
    });
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
      console.log('Dados do funcionário adicionados:', data.data);
    });

    return await modal.present();
  }

  async presentAlertRemove(funcionario: any) {
    const alert = await this.alertController.create({
      header: 'Atenção',
      message: 'Você tem certeza de que deseja excluir este funcionário? Ele será removido permanentemente.',
      buttons: [
        {
          text: 'cancelar',
          cssClass: 'alert-button-cancel',
        },
        {
          text: 'continuar',
          cssClass: 'alert-button-confirm',
          handler: () => { // Adiciona um handler para o botão 'continuar'
            this.deleteEmployee(funcionario);
          },
        },
      ],
    });
  
    await alert.present();
  }

  async presentToast(text: string, color: string,) {
    const toast = await this.toastController.create({
      message: text,
      duration: 1800,
      color: color
    });

    await toast.present();
  }

}