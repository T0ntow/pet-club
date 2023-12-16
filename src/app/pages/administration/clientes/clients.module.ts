import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientsPageRoutingModule } from './clients-routing.module';

import { ClientsPage } from './clients.page';
import { NovoClienteComponent } from 'src/app/modals/clientes-modal/novo-cliente/novo-cliente.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientsPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
    ClientsPage,
    NovoClienteComponent]
})
export class ClientsPageModule {}
