import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MarkdownModule } from 'ngx-markdown';

import { NgxFileUploaderModule } from '@uniprank/ngx-file-uploader';

import { TestCase3RoutingModule } from './test-case3-routing.module';
import { TestCase3Component } from './test-case3.component';

@NgModule({
    declarations: [TestCase3Component],
    imports: [CommonModule, MarkdownModule, TestCase3RoutingModule, NgxFileUploaderModule.forRoot()]
})
export class TestCase3Module {}
