# Components

You can find the complete test case at GitHub. [Test Case](https://github.com/uniprank/ngx-file-uploader/tree/master/library/TestCases/src/app/modules/test-case1)

## Standalone Component Setup

```typescript
import { Component, OnDestroy, effect } from '@angular/core';
import { FileUploader, FileFilter, FileDropDirective, FileSelectDirective, ImagePreviewDirective, ProgressBarDirective, FileSizePipe } from '@uniprank/ngx-file-uploader';

@Component({
    selector: 'uni-test-case1',
    standalone: true,
    imports: [FileDropDirective, FileSelectDirective, ImagePreviewDirective, ProgressBarDirective, FileSizePipe],
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

## Using the FileUploadService

```typescript
import { Component, OnInit } from '@angular/core';
import { FileUploadService, FileUploader, FileFilter } from '@uniprank/ngx-file-uploader';

@Component({
    selector: 'app-example',
    standalone: true,
    imports: [],
    template: ''
})
export class ExampleComponent implements OnInit {
    public uploader!: FileUploader;

    constructor(private _fileUploadService: FileUploadService) {}

    ngOnInit() {
        try {
            this.uploader = this._fileUploadService.getUploader('default');
        } catch (e) {
            this._fileUploadService.registerUploadService(
                'default',
                new FileUploader({
                    url: 'http://localhost:3000/api/upload',
                    removeBySuccess: false,
                    autoUpload: false,
                    filters: [new FileFilter('only:JPG/PNG/GIF', new RegExp('image/jpeg|image/png|image/gif'), 'type')]
                })
            );
            this._fileUploadService.useAngularProtocol('default');
            this.uploader = this._fileUploadService.getUploader('default');
        }
    }
}
```
