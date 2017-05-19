import { NgModule } from '@angular/core';

import {
    ProgressBarDirective, FileSelectDirective,
    FileDropDirective, ImagePreviewDirective
} from './directives';
import { FileSizePipe } from './pipe';

@NgModule({
    declarations: [
        FileSelectDirective,
        FileDropDirective,
        ImagePreviewDirective,
        ProgressBarDirective,
        FileSizePipe
    ],
    exports: [
        FileSelectDirective,
        FileDropDirective,
        ImagePreviewDirective,
        ProgressBarDirective,
        FileSizePipe
    ],
    providers: []
})
export class FileUploaderModule {
}
