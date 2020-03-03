import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestCase6Component } from './test-case6.component';

describe('TestCase6Component', () => {
    let component: TestCase6Component;
    let fixture: ComponentFixture<TestCase6Component>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TestCase6Component]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TestCase6Component);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
