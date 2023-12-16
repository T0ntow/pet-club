import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FuncionariosPageRoutingModule } from './funcionarios-routing.module';

import { FuncionariosPage } from './funcionarios.page';
import { EditarFuncionarioComponent } from 'src/app/modals/funcionarios-modal/editar-funcionario/editar-funcionario.component';
import { NovoFuncionarioComponent } from 'src/app/modals/funcionarios-modal/novo-funcionario/novo-funcionario.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FuncionariosPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [FuncionariosPage,
    EditarFuncionarioComponent,
    NovoFuncionarioComponent]
})
export class FuncionariosPageModule {}
