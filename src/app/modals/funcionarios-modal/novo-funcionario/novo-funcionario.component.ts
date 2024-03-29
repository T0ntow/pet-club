import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { EmployeeService } from 'src/app/services/employee.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-novo-funcionario',
  templateUrl: './novo-funcionario.component.html',
  styleUrls: ['./novo-funcionario.component.scss'],
})

export class NovoFuncionarioComponent implements OnInit {
  newEmployeeForm: FormGroup;

  constructor(
    private modalCtrl: ModalController,
    private toastController: ToastController,
    private employeeService: EmployeeService,
    private formBuilder: FormBuilder
  ) {
    this.newEmployeeForm = this.formBuilder.group({
      nome: ['', [Validators.required]],
      email: ['', [Validators.required]],
      cpf: ['', [Validators.required]],
      cargo: ['', [Validators.required]],
      telefone: ['', [Validators.required]],
      endereco: ['', [Validators.required]],
    })
  }

  ngOnInit() { }

  fecharModal() {
    this.modalCtrl.dismiss();
  }

  async salvarAlteracoes() {
    const employeeData = this.newEmployeeForm.value;

    if(this.newEmployeeForm.valid) {
      this.employeeService.newEmployee(employeeData).subscribe({
        next: async (response: any) => {
          this.employeeService.updateObservableProducts();
          this.modalCtrl.dismiss();
          await this.presentToast("Funcionário cadastrado com sucesso", "success")
        },
        error: async (error: any) => {
          if(error.message = "Já existe um funcionário com este CPF") {
           return await this.presentToast("Existe um funcionário cadastrado com esses dados", "danger")
          }
          await this.presentToast("Falha ao adicionar funcionário", "danger")
        }
      })
    } else {
      await this.presentToast("Preencha o formulário corretamente", "danger")
    }
  }

  async presentToast(text: string, color: string) {
    const toast = await this.toastController.create({
      message: text,
      duration: 1800,
      color: color
    });

    await toast.present();
  }

}
