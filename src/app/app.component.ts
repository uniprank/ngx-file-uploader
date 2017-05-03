import { Component } from '@angular/core';

import { Transfer, FileUploader, FileFilter, hookType, UploaderHook } from '../module';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public uploader: Transfer;
  public hasFiles: boolean;
  public hookName: string;

  public title = 'app works!';

  constructor () {
        this.uploader = new FileUploader({
            url: 'https://uniprank.github.io/ngx-file-uploader/example/',
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

        this.uploader.queue$.subscribe((data: any) => {
            this.hasFiles = (data.length > 0);
        });
        return;
    }
}
