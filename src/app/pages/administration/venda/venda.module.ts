import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VendaPageRoutingModule } from './venda-routing.module';

import { VendaPage } from './venda.page';
import { NovaVendaComponent } from 'src/app/modals/vendas-modal/nova-venda/nova-venda.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VendaPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
    VendaPage,
    NovaVendaComponent]
})
export class VendaPageModule {}
