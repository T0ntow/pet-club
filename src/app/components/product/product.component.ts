import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

  produtos = [
    { id: 1, nome: 'Ração Nutrilus Premium para Gatos Castrados', imagem: './assets/image-product1.png', preco: 19.99 },
    { id: 2, nome: 'Areia Sanitária Meau Grãos Finos para Gatos', imagem: '/assets/image-product2.jpg', preco: 12.98 },
    { id: 3, nome: 'Bola Para Cachorro Porta Petisco Brinquedo Interativo Cor Cores Sortidas', imagem: '/assets/image-product3.png', preco: 19.99 },
    { id: 4, nome: 'Coleira para Cachorro com Nome e Telefone - Courino Matelassê Macio Rosa Pink - Metais Niquelados', imagem: '/assets/image-product4.jpg', preco: 79.99 },
  ];

  getProdutos() {
    return this.produtos;
  }

  amei(produto: any) {
  }

  adicionarAoCarrinho(produto: any) {
  }


}
