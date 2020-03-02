import { Component, ElementRef, OnInit } from '@angular/core';

import * as Stickyfill from 'stickyfilljs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    constructor(private _host: ElementRef) {}

    ngOnInit() {
        Stickyfill.add(this._host.nativeElement.querySelector('header'));
    }
}
