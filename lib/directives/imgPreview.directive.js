"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var FileReader = window.FileReader;
// tslint:disable-next-line:directive-selector
var ImagePreviewDirective = (function () {
    function ImagePreviewDirective(el) {
        this.el = el;
    }
    ImagePreviewDirective.prototype.ngOnChanges = function () {
        var reader = new FileReader();
        var el = this.el;
        // tslint:disable-next-line:max-line-length
        el.nativeElement.src = 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D\'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg\' viewBox%3D\'0 0 200 150\'%2F%3E';
        reader.onloadend = function () {
            el.nativeElement.src = reader.result;
        };
        if (this.image) {
            return reader.readAsDataURL(this.image.element);
        }
    };
    return ImagePreviewDirective;
}());
ImagePreviewDirective.decorators = [
    { type: core_1.Directive, args: [{ selector: 'img[imgPreview]' },] },
];
/** @nocollapse */
ImagePreviewDirective.ctorParameters = function () { return [
    { type: core_1.ElementRef, },
]; };
ImagePreviewDirective.propDecorators = {
    'image': [{ type: core_1.Input },],
};
exports.ImagePreviewDirective = ImagePreviewDirective;
//# sourceMappingURL=imgPreview.directive.js.map