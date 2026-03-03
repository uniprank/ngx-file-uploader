# FileUploadService

The `FileUploadService` provides a central registry for managing multiple file uploaders across your application.

## Basic Usage

```typescript
import { Component, OnInit } from '@angular/core';
import { FileUploadService, FileUploader } from '@uniprank/ngx-file-uploader';

@Component({
    selector: 'app-example',
    standalone: true,
    imports: [],
    template: ''
})
export class ExampleComponent implements OnInit {
    public uploader!: FileUploader;

    constructor(private fileUploadService: FileUploadService) {}

    ngOnInit() {
        // Register an uploader
        this.fileUploadService.registerUploadService(
            'myUploader',
            new FileUploader({ url: 'http://localhost:3000/api/upload' })
        );

        // Use Angular's HttpClient protocol
        this.fileUploadService.useAngularProtocol('myUploader');

        // Get the uploader
        this.uploader = this.fileUploadService.getUploader('myUploader');
    }
}
```

## Default Configuration

When using `provideNgxFileUploader()` with config, a default uploader is automatically registered:

```typescript
// app.config.ts
provideNgxFileUploader({
    url: 'http://localhost:3000/api/upload',
    autoUpload: true
})
```

```typescript
// In your component
const uploader = this.fileUploadService.getUploader('default');
```

## Service Methods

| Method | Description |
|--------|-------------|
| `registerUploadService(name, uploader)` | Register a named uploader |
| `getUploader(name)` | Get a registered uploader by name |
| `useAngularProtocol(name)` | Use Angular HttpClient for uploads |
