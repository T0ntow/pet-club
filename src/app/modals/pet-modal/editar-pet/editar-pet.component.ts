import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { SupplierService } from 'src/app/services/supplier.service';

@Component({
  selector: 'app-editar-pet',
  templateUrl: './editar-pet.component.html',
  styleUrls: ['./editar-pet.component.scss'],
})
export class EditarPetComponent implements OnInit {
  @Input() fornecedor: any;
  editPetForm: FormGroup = new FormGroup({});

  constructor(
    private modalCtrl: ModalController,
    private toastController: ToastController,
    private formBuilder: FormBuilder,
    private supplierService: SupplierService
  ) {}

  ngOnInit() { 
    this.editPetForm = this.formBuilder.group({
      nomeEmpresa: [this.fornecedor.nome, [Validators.required]],
      email: [this.fornecedor.email, [Validators.required, Validators.email]],
      cnpj: [this.formatarCnpj(this.fornecedor.cnpj), [Validators.required, Validators.minLength(18)]],
      representante: [this.fornecedor.representante, [Validators.required]],
      telefone: [this.formatarTelefone(this.fornecedor.fone), [Validators.required, Validators.minLength(16)]],
      endereco: [this.fornecedor.endereco, [Validators.required]],
    })
  }

  formatarCnpj(cnpj: string): string {
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  }

  formatarTelefone(telefone: string): string {
    return telefone.replace(/^(\d{2})(\d{1})(\d{4})(\d{4})$/, "($1) $2 $3-$4");
  }

  removeNonDigits(cnpj: string): string {
    return cnpj.replace(/[^\d]/g, '');
  }
  
  fecharModal() {
    this.modalCtrl.dismiss();
  }

  salvarAlteracoes() {
    // const supplierData = this.updateSupplierForm.value;

    // if (this.updateSupplierForm.valid) {
    //   supplierData.cnpj = this.removeNonDigits(this.updateSupplierForm.get('cnpj')!.value);
    //   supplierData.telefone = this.removeNonDigits(this.updateSupplierForm.get('telefone')!.value);
    //   const oldCnpj = this.fornecedor.cnpj;
  
    //   this.supplierService.updateSupplier(supplierData, oldCnpj).subscribe({
    //     next: (response) => {
    //       this.supplierService.updateObservableSuppliers();
    //       this.modalCtrl.dismiss(null, 'confirm');
    //       this.presentToast("Fornecedor atualizado com sucesso", "success")
    //     },
    //     error: (error) => {
    //       console.error('Erro ao atualizar o fornecedor:', error);
    //       if(error.error.error === "Já existe um fornecedor com este CNPJ") {
    //         this.presentToast("Já existe um fornecedor cadastrado com este CNPJ", "danger")
    //       } else {
    //         this.presentToast("Erro ao atualizar fornecedor", "danger")
    //       }
    //     }
    //   });
    // } else {
    //   this.presentToast("Preencha o formulário corretamente", "danger")
    // }
  }

  // async presentToast(text: string, color: string) {
    // const toast = await this.toastController.create({
  //     message: text,
  //     duration: 1800,
  //     color: color
  //   });

  //   await toast.present();
  // }
}
