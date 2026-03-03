# FileSizePipe

The `FileSizePipe` formats file sizes into human-readable strings.

## Usage

Import the pipe in your standalone component:

```typescript
import { Component } from '@angular/core';
import { FileSizePipe } from '@uniprank/ngx-file-uploader';

@Component({
    selector: 'app-example',
    standalone: true,
    imports: [FileSizePipe],
    template: `
        @for (file of uploader.queue(); track file.id) {
            <span>{{ file?.size | fileSize }}</span>
        }
    `
})
export class ExampleComponent {
    // ...
}
```

## Output Examples

| Input (bytes) | Output |
|--------------|--------|
| 0 | 0 Bytes |
| 1024 | 1 KB |
| 1048576 | 1 MB |
| 1073741824 | 1 GB |

## Pipe Name

Use `fileSize` in templates: `{{ value | fileSize }}`
