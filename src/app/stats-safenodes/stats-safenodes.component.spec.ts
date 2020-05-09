import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsSafenodesComponent } from './stats-safenodes.component';

describe('StatsSafenodesComponent', () => {
  let component: StatsSafenodesComponent;
  let fixture: ComponentFixture<StatsSafenodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatsSafenodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatsSafenodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
