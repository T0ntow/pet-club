import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProdutosCrudPage } from './produtos-crud.page';

describe('ProdutosCrudPage', () => {
  let component: ProdutosCrudPage;
  let fixture: ComponentFixture<ProdutosCrudPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ProdutosCrudPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
