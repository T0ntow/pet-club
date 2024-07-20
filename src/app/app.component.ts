import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { register } from 'swiper/element/bundle';
register();

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent implements OnInit {
  constructor(
    private menuController: MenuController,
    private router: Router,
    private authService: AuthService
  ) { }

  username: string | null = null;
  isLoggedIn: boolean = false;
  showAdminSubItems = false;

  ngOnInit(): void {
    this.authService.authUsername$.subscribe((username) => {
      this.username = username;
      this.checkIfLoggedIn()
      console.log('Nome de usuário atualizado:', this.username);
    });
  }

  checkIfLoggedIn(): void {
    this.isLoggedIn = this.authService.isLoggedIn();

    if (this.isLoggedIn) {
      // O usuário está logado, você pode realizar ações aqui
      const username = this.authService.getAuthUsername();
      console.log(`Usuário logado: ${username}`);
    } else {
      // O usuário não está logado, redirecione-o para a página de login, por exemplo.
      console.log('Usuário não está logado. Redirecionando para a página de login...');
      // Adicione lógica de redirecionamento aqui
    }
  }

  logout(): void {
    this.isLoggedIn = this.authService.isLoggedIn();

    if (this.isLoggedIn) {
      this.authService.logout();
    } else {
    }
  }

  toggleAdminSubItems() {
    this.showAdminSubItems = !this.showAdminSubItems;
  }

  closeMenuAndNavigate(route: string) {
    this.menuController.close(); // Fecha o menu
    this.router.navigate([route]);
  }

  isOnBlockPagesMenu(): boolean {
    return (
      this.router.isActive('/login', {
        paths: 'subset',
        queryParams: 'subset',
        fragment: 'ignored',
        matrixParams: 'ignored'
      }) ||
      this.router.isActive('/signup', {
        paths: 'subset',
        queryParams: 'subset',
        fragment: 'ignored',
        matrixParams: 'ignored'
      })
    );
  }

  isOnBlockPages(): boolean {
    const blockRoutes = [
      '/login',
      '/signup',
      '/funcionarios',
      '/produtos-crud',
      '/fornecedores',
      '/clientes',
      '/estoque',
      '/pet',
      '/venda',
      '/pedido'
    ];
  
    return blockRoutes.some(route => this.router.isActive(route, {
      paths: 'subset',
      queryParams: 'subset',
      fragment: 'ignored',
      matrixParams: 'ignored'
    }));
  }

}
