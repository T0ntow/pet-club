import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientsPageRoutingModule } from './clients-routing.module';

import { ClientsPage } from './clients.page';
import { NovoClienteComponent } from 'src/app/modals/clientes-modal/novo-cliente/novo-cliente.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaskitoModule } from '@maskito/angular';
import { EditarClienteComponent } from 'src/app/modals/clientes-modal/editar-cliente/editar-cliente.component';
import { PetDoTutorComponent } from 'src/app/modals/pet-do-tutor/pet-do-tutor.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientsPageRoutingModule,
    ReactiveFormsModule,
    MaskitoModule
  ],
  declarations: [
    ClientsPage,
    NovoClienteComponent,
    EditarClienteComponent,
    PetDoTutorComponent]
})
export class ClientsPageModule {}
