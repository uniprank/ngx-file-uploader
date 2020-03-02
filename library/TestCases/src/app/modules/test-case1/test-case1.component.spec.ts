import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestCase1Component } from './test-case1.component';

describe('TestCase1Component', () => {
    let component: TestCase1Component;
    let fixture: ComponentFixture<TestCase1Component>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TestCase1Component]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TestCase1Component);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
