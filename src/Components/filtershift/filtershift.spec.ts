import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Filtershift } from './filtershift';

describe('Filtershift', () => {
  let component: Filtershift;
  let fixture: ComponentFixture<Filtershift>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Filtershift]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Filtershift);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
