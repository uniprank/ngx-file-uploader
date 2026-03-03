# Basic Setup

You can find the complete test case at GitHub. [Test Case](https://github.com/uniprank/ngx-file-uploader/tree/master/library/TestCases/src/app/modules/test-case1)

## Installation

```shell
npm i @uniprank/ngx-file-uploader
```

## Interfaces

> There are two main configuration interfaces. **TransferOptionsInterface** for the file uploader and **FileManagerOptionsInterface** for individual files.

### File Uploader Config

```typescript
TransferOptionsInterface {
    url?: string;
    alias?: string;
    headers?: object;
    formData?: object;
    method?: 'POST' | 'PUT' | 'PATCH';
    enableCors?: boolean;
    withCredentials?: boolean;
    filters?: FileFilter[];
    uniqueFiles?: boolean;
    removeBySuccess?: boolean;
    autoUpload?: boolean;
}
```

### File Config

```typescript
FileManagerOptionsInterface {
    url?: string;
    alias?: string;
    headers?: object;
    formData?: object;
    method?: 'POST' | 'PUT' | 'PATCH';
    removeBySuccess?: boolean;
    enableCors?: boolean;
    withCredentials?: any;
}
```

## App Configuration (Standalone)

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideNgxFileUploader } from '@uniprank/ngx-file-uploader';

export const appConfig: ApplicationConfig = {
    providers: [
        provideHttpClient(),
        provideNgxFileUploader()
    ]
};
```

## App Configuration with default options

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideNgxFileUploader, FileFilter } from '@uniprank/ngx-file-uploader';

export const appConfig: ApplicationConfig = {
    providers: [
        provideHttpClient(),
        provideNgxFileUploader({
            url: 'https://your-api.com/upload',
            method: 'POST',
            filters: [new FileFilter('only:JPG/PNG/GIF', new RegExp('image/jpeg|image/png|image/gif'), 'type')]
        })
    ]
};
```

## Bootstrap

```typescript
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig);
```
