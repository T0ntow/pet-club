import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { EmployeeService } from 'src/services/employee.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-novo-fornecedor',
  templateUrl: './novo-fornecedor.component.html',
  styleUrls: ['./novo-fornecedor.component.scss'],
})
export class NovoFornecedorComponent  implements OnInit {
  newSupplierForm: FormGroup;

  constructor(
    private modalCtrl: ModalController,
    private toastController: ToastController,
    private employeeService: EmployeeService,
    private formBuilder: FormBuilder
  ) {
    this.newSupplierForm = this.formBuilder.group({
      nome_empresa: ['', [Validators.required]],
      email: ['', [Validators.required]],
      cnpj: ['', [Validators.required]],
      representante: ['', [Validators.required]],
      telefone: ['', [Validators.required]],
      endereco: ['', [Validators.required]],
    })
  }
  ngOnInit() {}

  fecharModal() {
    this.modalCtrl.dismiss();
  }

  async salvarAlteracoes() {
    const employeeData = this.newSupplierForm.value;

    if(this.newSupplierForm.valid) {
      this.employeeService.newEmployee(employeeData).subscribe({
        next: async (response: any) => {
          this.employeeService.updateObservableProducts();
          this.modalCtrl.dismiss();
          await this.presentToast("Fornecedor cadastrado com sucesso", "success")
        },
        error: async (error: any) => {
          await this.presentToast("Falha ao adicionar fornecedor", "danger")
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
