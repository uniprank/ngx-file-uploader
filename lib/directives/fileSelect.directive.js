"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:max-line-length
// tslint:disable:no-unused-expression
var core_1 = require("@angular/core");
var fileManager_core_1 = require("../source/fileManager.core");
//
// Directive to support select file from inputfield
//
var FileSelectDirective = (function () {
    //
    // Constructor requires an element reference that instantiated this directive
    //
    function FileSelectDirective() {
        this.role = 'input';
        this.type = 'file';
        this.fileHoverStart = new core_1.EventEmitter();
        this.fileHoverEnd = new core_1.EventEmitter();
        this.fileAccepted = new core_1.EventEmitter();
        this.fileRejected = new core_1.EventEmitter();
        this._InputFile = null;
    }
    //
    // Initialisation
    //
    FileSelectDirective.prototype.ngOnInit = function () {
        this._files = [];
    };
    FileSelectDirective.prototype.ngOnDestroy = function () {
        if (this._files.length > 0) {
            for (var _i = 0, _a = this._files; _i < _a.length; _i++) {
                var _file = _a[_i];
                if (_file instanceof fileManager_core_1.FileManager) {
                    if (!_file.isUploaded()) {
                        _file.cancel();
                        this.uploader.removeFile(_file);
                    }
                }
            }
        }
    };
    //
    // Called when the element was choosen
    //
    FileSelectDirective.prototype.onChange = function (event) {
        // Update our data
        this._InputFile = this.getEventTarget(event);
        if (this._InputFile.files.length === 0) {
            this._InputFile = null;
            return;
        }
        var filesData = this._InputFile.files;
        console.log('onChange', filesData);
        this.readFile(filesData);
        this.fileAccepted.emit(this._files);
        // Finished with the file
        this._InputFile = null;
        // Don't let it continue
        this.preventAndStopEventPropagation(event);
    };
    //
    // Stops the drag/drop events propagating
    //
    FileSelectDirective.prototype.preventAndStopEventPropagation = function (event) {
        event.preventDefault();
        event.stopPropagation();
    };
    FileSelectDirective.prototype.readFile = function (_files) {
        var fmObject;
        for (var i = 0; i < _files.length; i++) {
            var file = _files[i];
            try {
                fmObject = new fileManager_core_1.FileManager(file, this.fileOptions, this.uploader);
            }
            catch (e) {
                if (e.status === 100) {
                    this.fileRejected.emit(e);
                }
                else {
                    this.fileRejected.emit(e);
                }
                throw new Error('Something goes wrong e: ' + e.message);
            }
            (fmObject.inQueue) && this._files.push(fmObject);
        }
    };
    //
    // Returns the file dragged into the directive
    //
    FileSelectDirective.prototype.getEventTarget = function (event) {
        return event.target;
    };
    return FileSelectDirective;
}());
FileSelectDirective.decorators = [
    { type: core_1.Directive, args: [{
                // Selector required in component HTML
                // tslint:disable-next-line:directive-selector
                selector: '[ng2File2Select]'
            },] },
];
/** @nocollapse */
FileSelectDirective.ctorParameters = function () { return []; };
FileSelectDirective.propDecorators = {
    'role': [{ type: core_1.HostBinding, args: ['attr.role',] },],
    'type': [{ type: core_1.HostBinding, args: ['attr.type',] },],
    'fileHoverStart': [{ type: core_1.Output },],
    'fileHoverEnd': [{ type: core_1.Output },],
    'fileAccepted': [{ type: core_1.Output },],
    'fileRejected': [{ type: core_1.Output },],
    'fileOptions': [{ type: core_1.Input },],
    'uploader': [{ type: core_1.Input },],
    'onChange': [{ type: core_1.HostListener, args: ['change', ['$event'],] },],
};
exports.FileSelectDirective = FileSelectDirective;
//# sourceMappingURL=fileSelect.directive.js.map