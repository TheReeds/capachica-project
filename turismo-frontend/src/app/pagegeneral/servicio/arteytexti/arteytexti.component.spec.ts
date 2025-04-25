import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArteytextiComponent } from './arteytexti.component';

describe('ArteytextiComponent', () => {
  let component: ArteytextiComponent;
  let fixture: ComponentFixture<ArteytextiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArteytextiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArteytextiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
