"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var fileSelect_directive_1 = require("./directives/fileSelect.directive");
var fileDrop_directive_1 = require("./directives/fileDrop.directive");
var imgPreview_directive_1 = require("./directives/imgPreview.directive");
var progressBar_directive_1 = require("./directives/progressBar.directive");
var fileSizePipe_pipe_1 = require("./pipe/fileSizePipe.pipe");
var FileUploaderModule = (function () {
    function FileUploaderModule() {
    }
    return FileUploaderModule;
}());
FileUploaderModule.decorators = [
    { type: core_1.NgModule, args: [{
                declarations: [
                    fileSelect_directive_1.FileSelectDirective,
                    fileDrop_directive_1.FileDropDirective,
                    imgPreview_directive_1.ImagePreviewDirective,
                    progressBar_directive_1.ProgressBarDirective,
                    fileSizePipe_pipe_1.FileSizePipe
                ],
                exports: [
                    fileSelect_directive_1.FileSelectDirective,
                    fileDrop_directive_1.FileDropDirective,
                    imgPreview_directive_1.ImagePreviewDirective,
                    progressBar_directive_1.ProgressBarDirective,
                    fileSizePipe_pipe_1.FileSizePipe
                ],
                providers: []
            },] },
];
/** @nocollapse */
FileUploaderModule.ctorParameters = function () { return []; };
exports.FileUploaderModule = FileUploaderModule;
//# sourceMappingURL=module.js.map