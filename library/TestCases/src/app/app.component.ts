import { Component, ElementRef, OnInit } from '@angular/core';

import * as Stickyfill from 'stickyfilljs';
import { Router } from '@angular/router';

@Component({
    selector: 'uni-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    constructor(private _host: ElementRef, private router: Router) {
        const path = localStorage.getItem('path');
        if (path) {
            localStorage.removeItem('path');
            this.router.navigate([path]);
        }
    }

    ngOnInit() {
        Stickyfill.add(this._host.nativeElement.querySelector('header'));
    }
}
