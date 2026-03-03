# Directives

You can find the complete test case at GitHub. [Test Case](https://github.com/uniprank/ngx-file-uploader/tree/master/library/TestCases/src/app/modules/test-case1)

## File Drop (directive -> ngxFile2Drop)

Link an uploader to the directive to enable drag & drop file upload.

```html
<div ngxFile2Drop [uploader]="uploader"></div>
```

## File Select (directive -> ngxFile2Select)

Link an uploader to allow file selection via input.

```html
<input ngxFile2Select type="file" id="file" multiple [uploader]="uploader" />
```

## Image Preview (directive -> imgPreview)

Display a preview of a file from the uploader queue.

```html
@for (file of uploader.queue(); track file.id) {
    <img src="" imgPreview [image]="file" />
}
```

## Progress Bar (directive -> progressBar)

Show upload progress for a file.

```html
@for (file of uploader.queue(); track file.id) {
    <progress progressBar [progress]="file?.progressDetail()" max="100"></progress>
}
```
