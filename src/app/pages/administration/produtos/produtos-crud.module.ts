import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProdutosCrudPageRoutingModule } from './produtos-crud-routing.module';

import { ProdutosCrudPage } from './produtos-crud.page';
import { NovoProdutoComponent } from 'src/app/modals/produtos-modal/novo-produto/novo-produto.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EditarProdutoComponent } from 'src/app/modals/produtos-modal/editar-produto/editar-produto.component';
import {MaskitoModule} from '@maskito/angular'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProdutosCrudPageRoutingModule,
    ReactiveFormsModule,
    MaskitoModule
  ],
  declarations: [
    ProdutosCrudPage,
    NovoProdutoComponent,
    EditarProdutoComponent]
})
export class ProdutosCrudPageModule {}
