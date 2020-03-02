import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InnerTestComponent } from './inner-test.component';

@NgModule({
    declarations: [InnerTestComponent],
    imports: [CommonModule],
    exports: [InnerTestComponent]
})
export class InnerTestModule {}
