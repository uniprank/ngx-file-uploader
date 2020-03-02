You can find the complete test case at GitHub. [Test Case 1](https://github.com/uniprank/ngx-scrollspy/tree/master/library/TestCases/src/app/modules/test-case1)

## Description

This is a simple setup for this file uploader. Based on the Test-Case-1 component. You can see all based functions.

## TestCase1Component

```ts
@Component({
    selector: 'uni-test-case1',
    templateUrl: './test-case1.component.html',
    styleUrls: ['./test-case1.component.scss']
})
export class TestCase1Component implements OnInit, OnDestroy {
    public uploader: FileUploader;
    private _subs: Subscription;

    constructor(private _host: ElementRef, private _fileUploadService: FileUploadService, private _httpClient: HttpClient) {
        this.uploader = new FileUploader({
            url: 'https://api.uniprank.com/imageupload/api/upload',
            removeBySuccess: false,
            autoUpload: false,
            filters: [new FileFilter('only:JPG/PNG/GIF', new RegExp('image/jpeg|image/png|image/gif'), 'type')]
        });
    }

    ngOnDestroy() {
        if (this._subs) {
            this._subs.unsubscribe();
        }
        this.uploader.destroy();
    }
}
```

## TestCase1Component HTML

```html
<section>
    <div ngxFile2Drop [uploader]="uploader"></div>
</section>
<section>
    <table>
        <caption>
            Files in queue
            <strong [innerHTML]="(uploader.queue$ | async)?.length"></strong>
        </caption>
        <thead>
            <tr>
                <th>Preview</th>
                <th>Name</th>
                <th>Progress</th>
                <th>Details</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody *ngIf="(uploader.queue$ | async) as queuedFiles">
            <tr *ngFor="let file of queuedFiles; let i = index">
                <td class="image">
                    <picture [class.success]="file?.success" [class.error]="file?.error" [attr.data-error]="convertError(file?.response)">
                        <img src="" imgPreview [image]="file" />
                    </picture>
                </td>
                <td><span [innerHTML]="file?.name"></span></td>
                <td><progress progressBar [progress]="file?.progress$ | async" max="100"></progress></td>
                <td>
                    <div class="fileDetails">
                        <table>
                            <tr>
                                <th>Type</th>
                                <td><span [innerHTML]="file?.type"></span></td>
                            </tr>
                            <tr>
                                <th>Size</th>
                                <td>
                                    <span>{{ file?.size | fileSize }}</span>
                                </td>
                            </tr>
                            <tr>
                                <th>Date</th>
                                <td>
                                    <span>{{ file?.date | date: 'dd.MM.yyyy' }}</span>
                                </td>
                            </tr>
                            <tr>
                                <th>Time</th>
                                <td>
                                    <span>{{ file?.date | date: 'hh:mm:ss' }}</span>
                                </td>
                            </tr>
                        </table>
                    </div>
                </td>
                <td class="actions">
                    <button type="button" class="btn btn-success" (click)="file?.upload()" [disabled]="!file?.canUpload()">
                        Upload
                    </button>
                    <button type="button" class="btn btn-warning" (click)="file?.cancel()" [disabled]="!file?.isUploading()">
                        Cancel
                    </button>
                    <button type="button" class="btn btn-danger" (click)="file?.remove()">Remove</button>
                </td>
            </tr>
        </tbody>
        <tfoot *ngIf="(uploader.queue$ | async) as queuedFiles">
            <tr>
                <td colspan="5">
                    <button type="button" *ngIf="queuedFiles.length > 0" (click)="uploader.upload()">Upload All</button>
                    <button type="button" *ngIf="queuedFiles.length > 0" (click)="uploader.cancel()">Cancel All</button>
                    <button type="button" *ngIf="queuedFiles.length > 0" (click)="uploader.remove()">Remove All</button>
                </td>
            </tr>
        </tfoot>
    </table>
</section>
```
