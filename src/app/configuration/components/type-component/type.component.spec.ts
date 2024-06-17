import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeComponentComponent } from './type.component';

describe('TypeComponentComponent', () => {
  let component: TypeComponentComponent;
  let fixture: ComponentFixture<TypeComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypeComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TypeComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
