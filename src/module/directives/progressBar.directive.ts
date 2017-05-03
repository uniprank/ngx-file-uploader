import { Directive, ElementRef, Input, Renderer, OnChanges } from '@angular/core';
import { FileSizePipe } from '../pipe/fileSizePipe.pipe';

// tslint:disable:directive-selector
@Directive({
    selector: 'progress[progressBar]'
})
export class ProgressBarDirective implements OnChanges {
    @Input() progress: any;

    constructor(private el: ElementRef, private renderer: Renderer) { }

    ngOnChanges() {
        let el = this.el;
        el.nativeElement.value = this.progress.percent;
        if (this.progress.speed > 0) {
            let pipe = new FileSizePipe();
            this.renderer.setElementAttribute(this.el.nativeElement, 'speedText', pipe.transform(this.progress.loaded));
        } else {
            this.renderer.setElementAttribute(this.el.nativeElement, 'speedText', '');
        }
    }
}
