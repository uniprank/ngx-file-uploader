import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MarkdownModule } from 'ngx-markdown';

import { NgxFileUploaderModule } from '@uniprank/ngx-file-uploader';

import { TestCase2RoutingModule } from './test-case2-routing.module';
import { TestCase2Component } from './test-case2.component';

@NgModule({
    declarations: [TestCase2Component],
    imports: [CommonModule, MarkdownModule, TestCase2RoutingModule, NgxFileUploaderModule.forRoot()]
})
export class TestCase2Module {}
