import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestCase3Component } from './test-case3.component';

describe('TestCase3Component', () => {
  let component: TestCase3Component;
  let fixture: ComponentFixture<TestCase3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestCase3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestCase3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
