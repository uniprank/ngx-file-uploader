import { Directive, ElementRef, effect, input } from '@angular/core';

@Directive({ selector: 'img[imgPreview]', standalone: true })
export class ImagePreviewDirective {
    readonly image = input<any>();

    constructor(private el: ElementRef) {
        effect(() => {
            const img = this.image();
            const reader = new FileReader();
            const el = this.el;

            el.nativeElement.src =
                "data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg' viewBox%3D'0 0 200 150'%2F%3E";

            if (img) {
                reader.onloadend = () => {
                    el.nativeElement.src = reader.result;
                };
                reader.readAsDataURL(img.element);
            }
        });
    }
}
