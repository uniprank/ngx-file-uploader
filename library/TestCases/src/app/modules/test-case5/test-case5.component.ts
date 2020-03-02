import { Component, OnInit, ElementRef } from '@angular/core';

import * as Stickyfill from 'stickyfilljs';

@Component({
    selector: 'uni-test-case5',
    templateUrl: './test-case5.component.html',
    styleUrls: ['./test-case5.component.scss']
})
export class TestCase5Component implements OnInit {
    public markdown = require('raw-loader!./README.md');
    public sections: Array<any> = [];

    constructor(private _host: ElementRef) {}

    ngOnInit() {
        Stickyfill.add(this._host.nativeElement.querySelector('.sticky'));
        // set offset because 2 sticky menu bars width single height of 50px
        setTimeout(() => {
            this.sections = [
                { id: 'section1', name: 'Section 1' },
                { id: 'section2', name: 'Section 2' },
                { id: 'section3', name: 'Section 3' }
            ];
        });
    }
}
