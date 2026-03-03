You can find the complete test case at GitHub. [Test Case](https://github.com/uniprank/ngx-file-uploader/tree/master/library/TestCases/src/app/modules/test-case1)

## Description

This is a full demo of the file uploader with drag & drop, file selection, upload progress, and file management.

## TestCase1Component

```typescript
import { Component, OnDestroy, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
    FileUploadService, FileUploader, FileFilter,
    HookTypeEnum, UploaderHook, FileManager,
    FileDropDirective, FileSelectDirective,
    ImagePreviewDirective, ProgressBarDirective, FileSizePipe
} from '@uniprank/ngx-file-uploader';

@Component({
    selector: 'uni-test-case1',
    standalone: true,
    imports: [FormsModule, FileDropDirective, FileSelectDirective, ImagePreviewDirective, ProgressBarDirective, FileSizePipe],
    templateUrl: './test-case1.component.html',
    styleUrls: ['./test-case1.component.scss']
})
export class TestCase1Component implements OnDestroy {
    public uploader: FileUploader;
    public hasFiles = false;

    constructor() {
        this.uploader = new FileUploader({
            url: 'http://localhost:3000/api/upload',
            removeBySuccess: false,
            autoUpload: false,
            filters: [new FileFilter('only:JPG/PNG/GIF', new RegExp('image/jpeg|image/png|image/gif'), 'type')]
        });

        effect(() => {
            this.hasFiles = this.uploader.queue().length > 0;
        });
    }

    ngOnDestroy() {
        this.uploader.destroy();
    }
}
```

## Template (Key Parts)

```html
<div ngxFile2Drop [uploader]="uploader"></div>

<input ngxFile2Select type="file" multiple [uploader]="uploader" />

@if (hasFiles) {
    @for (file of uploader.queue(); track file.id) {
        <img imgPreview [image]="file" />
        <progress progressBar [progress]="file?.progressDetail()" max="100"></progress>
        <button (click)="file?.upload()" [disabled]="!file?.canUpload()">Upload</button>
        <button (click)="file?.remove()">Remove</button>
    }
}
```
