import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ProductService } from 'src/app/services/product.service';

interface Produto {
  cod: number;
  nome: string;
}

@Component({
  selector: 'app-novo-produto-pedido',
  templateUrl: './novo-produto-pedido.component.html',
  styleUrls: ['./novo-produto-pedido.component.scss'],
})

export class NovoProdutoPedidoComponent  implements OnInit {

  produtoForm: FormGroup;
  produtosFiltrados: Produto[] = [];

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private productService: ProductService
  ) {
    this.produtoForm = this.fb.group({
      produto_cod: ['', Validators.required],
      quantidade_produto: [1, Validators.required]
    });
  }

  ngOnInit() {
    this.getProducts();
  }

  async getProducts() {
    try {
      const produtos = await this.productService.getProducts().toPromise();
      this.produtosFiltrados = produtos as Produto[];
    } catch (error) {
      console.error('Falha ao recuperar produtos', error);
    }
  }

  adicionarProduto() {
    if (this.produtoForm.valid) {
      const { produto_cod, quantidade_produto } = this.produtoForm.value;
      this.modalCtrl.dismiss({ produto_cod, quantidade_produto });
    }
  }

  fechar() {
    this.modalCtrl.dismiss();
  }
}
