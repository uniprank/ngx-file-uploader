import { NgModule, ModuleWithProviders } from '@angular/core';

import { TransferOptionsInterface } from './interfaces';
import { FILE_UPLOADER_CONFIG, FileUploadService } from './services/file-upload.service';
import { ImagePreviewDirective, FileSelectDirective, FileDropDirective, ProgressBarDirective } from './directives';
import { FileSizePipe } from './pipes';

/** @deprecated Use provideNgxFileUploader() and import standalone directives/pipes directly */
@NgModule({
    imports: [FileDropDirective, FileSelectDirective, ImagePreviewDirective, ProgressBarDirective, FileSizePipe],
    exports: [FileDropDirective, FileSelectDirective, ImagePreviewDirective, ProgressBarDirective, FileSizePipe]
})
export class NgxFileUploaderModule {
    /** @deprecated Use provideNgxFileUploader() instead */
    public static forRoot(parameters: TransferOptionsInterface = {}): ModuleWithProviders<NgxFileUploaderModule> {
        return {
            ngModule: NgxFileUploaderModule,
            providers: [FileUploadService, { provide: FILE_UPLOADER_CONFIG, useValue: parameters }]
        };
    }
}
