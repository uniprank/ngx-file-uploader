import { Component, OnInit, ElementRef } from '@angular/core';
import { FileUploadService, FileUploader } from '@uniprank/ngx-file-uploader';

import * as Stickyfill from 'stickyfilljs';

@Component({
    selector: 'uni-test-case2',
    templateUrl: './test-case2.component.html',
    styleUrls: ['./test-case2.component.scss']
})
export class TestCase2Component implements OnInit {
    public markdown = require('raw-loader!./README.md');

    public uploader: FileUploader;

    constructor(private _host: ElementRef, private _fileUploadService: FileUploadService) {}

    ngOnInit() {}
}
