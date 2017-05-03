import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { FileUploaderModule } from '../module';

import { FileDropModule } from './components/file-drop/file-drop.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    FileUploaderModule,
    FileDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
