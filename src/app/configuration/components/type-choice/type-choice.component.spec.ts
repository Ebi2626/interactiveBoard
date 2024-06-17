import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeChoiceComponent } from './type-choice.component';

describe('TypeChoiceComponent', () => {
  let component: TypeChoiceComponent;
  let fixture: ComponentFixture<TypeChoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypeChoiceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TypeChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
