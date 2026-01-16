import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Actionlogs } from './actionlogs';

describe('Actionlogs', () => {
  let component: Actionlogs;
  let fixture: ComponentFixture<Actionlogs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Actionlogs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Actionlogs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
