import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { ClientService } from 'src/app/services/client.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { ProductService } from 'src/app/services/product.service';
import { SaleService } from 'src/app/services/sale.service';
import { SupplierService } from 'src/app/services/supplier.service';

@Component({
  selector: 'app-nova-venda',
  templateUrl: './nova-venda.component.html',
  styleUrls: ['./nova-venda.component.scss'],
})

export class NovaVendaComponent implements OnInit {
  newSaleForm: FormGroup;
  
  clientes: { 
    nome: string, 
    cnpj: string, 
    email: string, 
    telefone: string, 
    produto: string, 
    endereco: string, 
    id: number 
  }[] = [];

  funcionarios: { 
    nome: string, 
    cpf: string, 
    email: string; 
    telefone: string; 
    cargo: string; 
    endereco: string; 
    id: number 
  }[] = []

  produtos: {
    id: number;
    nome: string,
    descricao: string,
    categoria: string,
    preco: number,
    images: string[] 
  }[] = [];

  constructor(
    private modalCtrl: ModalController,
    private toastController: ToastController,
    private formBuilder: FormBuilder,
    private saleService: SaleService,
    private productsService: ProductService,
    private clientService: ClientService,
    private employeeService: EmployeeService
  ) {
    this.newSaleForm = this.formBuilder.group({
      cliente: ['', [Validators.required]],
      produto: ['', [Validators.required]],
      funcionario: ['', [Validators.required]],
      quantidade: ['', [Validators.required]],
      data_venda: ['', [Validators.required]],
      valor_total: ['', [Validators.required]],
    });

    this.getClients();
    this.getEmployees();
    this.getProducts();
  }

  ngOnInit() {
    
  }

  fecharModal() {
    this.modalCtrl.dismiss();
  }

  async salvarAlteracoes() {
    const saleData = this.newSaleForm.value;

    if(this.newSaleForm.valid) {
      this.saleService.newSale(saleData).subscribe({
        next: async (response: any) => {
          this.saleService.updateObservableSales();
          this.modalCtrl.dismiss();
          await this.presentToast("Venda cadastrada com sucesso", "success")
        },
        error: async (error: any) => {
          if(error.message = "Já existe uma venda com este CPF") {
           return await this.presentToast("Existe uma venda cadastrada com esses dados", "danger")
          }
          await this.presentToast("Falha ao adicionar venda", "danger")
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

  async getClients() {
    this.clientService.getClients().subscribe({
      next: (response: any) => {
        this.clientes = response
      },
      error: (error: any) => {
      }
    })
  }

  async getEmployees() {
    this.employeeService.getEmployees().subscribe({
      next: (response: any) => {
        this.funcionarios = response
      },
      error: (error: any) => {

      }
    })
  }

  async getProducts() {
    this.productsService.getProducts().subscribe({
      next: (response: any) => {
        this.produtos = response
      },
      error: (error: any) => {

      }
    })
  }

}
