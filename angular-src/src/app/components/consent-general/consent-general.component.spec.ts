import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsentGeneralComponent } from './consent-general.component';

describe('ConsentGeneralComponent', () => {
  let component: ConsentGeneralComponent;
  let fixture: ComponentFixture<ConsentGeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsentGeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsentGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
