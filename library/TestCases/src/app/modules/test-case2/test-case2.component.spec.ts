import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestCase2Component } from './test-case2.component';

describe('TestCase2Component', () => {
    let component: TestCase2Component;
    let fixture: ComponentFixture<TestCase2Component>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TestCase2Component]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TestCase2Component);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
