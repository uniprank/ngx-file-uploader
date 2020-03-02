import { Directive, ElementRef, Input, Renderer2, OnChanges } from '@angular/core';
import { FileSizePipe } from '../pipes/file-size.pipe';

// tslint:disable:directive-selector
@Directive({
    selector: 'progress[progressBar]'
})
export class ProgressBarDirective implements OnChanges {
    @Input() progress: any;

    constructor(private el: ElementRef, private renderer: Renderer2) {}

    ngOnChanges() {
        const el = this.el;
        el.nativeElement.value = this.progress.percent;
        if (this.progress.speed > 0) {
            const pipe = new FileSizePipe();
            this.renderer.setAttribute(this.el.nativeElement, 'speedText', pipe.transform(this.progress.loaded));
        } else {
            this.renderer.setAttribute(this.el.nativeElement, 'speedText', '');
        }
    }
}
