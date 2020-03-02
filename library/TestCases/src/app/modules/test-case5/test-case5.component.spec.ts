import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestCase5Component } from './test-case5.component';

describe('TestCase5Component', () => {
  let component: TestCase5Component;
  let fixture: ComponentFixture<TestCase5Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestCase5Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestCase5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
