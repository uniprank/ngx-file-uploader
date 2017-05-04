"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var fileSizePipe_pipe_1 = require("../pipe/fileSizePipe.pipe");
// tslint:disable:directive-selector
var ProgressBarDirective = (function () {
    function ProgressBarDirective(el, renderer) {
        this.el = el;
        this.renderer = renderer;
    }
    ProgressBarDirective.prototype.ngOnChanges = function () {
        var el = this.el;
        el.nativeElement.value = this.progress.percent;
        if (this.progress.speed > 0) {
            var pipe = new fileSizePipe_pipe_1.FileSizePipe();
            this.renderer.setElementAttribute(this.el.nativeElement, 'speedText', pipe.transform(this.progress.loaded));
        }
        else {
            this.renderer.setElementAttribute(this.el.nativeElement, 'speedText', '');
        }
    };
    return ProgressBarDirective;
}());
ProgressBarDirective.decorators = [
    { type: core_1.Directive, args: [{
                selector: 'progress[progressBar]'
            },] },
];
/** @nocollapse */
ProgressBarDirective.ctorParameters = function () { return [
    { type: core_1.ElementRef, },
    { type: core_1.Renderer, },
]; };
ProgressBarDirective.propDecorators = {
    'progress': [{ type: core_1.Input },],
};
exports.ProgressBarDirective = ProgressBarDirective;
//# sourceMappingURL=progressBar.directive.js.map