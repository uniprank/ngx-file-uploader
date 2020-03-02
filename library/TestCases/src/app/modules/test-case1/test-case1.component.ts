import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';

import { FileUploadService, FileUploader, FileFilter, HookTypeEnum, UploaderHook, FileManager } from '@uniprank/ngx-file-uploader';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'uni-test-case1',
    templateUrl: './test-case1.component.html',
    styleUrls: ['./test-case1.component.scss']
})
export class TestCase1Component implements OnInit, OnDestroy {
    public markdown = require('raw-loader!./README.md');

    public uploader: FileUploader;
    public hasFiles: boolean;
    public activeHooks: string[];

    private _subs: Subscription;

    constructor(private _host: ElementRef, private _fileUploadService: FileUploadService, private _httpClient: HttpClient) {
        this.uploader = new FileUploader({
            url: 'https://api.uniprank.com/imageupload/api/upload',
            removeBySuccess: false,
            autoUpload: false,
            filters: [new FileFilter('only:JPG/PNG/GIF', new RegExp('image/jpeg|image/png|image/gif'), 'type')]
        });

        // this.hookName = HookTypeEnum[HookTypeEnum.successUploadFile];

        this.uploader.hook(
            new UploaderHook(
                HookTypeEnum.successUploadFile,
                (response: any, status: any, headers: any) => {
                    console.log('Hook', HookTypeEnum.successUploadFile, response, status, headers);
                },
                0
            )
        );

        /*
         *  Send data information
         */
        this.uploader.hook(
            new UploaderHook(HookTypeEnum.prepareUploadFile, (file: FileManager) => {
                file.bindOptions({
                    formData: {
                        filename: 'Extra FormData object'
                    }
                });
            })
        );

        /*
         *  Remove file from server
         */
        this.uploader.hook(
            new UploaderHook(HookTypeEnum.removeFile, (file: FileManager) => {
                if (file.success && file.isUploaded) {
                    this._httpClient.delete(`https://api.uniprank.com/imageupload/api/delete/${file.name}`).toPromise();
                }
            })
        );

        this.uploader.onBeforeUpload = (file: FileManager) => {
            file.bindOptions({
                formData: {
                    extend: 'Extend FormData'
                }
            });
        };

        this._subs = this.uploader.queue$.subscribe(
            (data: any) => {
                this.hasFiles = data.length > 0;
            },
            (error: any) => {
                throw new Error(error);
            }
        );

        this.activeHooks = this.uploader.activeHooks();
    }

    ngOnInit() {}

    ngOnDestroy() {
        if (this._subs) {
            this._subs.unsubscribe();
        }
        this.uploader.destroy();
    }

    public convertError(value: any): string {
        if (value != null) {
            try {
                return JSON.parse(value).error.text;
            } catch (e) {}
        }
        return '';
    }
}
