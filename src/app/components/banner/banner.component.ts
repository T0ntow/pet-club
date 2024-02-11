import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import Swiper from 'swiper'

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent  implements OnInit {
  swiper?: Swiper;
  @ViewChild('') swiperElement: ElementRef | undefined;

  constructor(private navCtrl: NavController) { }

  ngOnInit() {}

  goBack() {
    // Lógica para voltar
    // this.navCtrl.back();
  }

  goForward() {
    // Lógica para avançar
    // Você pode navegar para outra página ou realizar a ação desejada aqui
  }

  swiperReady() {
    this.swiper = this.swiperElement?.nativeElement.swiper;
  }

  goNext() {
    this.swiper?.slideNext();
  }

  goPrev() {
    this.swiper?.slidePrev();
  }

  swiperSlideChange(e: any) {
    console.log("changed", e);
  }
  selectedProject: string = "projeto1";
  toggleProject(project: string) {
    this.selectedProject = project;
  }


  imagesWallet = [
    '/assets/images/wallet-tablet-celular.png',
    '/assets/images/wallet-pc.png',
  ]

  imagesControleEstoque = [
    '/assets/images/controle-estoque.png',
  ]

  imagesConversor = [
    '/assets/images/conversor-romano.png',
  ]

  imagesTtow = [
    '/assets/images/toow2.png',
  ]
  
  imagesPokedex = [
    '/assets/images/pokedex.png',
  ]

}
