import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { 
    FileUploader, FileFilter, hookType, UploaderHook
} from '@uniprank/ngx-file-uploader';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
    public uploader: FileUploader;
    public hasFiles: boolean;
    public hookName: string;

    public title = 'app works!';

    private _subs: Subscription;

    constructor () {
        this.uploader = new FileUploader({
            url: 'https://uniprank.github.io/ngxfileuploader/example/',
            removeBySuccess: false,
            autoUpload: false,
            filters: [
                new FileFilter('only:JPG/PNG/GIF', new RegExp('image/jpeg|image/png|image/gif'), 'type')
            ]
        });

        this.hookName = hookType[hookType.successUploadFile];

        this.uploader.hook(new UploaderHook(
            hookType.successUploadFile,
            function(response: any, status: any, headers: any){
                console.log(this.hookName, response, status, headers);
            },
            0
        ));

        /*
         *  Send data information  
         */
        this.uploader.hook(new UploaderHook(
            hookType.prepareUploadFile,
            function(_file: FileManager){
                _file.bindOptions({
                    formData: [
                        {
                            filename: 'Dynamic Naming'
                        }
                    ]
                });
            }
        ));

        this.uploader.onBeforeUpload = (_file: FileManager) => {
            _file.bindOptions({
                formData: [
                    {
                        filename: 'Dynamic Naming'
                    }
                ]
            });
        };

        this._subs = this.uploader.queue$.subscribe((data: any) => {
            this.hasFiles = (data.length > 0);
        }, (error: any) => {
            throw new Error(error);
        });
    }

    ngOnDestroy() {
        if (this._subs) {
            this._subs.unsubscribe();
        }
        this.uploader.destroy();
    }
}
