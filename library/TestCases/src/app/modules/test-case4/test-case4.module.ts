import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MarkdownModule } from 'ngx-markdown';

import { NgxFileUploaderModule } from '@uniprank/ngx-file-uploader';

import { TestCase4RoutingModule } from './test-case4-routing.module';
import { TestCase4Component } from './test-case4.component';

@NgModule({
    declarations: [TestCase4Component],
    imports: [CommonModule, MarkdownModule, TestCase4RoutingModule, NgxFileUploaderModule.forRoot()]
})
export class TestCase4Module {}
