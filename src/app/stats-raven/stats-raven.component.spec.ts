import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsRavenComponent } from './stats-raven.component';

describe('StatsRavenComponent', () => {
  let component: StatsRavenComponent;
  let fixture: ComponentFixture<StatsRavenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatsRavenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatsRavenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
