import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestCase4Component } from './test-case4.component';

describe('TestCase4Component', () => {
  let component: TestCase4Component;
  let fixture: ComponentFixture<TestCase4Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestCase4Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestCase4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
