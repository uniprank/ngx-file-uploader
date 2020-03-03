import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MarkdownModule } from 'ngx-markdown';

import { NgxFileUploaderModule } from '@uniprank/ngx-file-uploader';

import { TestCase5RoutingModule } from './test-case5-routing.module';
import { TestCase5Component } from './test-case5.component';

@NgModule({
    declarations: [TestCase5Component],
    imports: [CommonModule, MarkdownModule, TestCase5RoutingModule, NgxFileUploaderModule.forRoot()]
})
export class TestCase5Module {}
