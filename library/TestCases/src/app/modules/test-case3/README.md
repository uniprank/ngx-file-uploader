# Components

You can find the complete test case at GitHub. [Test Case](https://github.com/uniprank/ngx-file-uploader/tree/master/library/TestCases/src/app/modules/test-case1)

## Default setup for components

```typescript
...

import { FileUploader, FileFilter } from '@uniprank/ngx-file-uploader';

@Component({
    selector: 'uni-test-case1',
    templateUrl: './test-case1.component.html',
    styleUrls: ['./test-case1.component.scss']
})
export class TestCase1Component {
    public uploader: FileUploader;

    constructor() {
        this.uploader = new FileUploader({
            url: 'https://api.uniprank.com/imageupload/api/upload',
            removeBySuccess: false,
            autoUpload: false,
            filters: [new FileFilter('only:JPG/PNG/GIF', new RegExp('image/jpeg|image/png|image/gif'), 'type')]
        });
    }
}
```

Or maybe use the **FileUploadService** to get the uploader for our directives.

```typescript
...

import { FileUploadService, FileUploader, FileFilter } from '@uniprank/ngx-file-uploader';

@Component({
    selector: 'uni-test-case2',
    templateUrl: './test-case2.component.html',
    styleUrls: ['./test-case2.component.scss']
})
export class TestCase2Component implements OnInit {
    public uploader: FileUploader;

    constructor(private _fileUploadService: FileUploadService) {}

    ngOnInit(){
        try {
            // This works only if the forRoot was defined with a default configuration
            this.uploader = this._fileUploadService.getUploader('default');
        }catch(e) {
            // You can define a default uploader when the config wasn't set globaly
            this._fileUploadService.registerUploadService(
                'default',
                new FileUploader({
                    url: 'https://api.uniprank.com/imageupload/api/upload',
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
