import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarProductoDialogComponent } from './editar-producto-dialog.component';

describe('EditarProductoDialogComponent', () => {
  let component: EditarProductoDialogComponent;
  let fixture: ComponentFixture<EditarProductoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarProductoDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarProductoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
