import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

let {
    FileReader
} = (<any>window);

// tslint:disable-next-line:directive-selector
@Directive({ selector: 'img[imgPreview]' })
export class ImagePreviewDirective implements OnChanges {

    @Input() image: any;

    constructor(private el: ElementRef) { }

    ngOnChanges() {
        let reader = new FileReader();
        let el = this.el;

        // tslint:disable-next-line:max-line-length
        el.nativeElement.src = 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D\'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg\' viewBox%3D\'0 0 200 150\'%2F%3E';

        reader.onloadend = function () {
            el.nativeElement.src = reader.result;
        };

        if (this.image) {
            return reader.readAsDataURL(this.image.element);
        }
    }
}
