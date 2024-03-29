import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FornecedoresPageRoutingModule } from './fornecedores-routing.module';
import { FornecedoresPage } from './fornecedores.page';
import { NovoFornecedorComponent } from 'src/app/modals/fornecedores-modal/novo-fornecedor/novo-fornecedor.component';
import { ReactiveFormsModule } from '@angular/forms';

import {MaskitoModule} from '@maskito/angular'
import { EditarFornecedorComponent } from 'src/app/modals/fornecedores-modal/editar-fornecedor/editar-fornecedor.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FornecedoresPageRoutingModule,
    ReactiveFormsModule,
    MaskitoModule
  ],
  declarations: [
    FornecedoresPage,
    NovoFornecedorComponent,
    EditarFornecedorComponent]
})
export class FornecedoresPageModule {}
