import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudsliderComponent } from './crudslider.component';

describe('CrudsliderComponent', () => {
  let component: CrudsliderComponent;
  let fixture: ComponentFixture<CrudsliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudsliderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudsliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
