import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

const { FileReader } = <any>window;

// tslint:disable-next-line:directive-selector
@Directive({ selector: 'img[imgPreview]' })
export class ImagePreviewDirective implements OnChanges {
    @Input() image: any;

    constructor(private el: ElementRef, renderer2: Renderer2) {}

    ngOnChanges() {
        const reader = new FileReader();
        const el = this.el;

        el.nativeElement.src =
            // tslint:disable-next-line: quotemark
            "data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg' viewBox%3D'0 0 200 150'%2F%3E";

        reader.onloadend = () => {
            el.nativeElement.src = reader.result;
        };

        if (this.image) {
            return reader.readAsDataURL(this.image.element);
        }
    }
}
