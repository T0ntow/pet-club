import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import Swiper from 'swiper';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
})

export class ProductDetailsPage implements OnInit {
  produto: any; // Variável para armazenar os detalhes do produto
  swiper?: Swiper;
  @ViewChild('swiper') swiperElement: ElementRef | undefined;
  isMobile: boolean = false;

  constructor(private route: ActivatedRoute, private productService: ProductService) { }

  ngOnInit(): void {
    this.getDetalhesProduto();
  }

  getDetalhesProduto(): void {
    const id = this.route.snapshot.paramMap.get('id'); // Obtém o ID do produto da rota

    if (id) {
      this.productService.getProductById(id).subscribe({
        next: (produto) => {
          if (produto) {
            this.produto = produto;
            this.getImages(produto)
          }
        },
        error: (error) => {
          console.error('Erro ao obter detalhes do produto:', error);
        }
      }
      );
    }
  }

  getImages(produto: any) {
    this.productService.getImagesFromProduct(produto.cod).subscribe({
      next: (response: any) => {
        console.log('Imagens recuperadas com sucesso:', response);
        this.produto.images = response;

        console.log("this.produto", this.produto);

      },
      error: (error: any) => {
        console.error('Falha ao recuperar imagens:', error);
      }
    });
  }

  swiperReady() {
    this.swiper = this.swiperElement?.nativeElement.swiper;
  }

  swiperSlideChange(e: any) {
    console.log("changed", e);
  }

  changeSwiperIndex(image: any) {
    const index = this.produto.images.indexOf(image);
    console.log(index);

    this.swiperElement?.nativeElement.swiper.slideTo(index);
  }
}
