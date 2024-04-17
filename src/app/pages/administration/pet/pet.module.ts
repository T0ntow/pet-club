import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PetPageRoutingModule } from './pet-routing.module';

import { ReactiveFormsModule } from '@angular/forms';
import { EditarPetComponent } from 'src/app/modals/pet-modal/editar-pet/editar-pet.component';
import { NovoPetComponent } from 'src/app/modals/pet-modal/novo-pet/novo-pet.component';
import { PetPage } from './pet.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PetPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
    PetPage,
    NovoPetComponent,
  EditarPetComponent
]
})
export class PetPageModule {}
