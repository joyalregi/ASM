import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Attendancehome } from './attendancehome';

describe('Attendancehome', () => {
  let component: Attendancehome;
  let fixture: ComponentFixture<Attendancehome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Attendancehome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Attendancehome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
