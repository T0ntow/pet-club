import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FornecedoresPage } from './fornecedores.page';

const routes: Routes = [
  {
    path: '',
    component: FornecedoresPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FornecedoresPageRoutingModule {}
