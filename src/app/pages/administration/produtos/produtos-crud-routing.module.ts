import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProdutosCrudPage } from './produtos-crud.page';

const routes: Routes = [
  {
    path: '',
    component: ProdutosCrudPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProdutosCrudPageRoutingModule {}
