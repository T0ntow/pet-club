import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'funcionarios',
    loadChildren: () => import('./pages/administration/funcionarios/funcionarios.module').then( m => m.FuncionariosPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'produtos-crud',
    loadChildren: () => import('./pages/administration/produtos/produtos-crud.module').then( m => m.ProdutosCrudPageModule)
  },
  {
    path: 'fornecedores',
    loadChildren: () => import('./pages/administration/fornecedores/fornecedores.module').then( m => m.FornecedoresPageModule)
  },
  {
    path: 'clientes',
    loadChildren: () => import('./pages/administration/clientes/clients.module').then( m => m.ClientsPageModule)
  },
  {
    path: 'estoque',
    loadChildren: () => import('./pages/administration/estoque/estoque.module').then( m => m.EstoquePageModule)
  },
  {
    path: 'pet',
    loadChildren: () => import('./pages/administration/pet/pet.module').then( m => m.PetPageModule)
  },
  // {
  //   path: 'product-details',
  //   loadChildren: () => import('./pages/product-details/product-details.module').then( m => m.ProductDetailsPageModule)
  // },

  { path: 'produto/:id', loadChildren: () => import('./pages/product-details/product-details.module').then( m => m.ProductDetailsPageModule) }, // Rota para os detalhes do produto

  {
    path: 'venda',
    loadChildren: () => import('./pages/administration/venda/venda.module').then( m => m.VendaPageModule)
  },
  {
    path: 'pedido',
    loadChildren: () => import('./pages/administration/pedido/pedido.module').then( m => m.PedidoPageModule)
  },




];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
