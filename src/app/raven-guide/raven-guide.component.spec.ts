import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RavenGuideComponent } from './raven-guide.component';

describe('RavenGuideComponent', () => {
  let component: RavenGuideComponent;
  let fixture: ComponentFixture<RavenGuideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RavenGuideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RavenGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
