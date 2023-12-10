import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { register } from 'swiper/element/bundle';
register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private menuController: MenuController,
    private router: Router,

  ) {}

  showAdminSubItems = false;

  toggleAdminSubItems() {
    this.showAdminSubItems = !this.showAdminSubItems;
  }

  closeMenuAndNavigate(route: string) {
    this.menuController.close(); // Fecha o menu
    this.router.navigate([route]);
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
