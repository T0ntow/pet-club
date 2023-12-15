import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProdutosCrudPageRoutingModule } from './produtos-crud-routing.module';

import { ProdutosCrudPage } from './produtos-crud.page';
import { NovoProdutoComponent } from 'src/app/modals/novo-produto/novo-produto.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProdutosCrudPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ProdutosCrudPage,
    NovoProdutoComponent]
})
export class ProdutosCrudPageModule {}
