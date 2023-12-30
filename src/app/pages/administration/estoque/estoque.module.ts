import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EstoquePageRoutingModule } from './estoque-routing.module';

import { EstoquePage } from './estoque.page';
import { NovoEstoqueComponent } from 'src/app/modals/estoque-modal/novo-estoque/novo-estoque.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EstoquePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
    EstoquePage,
    NovoEstoqueComponent]
})
export class EstoquePageModule {}
