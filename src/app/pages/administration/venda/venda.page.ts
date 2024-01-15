import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { NovaVendaComponent } from 'src/app/modals/vendas-modal/nova-venda/nova-venda.component';
import { ClientService } from 'src/app/services/client.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { ProductService } from 'src/app/services/product.service';
import { SaleService } from 'src/app/services/sale.service';

import { FormatarDataService } from 'src/app/services/formatar-data.service';

@Component({
  selector: 'app-venda',
  templateUrl: './venda.page.html',
  styleUrls: ['./venda.page.scss'],
})
export class VendaPage implements OnInit {

  vendas: {
    id_cliente: number,
    id_produto: number,
    id_funcionario: number,

    nome_cliente: string,
    nome_produto: string,
    nome_funcionario: string,

    quantidade: number,
    data_venda: Date,
    valor_total: number,
  }[] = [];

  vendasFiltradas: {
    id_cliente: number,
    id_produto: number,
    id_funcionario: number,

    nome_cliente: string,
    nome_produto: string,
    nome_funcionario: string,

    quantidade: number,
    data_venda: Date,
    valor_total: number,
  }[] = [];

  constructor(
    private alertController: AlertController,
    private modalCtrl: ModalController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private saleService: SaleService,
    private formatarDataService: FormatarDataService
  ) { }



  ngOnInit() {
    this.saleService.getObservableSales().subscribe(isUpdated => {
      this.getSalesGetFullSaleDetails();
    });

    this.getSalesGetFullSaleDetails();
  }

  formatarData(data: Date): string {
    return this.formatarDataService.formatarData(data)
  }

  async getSalesGetFullSaleDetails() {
    const loading = await this.loadingController.create({
      message: 'Carregando vendas...',
      spinner: 'crescent',
      translucent: true,
    });

    await loading.present();

    this.saleService.GetFullSaleDetails().subscribe({
      next: (response: any) => {
        this.vendas = response;
        console.log('this.vendas', this.vendas);

        loading.dismiss();
      },
      error: (error: any) => {
        this.presentToast("Falha ao recuperar vendas", "danger")
        loading.dismiss();
      },
    });
  }

  removerVenda(venda: any) {
    this.presentAlertRemove(venda);
  }

  deleteSale(sale: any) {
    this.saleService.deleteSale(sale.id_venda).subscribe({
      next: async (response: any) => {
        await this.presentToast('Venda removida com sucesso', "success")
        this.saleService.updateObservableSales()
      },
      error: (error: any) => {
        console.error('Falha ao remover venda:', error);
      },
    });
  }

  async presentAlertRemove(pet: any) {
    const alert = await this.alertController.create({
      header: 'Atenção',
      message: 'Você tem certeza de que deseja excluir esta venda? Ela será removida permanentemente.',
      buttons: [
        {
          text: 'cancelar',
          cssClass: 'alert-button-cancel',
        },
        {
          text: 'continuar',
          cssClass: 'alert-button-confirm',
          handler: () => { // Adiciona um handler para o botão 'continuar'
            this.deleteSale(pet);
          },
        },
      ],
    });

    await alert.present();
  }

  async adicionarVenda() {
    const modal = await this.modalCtrl.create({
      component: NovaVendaComponent,
    });

    return await modal.present();
  }

  alterarVenda(pet: any) {

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
