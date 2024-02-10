import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, map } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
})
export class ProductDetailsPage implements OnInit {
  produto: any; // Variável para armazenar os detalhes do produto

  constructor(private route: ActivatedRoute, private productService: ProductService) { }

  ngOnInit(): void {
    this.getDetalhesProduto();
  }

  getDetalhesProduto(): void {
    const id = this.route.snapshot.paramMap.get('id'); // Obtém o ID do produto da rota

    this.productService.getProductById(id!).subscribe({
      next: (produto) => {
        if(produto) {
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

  getImages(produto: any) {
    this.productService.getImagesFromProduct(produto.id).subscribe({
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

}
