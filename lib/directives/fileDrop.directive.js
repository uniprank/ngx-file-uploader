"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:max-line-length
// tslint:disable:no-unused-expression
var core_1 = require("@angular/core");
var fileManager_core_1 = require("../source/fileManager.core");
//
// Directive to support dragging and dropping and element onto a div
//
var FileDropDirective = (function () {
    //
    // Constructor requires an element reference that instantiated this directive
    //
    function FileDropDirective(element, renderer) {
        this.element = element;
        this.renderer = renderer;
        this.fileHoverStart = new core_1.EventEmitter();
        this.fileHoverEnd = new core_1.EventEmitter();
        this.fileAccepted = new core_1.EventEmitter();
        this.fileRejected = new core_1.EventEmitter();
        this._InputFile = null;
    }
    //
    // Initialisation
    //
    FileDropDirective.prototype.ngOnInit = function () {
        this._files = [];
        this.renderer.setElementClass(this.element.nativeElement, 'drop-area', true);
    };
    FileDropDirective.prototype.ngOnDestroy = function () {
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
    // Called when the element has content dragged over
    //
    FileDropDirective.prototype.onDragOver = function (event) {
        // If we're already in the on-drag, don't bother with this
        if (this._InputFile === null) {
            // Get the object being dragged and reference it as a copy action
            this._InputFile = this.getDataTransferObject(event);
            if (this._InputFile === null) {
                return;
            }
            this.renderer.setElementClass(this.element.nativeElement, 'drop-enter', true);
            var _dropValueText = 'Drop now';
            this.renderer.setElementAttribute(this.element.nativeElement, 'dropValueText', _dropValueText);
            // Let the client know
            this.fileHoverStart.emit();
        }
        // Don't propagate
        this.preventAndStopEventPropagation(event);
    };
    //
    // Called when the element has dragged content leave
    //
    FileDropDirective.prototype.onDragLeave = function (event) {
        // Only bother if we have a file
        if (this._InputFile !== null) {
            this.renderer.setElementClass(this.element.nativeElement, 'drop-enter', false);
            this.renderer.setElementAttribute(this.element.nativeElement, 'dropValueText', '');
            // Finished with the file
            this._InputFile = null;
            if (event.currentTarget === this.element[0]) {
                return;
            }
            // Let the client know
            this.fileHoverEnd.emit();
        }
        // Don't let it continue
        this.preventAndStopEventPropagation(event);
    };
    //
    // Called when the element has content dropped
    //
    FileDropDirective.prototype.onDrop = function (event) {
        // Only bother if we have a file
        if (this._InputFile !== null) {
            this.renderer.setElementClass(this.element.nativeElement, 'drop-enter', false);
            this.renderer.setElementAttribute(this.element.nativeElement, 'dropValueText', '');
            // Let the client know
            this.fileHoverEnd.emit();
            // Update our data
            this._InputFile = this.getDataTransferObject(event);
            if (this._InputFile.files.length === 0) {
                this._InputFile = null;
                return;
            }
            var filesData = this._InputFile.files;
            if (!this.hasFiles(this._InputFile.types)) {
                return;
            }
            this.readFile(filesData);
            this.fileAccepted.emit(this._files);
            // Finished with the file
            this._InputFile = null;
        }
        // Don't let it continue
        this.preventAndStopEventPropagation(event);
    };
    //
    // Stops the drag/drop events propagating
    //
    FileDropDirective.prototype.preventAndStopEventPropagation = function (event) {
        event.preventDefault();
        event.stopPropagation();
    };
    FileDropDirective.prototype.readFile = function (_files) {
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
    FileDropDirective.prototype.getDataTransferObject = function (event) {
        return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer;
    };
    FileDropDirective.prototype.hasFiles = function (types) {
        if (!types) {
            return false;
        }
        if (types.indexOf) {
            return types.indexOf('Files') !== -1;
        }
        if (types.contains) {
            return types.contains('Files');
        }
        return false;
    };
    return FileDropDirective;
}());
FileDropDirective.decorators = [
    { type: core_1.Directive, args: [{
                // Selector required in component HTML
                // tslint:disable-next-line:directive-selector
                selector: '[ng2File2Drop]'
            },] },
];
/** @nocollapse */
FileDropDirective.ctorParameters = function () { return [
    { type: core_1.ElementRef, },
    { type: core_1.Renderer, },
]; };
FileDropDirective.propDecorators = {
    'fileHoverStart': [{ type: core_1.Output },],
    'fileHoverEnd': [{ type: core_1.Output },],
    'fileAccepted': [{ type: core_1.Output },],
    'fileRejected': [{ type: core_1.Output },],
    'fileOptions': [{ type: core_1.Input },],
    'uploader': [{ type: core_1.Input },],
    'onDragOver': [{ type: core_1.HostListener, args: ['dragover', ['$event'],] },],
    'onDragLeave': [{ type: core_1.HostListener, args: ['dragleave', ['$event'],] },],
    'onDrop': [{ type: core_1.HostListener, args: ['drop', ['$event'],] },],
};
exports.FileDropDirective = FileDropDirective;
//# sourceMappingURL=fileDrop.directive.js.map