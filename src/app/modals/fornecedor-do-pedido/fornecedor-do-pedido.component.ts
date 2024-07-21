import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

interface Pedido {
  cod: string;                    // Código do pedido (INT AI PK)
  cnpj_fornecedor: string;        // CNPJ do fornecedor (CHAR(14))
  data_pedido: Date;              // Data do pedido (DATE)
  previsao_entrega: Date;         // Previsão de entrega (DATE)
  metodo_entrega: string;         // Método de entrega (VARCHAR(20))
  observacoes: string;            // Observações (VARCHAR(255))
  valor_total: number;            // Valor total (DECIMAL(8,2))
  status_pedido: string;          // Status do pedido (VARCHAR(10))
  fornecedor?: Fornecedor;  // A propriedade opcional para associar o fornecedor
}

interface Fornecedor {
  cnpj: string;
  email: string;
  endereco: string;
  nome: string;
  representante: string;
  fone: string;
  id: number;
}
@Component({
  selector: 'app-fornecedor-do-pedido',
  templateUrl: './fornecedor-do-pedido.component.html',
  styleUrls: ['./fornecedor-do-pedido.component.scss'],
})
export class FornecedorDoPedidoComponent  implements OnInit {
  constructor(
    private modalController: ModalController
  ) { }

  @Input() fornecedor: Fornecedor | undefined; // Recebe o cliente como entrada

  ngOnInit() {
    if (this.fornecedor) {
      console.log('Cliente recebido:', this.fornecedor);
    } else {
      console.log('Nenhum cliente recebido');
    }
  }

  dismiss() {
    this.modalController.dismiss();
  }



}
