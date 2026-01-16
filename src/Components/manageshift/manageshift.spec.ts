import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Manageshift } from './manageshift';

describe('Manageshift', () => {
  let component: Manageshift;
  let fixture: ComponentFixture<Manageshift>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Manageshift]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Manageshift);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
