import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { register } from 'swiper/element/bundle';
register();

import { AuthService } from 'src/services/auth.service';

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
  showAdminSubItems = false;

  ngOnInit(): void {
    this.authService.authUsername$.subscribe((username) => {
      this.username = username;
      console.log('Nome de usuário atualizado:', this.username);
    });
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
    return (
      this.router.isActive('/funcionarios', {
        paths: 'subset',
        queryParams: 'subset',
        fragment: 'ignored',
        matrixParams: 'ignored'
      }) ||
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

}
