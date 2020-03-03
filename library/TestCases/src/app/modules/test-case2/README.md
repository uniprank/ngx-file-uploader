# Basic Setup

You can find the complete test case at GitHub. [Test Case](https://github.com/uniprank/ngx-file-uploader/tree/master/library/TestCases/src/app/modules/test-case1)

## Global usage

Install via npm

```shell
npm i @uniprank/ngx-file-uploader
```

## Interfaces

> There are only two configurations which can be defined. The first one is the **TransferOptionsInterface** for the file uploader. The second one is for each file **FileManagerOptionsInterface**. With these configurations you can define a global configuration for all files with the second one you have the option to overwrite some of the configurations partialy.

### File Uploader Config

```typescript
TransferOptionsInterface {
    // Path to server where the files be uploaded
    url?: string;
    // File alias default is `file`
    alias?: string;
    // An object with header informations
    headers?: object;
    // A object of data to be sent along with the files
    formData?: object;
    // Request methode (default POST) - HTML5 only
    method?: 'POST' | 'PUT' | 'PATCH';
    // Activate CORS - HTML5 only
    enableCors?: boolean;
    // if you need credentials for the communication you can activate this option here
    withCredentials?: boolean;
    // A list of filters which are extend the default list (default list is empty)
    filters?: FileFilter[];
    // Don't allow to have the same image 2 times at the queue
    uniqueFiles?: boolean;
    // Remove file from queue when upload was successfull
    removeBySuccess?: boolean;
    // Automatically upload new files when they are adding to the queue
    autoUpload?: boolean;
}
```

### File Config

```typescript
// for all settings (default: use url from TransferOptionsInterface)
FileManagerOptionsInterface {
    // Path to server to which the file should be uploaded
    url?: string;
    // File alias default is `file`
    alias?: string;
    // An object with header informations
    headers?: object;
    // A list of data to be sent along with the files
    formData?: object;
    // Request methode (default POST) - HTML5 only
    method?: 'POST' | 'PUT' | 'PATCH';
    // Remove file from queue when upload was successfull
    removeBySuccess?: boolean;
    // Activate CORS - HTML5 only
    enableCors?: boolean;
    // if you need credentials for the communication you can activate this option here
    withCredentials?: any;
}
```

## App Root Module

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { NgxFileUploaderModule } from '@uniprank/ngx-file-uploader';

import { AppComponent } from './app.component';

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, HttpClientModule, NgxFileUploaderModule.forRoot()],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
```

## App Root Module with configuration for the angular service

> All parameters are optional

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { NgxFileUploaderModule, FileFilter } from '@uniprank/ngx-file-uploader';

import { AppComponent } from './app.component';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        HttpClientModule,
        NgxFileUploaderModule.forRoot({
            url: 'https://simple.rest.api.com/service/for/upload',
            method: 'POST',
            filters: [new FileFilter('only:JPG/PNG/GIF', new RegExp('image/jpeg|image/png|image/gif'), 'type')]
        } as TransferOptionsInterface)
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
```
