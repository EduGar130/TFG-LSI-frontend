import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoUsuarioDialogComponent } from './nuevo-usuario-dialog.component';

describe('EditarUsuarioDialogComponent', () => {
  let component: NuevoUsuarioDialogComponent;
  let fixture: ComponentFixture<NuevoUsuarioDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevoUsuarioDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevoUsuarioDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
