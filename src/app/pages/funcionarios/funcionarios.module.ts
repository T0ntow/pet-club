import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FuncionariosPageRoutingModule } from './funcionarios-routing.module';

import { FuncionariosPage } from './funcionarios.page';
import { EditarFuncionarioComponent } from 'src/app/modals/editar-funcionario/editar-funcionario.component';
import { NovoFuncionarioComponent } from 'src/app/modals/novo-funcionario/novo-funcionario.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FuncionariosPageRoutingModule
  ],
  declarations: [FuncionariosPage,
    EditarFuncionarioComponent,
    NovoFuncionarioComponent]
})
export class FuncionariosPageModule {}
