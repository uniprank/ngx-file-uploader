import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MarkdownModule } from 'ngx-markdown';

import { NgxFileUploaderModule } from '@uniprank/ngx-file-uploader';

import { TestCase6RoutingModule } from './test-case6-routing.module';
import { TestCase6Component } from './test-case6.component';

@NgModule({
    declarations: [TestCase6Component],
    imports: [CommonModule, MarkdownModule, TestCase6RoutingModule, NgxFileUploaderModule.forRoot()]
})
export class TestCase6Module {}
