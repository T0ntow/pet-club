import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProdutosCrudPageRoutingModule } from './produtos-crud-routing.module';

import { ProdutosCrudPage } from './produtos-crud.page';
import { NovoProdutoComponent } from 'src/app/modals/novo-produto/novo-produto.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProdutosCrudPageRoutingModule
  ],
  declarations: [ProdutosCrudPage,
    NovoProdutoComponent]
})
export class ProdutosCrudPageModule {}
