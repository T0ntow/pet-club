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


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
