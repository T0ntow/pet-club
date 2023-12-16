import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FornecedoresPageRoutingModule } from './fornecedores-routing.module';

import { FornecedoresPage } from './fornecedores.page';
import { NovoFornecedorComponent } from 'src/app/modals/fornecedores-modal/novo-fornecedor/novo-fornecedor.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FornecedoresPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
    FornecedoresPage,
    NovoFornecedorComponent]
})
export class FornecedoresPageModule {}
