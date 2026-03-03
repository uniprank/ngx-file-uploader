import { Directive, ElementRef, Renderer2, HostListener, OnInit, OnDestroy, input, output } from '@angular/core';
import { FileManager } from '../classes/file-manager.class';
import { FileManagerOptionsInterface, FileManagerInterface, TransferInterface, instanceOfFileManagerInterface } from '../interfaces';

@Directive({
    selector: '[ngxFile2Drop]',
    standalone: true
})
export class FileDropDirective implements OnInit, OnDestroy {
    readonly fileOptions = input<FileManagerOptionsInterface>();
    readonly uploader = input.required<TransferInterface<FileManagerInterface>>();

    readonly fileHoverStart = output<void>();
    readonly fileHoverEnd = output<void>();
    readonly fileAccepted = output<FileManagerInterface[]>();
    readonly fileRejected = output<Error>();

    private _InputFile: any = null;
    private _files: FileManagerInterface[];

    public constructor(private element: ElementRef, private renderer: Renderer2) {}

    public ngOnInit() {
        this._files = [];
        this.renderer.addClass(this.element.nativeElement, 'drop-area');
    }

    public ngOnDestroy() {
        if (this._files.length > 0) {
            for (const _file of this._files) {
                if (instanceOfFileManagerInterface(_file)) {
                    if (!_file.isUploaded()) {
                        _file.cancel();
                        this.uploader().removeFile(_file);
                    }
                }
            }
        }
    }

    @HostListener('dragover', ['$event'])
    public onDragOver(event: Event): void {
        if (this._InputFile === null) {
            this._InputFile = this.getDataTransferObject(event);
            if (this._InputFile === null) {
                return;
            }
            this.renderer.addClass(this.element.nativeElement, 'drop-enter');
            const _dropValueText = 'Drop now';
            this.renderer.setAttribute(this.element.nativeElement, 'dropValueText', _dropValueText);

            this.fileHoverStart.emit();
        }

        this.preventAndStopEventPropagation(event);
    }

    @HostListener('dragleave', ['$event'])
    public onDragLeave(event: Event): void {
        if (this._InputFile !== null) {
            this.renderer.removeClass(this.element.nativeElement, 'drop-enter');
            this.renderer.setAttribute(this.element.nativeElement, 'dropValueText', '');

            this._InputFile = null;
            if (event.currentTarget === (this as any).element[0]) {
                return;
            }

            this.fileHoverEnd.emit();
        }

        this.preventAndStopEventPropagation(event);
    }

    @HostListener('drop', ['$event'])
    public onDrop(event: Event): void {
        if (this._InputFile !== null) {
            this.renderer.removeClass(this.element.nativeElement, 'drop-enter');
            this.renderer.setAttribute(this.element.nativeElement, 'dropValueText', '');

            this.fileHoverEnd.emit();

            this._InputFile = this.getDataTransferObject(event);

            if (this._InputFile.files.length === 0) {
                this._InputFile = null;
                return;
            }

            const filesData: FileList = this._InputFile.files;

            if (!this.hasFiles(this._InputFile.types)) {
                return;
            }

            this.readFile(filesData);

            this.fileAccepted.emit(this._files);

            this._InputFile = null;
        }

        this.preventAndStopEventPropagation(event);
    }

    private preventAndStopEventPropagation(event: Event): void {
        event.preventDefault();
        event.stopPropagation();
    }

    private readFile(_files: FileList): void {
        let fmObject: FileManager;
        for (let i = 0; i < _files.length; i++) {
            const file = _files[i];
            try {
                fmObject = new FileManager(file, this.fileOptions(), this.uploader());
            } catch (e) {
                this.fileRejected.emit(e);
                throw new Error('Something goes wrong e: ' + e.message);
            }

            fmObject.inQueue && this._files.push(fmObject);
        }
    }

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
