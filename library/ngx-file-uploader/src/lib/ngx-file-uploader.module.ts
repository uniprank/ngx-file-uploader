import { NgModule, ModuleWithProviders } from '@angular/core';

import { TransferOptionsInterface } from './interfaces';
import { FILE_UPLOADER_CONFIG, FileUploadService } from './services/file-upload.service';
import { ImagePreviewDirective, FileSelectDirective, FileDropDirective, ProgressBarDirective } from './directives';
import { FileSizePipe } from './pipes';

const providers = [FileUploadService];
const directives = [FileDropDirective, FileSelectDirective, ImagePreviewDirective, ProgressBarDirective];
const pipes = [FileSizePipe];

@NgModule({
    declarations: [...directives, ...pipes],
    imports: [],
    exports: [...directives, ...pipes]
})
export class NgxFileUploaderModule {
    public static forRoot(parameters: TransferOptionsInterface = {}): ModuleWithProviders {
        return {
            ngModule: NgxFileUploaderModule,
            providers: [...providers, { provide: FILE_UPLOADER_CONFIG, useValue: parameters }]
        };
    }
}
