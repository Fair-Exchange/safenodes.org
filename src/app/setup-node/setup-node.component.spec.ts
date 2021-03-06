import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateWalletComponent } from './setup-node.component';

describe('GenerateWalletComponent', () => {
  let component: GenerateWalletComponent;
  let fixture: ComponentFixture<GenerateWalletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateWalletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
