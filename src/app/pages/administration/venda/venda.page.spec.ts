import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VendaPage } from './venda.page';

describe('VendaPage', () => {
  let component: VendaPage;
  let fixture: ComponentFixture<VendaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(VendaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
