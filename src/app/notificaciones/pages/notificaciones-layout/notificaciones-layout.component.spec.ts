import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificacionesLayoutComponent } from './notificaciones-layout.component';

describe('NotificacionesLayoutComponent', () => {
  let component: NotificacionesLayoutComponent;
  let fixture: ComponentFixture<NotificacionesLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificacionesLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificacionesLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
