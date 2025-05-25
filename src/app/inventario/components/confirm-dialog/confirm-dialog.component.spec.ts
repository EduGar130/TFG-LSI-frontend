import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleProductoDialogComponent } from './detalle-producto-dialog.component';

describe('DetalleProductoDialogComponent', () => {
  let component: DetalleProductoDialogComponent;
  let fixture: ComponentFixture<DetalleProductoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleProductoDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleProductoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
