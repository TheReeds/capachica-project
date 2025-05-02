import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallefamiliasComponent } from './detallefamilias.component';


describe('DetallefamiliasComponent', () => {
  let component: DetallefamiliasComponent;
  let fixture: ComponentFixture<DetallefamiliasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallefamiliasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallefamiliasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});







