import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PedidoPageRoutingModule } from './pedido-routing.module';

import { PedidoPage } from './pedido.page';
import { NovoPedidoComponent } from 'src/app/modals/pedidos-modal/novo-pedido/novo-pedido.component';
import { EditarPedidoComponent } from 'src/app/modals/pedidos-modal/editar-pedido/editar-pedido.component';
import {MaskitoModule} from '@maskito/angular'
import { FornecedorDoPedidoComponent } from 'src/app/modals/fornecedor-do-pedido/fornecedor-do-pedido.component';
import { NovoProdutoPedidoComponent } from 'src/app/modals/novo-produto-pedido/novo-produto-pedido.component';
import { ProdutoDoPedidoComponent } from 'src/app/modals/produto-do-pedido/produto-do-pedido.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    PedidoPageRoutingModule,
    MaskitoModule
  ],
  declarations: [
    PedidoPage,
    NovoPedidoComponent,
    EditarPedidoComponent,
    FornecedorDoPedidoComponent,
    NovoProdutoPedidoComponent,
    ProdutoDoPedidoComponent
  ]
})
export class PedidoPageModule {}
