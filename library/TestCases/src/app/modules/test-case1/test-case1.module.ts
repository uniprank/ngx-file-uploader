import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MarkdownModule } from 'ngx-markdown';

import { NgxFileUploaderModule } from '@uniprank/ngx-file-uploader';

import { TestCase1RoutingModule } from './test-case1-routing.module';
import { TestCase1Component } from './test-case1.component';

@NgModule({
    declarations: [TestCase1Component],
    imports: [CommonModule, MarkdownModule, TestCase1RoutingModule, FormsModule, NgxFileUploaderModule.forRoot()]
})
export class TestCase1Module {}
