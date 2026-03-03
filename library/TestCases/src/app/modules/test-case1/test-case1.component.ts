import { Component, OnDestroy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
    FileUploadService,
    FileUploader,
    FileFilter,
    HookTypeEnum,
    UploaderHook,
    FileManager,
    FileManagerInterface,
    FileDropDirective,
    FileSelectDirective,
    ImagePreviewDirective,
    ProgressBarDirective,
    FileSizePipe
} from '@uniprank/ngx-file-uploader';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'uni-test-case1',
    standalone: true,
    imports: [CommonModule, FormsModule, FileDropDirective, FileSelectDirective, ImagePreviewDirective, ProgressBarDirective, FileSizePipe],
    templateUrl: './test-case1.component.html',
    styleUrls: ['./test-case1.component.scss']
})
export class TestCase1Component implements OnDestroy {
    public uploader: FileUploader;
    public hasFiles: boolean = false;
    public activeHooks: string[];
    public previewFile: FileManagerInterface | null = null;

    constructor(
        private _fileUploadService: FileUploadService,
        private _httpClient: HttpClient
    ) {
        this.uploader = new FileUploader({
            url: 'https://api.uniprank.com/imageupload/api/upload',
            removeBySuccess: false,
            autoUpload: false,
            filters: [new FileFilter('only:JPG/PNG/GIF', new RegExp('image/jpeg|image/png|image/gif'), 'type')]
        });

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
                if (file.success && file.isUploaded()) {
                    this._httpClient.delete(`https://api.uniprank.com/imageupload/api/delete/${file.name}`).subscribe();
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

        effect(() => {
            this.hasFiles = this.uploader.queue().length > 0;
        });

        this.activeHooks = this.uploader.activeHooks();
    }

    ngOnDestroy() {
        this.uploader.destroy();
    }

    public openPreview(file: FileManagerInterface) {
        this.previewFile = file;
    }

    public closePreview() {
        this.previewFile = null;
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
