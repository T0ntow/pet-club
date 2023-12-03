import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FuncionariosPage } from './funcionarios.page';

describe('FuncionariosPage', () => {
  let component: FuncionariosPage;
  let fixture: ComponentFixture<FuncionariosPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(FuncionariosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
