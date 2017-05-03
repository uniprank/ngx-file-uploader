// tslint:disable:max-line-length
// tslint:disable:no-unused-expression
import { Directive, EventEmitter, ElementRef, Renderer, HostListener, Output, Input, OnInit, OnDestroy } from '@angular/core';
import { FileManager } from '../source/fileManager.core';
import { Transfer } from '../source/transfer.core';
import { FileManagerOptions } from '../interface';

//
// Directive to support dragging and dropping and element onto a div
//
@Directive({
    // Selector required in component HTML
    // tslint:disable-next-line:directive-selector
    selector: '[ng2File2Drop]'
})
export class FileDropDirective implements OnInit, OnDestroy {
    @Output()
    public fileHoverStart: EventEmitter<any> = new EventEmitter<any>();
    @Output()
    public fileHoverEnd: EventEmitter<any> = new EventEmitter<any>();
    @Output()
    public fileAccepted: EventEmitter<FileManager[]> = new EventEmitter<FileManager[]>();
    @Output()
    public fileRejected: EventEmitter<Error> = new EventEmitter<Error>();

    @Input()
    public fileOptions: FileManagerOptions;
    @Input()
    public uploader: Transfer;

    private _InputFile: any = null;
    private _files: FileManager[];

    //
    // Constructor requires an element reference that instantiated this directive
    //
    public constructor(private element: ElementRef, private renderer: Renderer) { }

    //
    // Initialisation
    //
    public ngOnInit() {
        this._files = [];
        this.renderer.setElementClass(this.element.nativeElement, 'drop-area', true);
    }

    public ngOnDestroy() {
        if (this._files.length > 0) {
            for (let _file of this._files) {
                if (_file instanceof FileManager) {
                    if (!_file.isUploaded()) {
                        _file.cancel();
                        this.uploader.removeFile(_file);
                    }
                }
            }
        }
    }

    //
    // Called when the element has content dragged over
    //
    @HostListener('dragover', ['$event'])
    public onDragOver(event: Event): void {

        // If we're already in the on-drag, don't bother with this
        if (this._InputFile === null) {
            // Get the object being dragged and reference it as a copy action
            this._InputFile = this.getDataTransferObject(event);
            if (this._InputFile === null) {
                return;
            }
            this.renderer.setElementClass(this.element.nativeElement, 'drop-enter', true);
            let _dropValueText = 'Drop now';
            this.renderer.setElementAttribute(this.element.nativeElement, 'dropValueText', _dropValueText);

            // Let the client know
            this.fileHoverStart.emit();
        }

        // Don't propagate
        this.preventAndStopEventPropagation(event);
    }

    //
    // Called when the element has dragged content leave
    //
    @HostListener('dragleave', ['$event'])
    public onDragLeave(event: Event): void {

        // Only bother if we have a file
        if (this._InputFile !== null) {
            this.renderer.setElementClass(this.element.nativeElement, 'drop-enter', false);
            this.renderer.setElementAttribute(this.element.nativeElement, 'dropValueText', '');

            // Finished with the file
            this._InputFile = null;
            if (event.currentTarget === (this as any).element[0]) {
                return;
            }

            // Let the client know
            this.fileHoverEnd.emit();
        }

        // Don't let it continue
        this.preventAndStopEventPropagation(event);
    }

    //
    // Called when the element has content dropped
    //
    @HostListener('drop', ['$event'])
    public onDrop(event: Event): void {

        // Only bother if we have a file
        if (this._InputFile !== null) {
            this.renderer.setElementClass(this.element.nativeElement, 'drop-enter', false);
            this.renderer.setElementAttribute(this.element.nativeElement, 'dropValueText', '');

            // Let the client know
            this.fileHoverEnd.emit();

            // Update our data
            this._InputFile = this.getDataTransferObject(event);

            if (this._InputFile.files.length === 0) {
                this._InputFile  = null;
                return;
            }

            let filesData: FileList = this._InputFile.files;

            if (!this.hasFiles(this._InputFile.types)) {
                return;
            }

            this.readFile(filesData);

            this.fileAccepted.emit(this._files);

            // Finished with the file
            this._InputFile  = null;
        }

        // Don't let it continue
        this.preventAndStopEventPropagation(event);
    }

    //
    // Stops the drag/drop events propagating
    //
    private preventAndStopEventPropagation(event: Event): void {
        event.preventDefault();
        event.stopPropagation();
    }

    private readFile(_files: FileList): void {
        let fmObject: FileManager;
        for (let i = 0; i < _files.length; i++) {
            let file = _files[i];
            try {
                fmObject = new FileManager(file, this.fileOptions, this.uploader);
            } catch (e) {
                if (e.status === 100) {
                    this.fileRejected.emit(e);
                } else {
                    this.fileRejected.emit(e);
                }
                throw new Error('Something goes wrong e: ' + e.message);
            }

            (fmObject.inQueue) && this._files.push(fmObject);
        }
    }

    //
    // Returns the file dragged into the directive
    //
    private getDataTransferObject(event: Event | any): DataTransfer {
        return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer;
    }

    private hasFiles(types: any): boolean {
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
    }
}
