import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuiadoComponent } from './guiado.component';

describe('GuiadoComponent', () => {
  let component: GuiadoComponent;
  let fixture: ComponentFixture<GuiadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuiadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuiadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
