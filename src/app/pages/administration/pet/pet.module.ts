import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PetPageRoutingModule } from './pet-routing.module';

import { PetPage } from './pet.page';
import { NovoPetComponent } from 'src/app/modals/pet-modal/novo-pet/novo-pet.component';
import { ReactiveFormsModule } from '@angular/forms';
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
    NovoPetComponent]
})
export class PetPageModule {}
