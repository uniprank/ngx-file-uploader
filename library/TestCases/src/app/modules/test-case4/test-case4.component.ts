import { Component, OnInit, ElementRef } from '@angular/core';

@Component({
    selector: 'uni-test-case4',
    templateUrl: './test-case4.component.html',
    styleUrls: ['./test-case4.component.scss']
})
export class TestCase4Component implements OnInit {
    public markdown = require('raw-loader!./README.md');
    public sections: Array<any> = [];

    constructor() {}

    ngOnInit() {}
}
