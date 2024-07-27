import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NovoProdutoPedidoComponent } from './novo-produto-pedido.component';

describe('NovoProdutoPedidoComponent', () => {
  let component: NovoProdutoPedidoComponent;
  let fixture: ComponentFixture<NovoProdutoPedidoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NovoProdutoPedidoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NovoProdutoPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
