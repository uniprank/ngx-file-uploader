import { NgModule } from '@angular/core';

import { FileSelectDirective } from './directives/fileSelect.directive';
import { FileDropDirective } from './directives/fileDrop.directive';
import { ImagePreviewDirective } from './directives/imgPreview.directive';
import { ProgressBarDirective } from './directives/progressBar.directive';
import { FileSizePipe } from './pipe/fileSizePipe.pipe';

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
