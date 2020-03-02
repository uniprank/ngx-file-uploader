import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InnerTestComponent } from './inner-test.component';

import { NgxFileUploaderModule } from '@uniprank/ngx-file-uploader';

@NgModule({
    declarations: [InnerTestComponent],
    imports: [CommonModule, NgxFileUploaderModule],
    exports: [InnerTestComponent]
})
export class InnerTestModule {}
