import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtesaniaComponent } from './artesania.component';

describe('ArtesaniaComponent', () => {
  let component: ArtesaniaComponent;
  let fixture: ComponentFixture<ArtesaniaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtesaniaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArtesaniaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
