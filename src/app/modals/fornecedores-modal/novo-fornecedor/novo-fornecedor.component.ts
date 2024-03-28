import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { SupplierService } from 'src/app/services/supplier.service';
import { FormBuilder } from '@angular/forms';

// import { MaskitoDirective } from '@maskito/angular';
import { MaskitoElementPredicate } from '@maskito/core';
import { maskitoCNPJ } from '../../../mask'
import { maskitoNumber } from '../../../mask'


@Component({
  selector: 'app-novo-fornecedor',
  templateUrl: './novo-fornecedor.component.html',
  styleUrls: ['./novo-fornecedor.component.scss'],

})

export class NovoFornecedorComponent implements OnInit {
  readonly maskitoRejectCNPJ = maskitoCNPJ;
  readonly maskitoRejectNumber = maskitoNumber;

  readonly maskPredicate: MaskitoElementPredicate = async (el) => (el as HTMLIonInputElement).getInputElement();

  maskitoRejectEvent() {
    console.log("maskitoReject");
  }

  newSupplierForm: FormGroup;

  constructor(
    private modalCtrl: ModalController,
    private toastController: ToastController,
    private supplierService: SupplierService,
    private formBuilder: FormBuilder
  ) {
    this.newSupplierForm = this.formBuilder.group({
      nomeEmpresa: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      cnpj: ['', [Validators.required, Validators.minLength(18)]],
      representante: ['', [Validators.required]],
      telefone: ['', [Validators.required, Validators.minLength(16)]],
      endereco: ['', [Validators.required]],
    })
  }


  ngOnInit() { }

  fecharModal() {
    this.modalCtrl.dismiss();
  }
  
  cleanCnpj(cnpj: string): string {
    return cnpj.replace(/[^\d]/g, '');
  }

  async salvarAlteracoes() {
    const supplierData = this.newSupplierForm.value;

    if (this.newSupplierForm.valid) {
      const newCnpj = this.cleanCnpj(this.newSupplierForm.get('cnpj')!.value);
      const newPhone = this.cleanCnpj(this.newSupplierForm.get('telefone')!.value);
  
      supplierData.cnpj = newCnpj;
      supplierData.telefone = newPhone;

      this.supplierService.newSupplier(supplierData).subscribe({
        next: async (response: any) => {
          this.supplierService.updateObservableSuppliers();
          this.modalCtrl.dismiss();
          await this.presentToast("Fornecedor cadastrado com sucesso", "success")
        },
        error: async (error: any) => {
          if (error.message = 'Já existe um fornecedor com este CNPJ') {
            return await this.presentToast("Existe um fornecedor cadastrado com esses dados", "danger")
          }
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
