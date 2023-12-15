import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProdutosCrudPageRoutingModule } from './produtos-crud-routing.module';

import { ProdutosCrudPage } from './produtos-crud.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProdutosCrudPageRoutingModule
  ],
  declarations: [ProdutosCrudPage]
})
export class ProdutosCrudPageModule {}
