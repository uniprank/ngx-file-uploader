import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

import * as Stickyfill from 'stickyfilljs';

import { FileUploadService } from '@uniprank/ngx-file-uploader';

@Component({
    selector: 'uni-test-case3',
    templateUrl: './test-case3.component.html',
    styleUrls: ['./test-case3.component.scss']
})
export class TestCase3Component implements OnInit, OnDestroy {
    public markdown = require('raw-loader!./README.md');
    public activeSection: BehaviorSubject<{ id?: string; elementId?: string; nativeElement?: HTMLElement }> = new BehaviorSubject({});

    private _subscription: Subscription;

    constructor(private _host: ElementRef) {}

    ngOnInit() {
        Stickyfill.add(this._host.nativeElement.querySelector('nav'));
    }

    ngOnDestroy() {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    }
}
