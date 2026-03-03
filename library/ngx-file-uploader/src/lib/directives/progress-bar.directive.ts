import { Directive, ElementRef, Renderer2, effect, input } from '@angular/core';
import { ProgressDetail } from '../interfaces/progress-detail.interface';
import { FileSizePipe } from '../pipes/file-size.pipe';

@Directive({
    selector: 'progress[progressBar]',
    standalone: true
})
export class ProgressBarDirective {
    readonly progress = input<ProgressDetail>();

    constructor(private el: ElementRef, private renderer: Renderer2) {
        effect(() => {
            const p = this.progress();
            if (p) {
                this.el.nativeElement.value = p.percent;
                if (p.speed > 0) {
                    const pipe = new FileSizePipe();
                    this.renderer.setAttribute(this.el.nativeElement, 'speedText', pipe.transform(p.loaded));
                } else {
                    this.renderer.setAttribute(this.el.nativeElement, 'speedText', '');
                }
            }
        });
    }
}
