import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FileDropComponent } from './file-drop.component';
import { FileUploaderModule } from '../../../module';

@NgModule({
    declarations: [
        FileDropComponent
    ],
    imports: [ FileUploaderModule, CommonModule ],
    exports: [
        FileDropComponent
    ]
})
export class FileDropModule {
}
