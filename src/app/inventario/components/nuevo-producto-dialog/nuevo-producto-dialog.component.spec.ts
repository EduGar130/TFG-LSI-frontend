import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoProductoDialogComponent } from './nuevo-producto-dialog.component';

describe('NuevoProductoDialogComponent', () => {
  let component: NuevoProductoDialogComponent;
  let fixture: ComponentFixture<NuevoProductoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevoProductoDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevoProductoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
