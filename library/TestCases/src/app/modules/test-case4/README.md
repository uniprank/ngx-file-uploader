# Directives

You can find the complete test case at GitHub. [Test Case](https://github.com/uniprank/ngx-file-uploader/tree/master/library/TestCases/src/app/modules/test-case1)

## File to upload (directive -> ngxFile2Drop)

Link a uploader to the directive

```html
<div ngxFile2Drop [uploader]="uploader"></div>
```

## Input type="file" select one or multiple files (directive -> ngxFile2Select)

Link a uploader to the directive

```html
<input ngxFile2Select type="file" id="file" multiple [uploader]="uploader" />
```

## Image preview (directive -> imgPreview)

You need the uploader queue or a selected file as image input. **[**file is type FileManager**]**

```html
<div *ngFor="let file of uploader.queue$ | async; let i = index">
    <picture [class.success]="file?.success" [class.error]="file?.error">
        <img src="" imgPreview [image]="file" />
    </picture>
</div>
```

## Active progress bar for upload (directive -> progressBar)

You need a FileManager object to get the valid Promise (**file.progress\$**)

```html
<div *ngFor="let file of uploader.queue$ | async; let i = index">
    <progress progressBar [progress]="file?.progress$ | async" max="100"></progress>
</div>
```
