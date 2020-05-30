import { NgModule, ModuleWithProviders } from '@angular/core';

import { TransferOptionsInterface } from './interfaces';
import { FILE_UPLOADER_CONFIG, FileUploadService } from './services/file-upload.service';

import { FileSizePipe } from './pipes/file-size.pipe';
import { FileDropDirective } from './directives/file-drop.directive';
import { FileSelectDirective } from './directives/file-select.directive';
import { ImagePreviewDirective } from './directives/img-preview.directive';
import { ProgressBarDirective } from './directives/progress-bar.directive';

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
