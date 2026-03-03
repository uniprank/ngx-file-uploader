import { Directive, HostListener, HostBinding, OnInit, OnDestroy, input, output } from '@angular/core';
import { FileManager } from '../classes/file-manager.class';
import { FileManagerOptionsInterface, instanceOfFileManagerInterface, FileManagerInterface, TransferInterface } from '../interfaces';

@Directive({
    selector: '[ngxFile2Select]',
    standalone: true
})
export class FileSelectDirective implements OnInit, OnDestroy {
    @HostBinding('attr.role') role = 'input';
    @HostBinding('attr.type') type = 'file';

    readonly fileOptions = input<FileManagerOptionsInterface>();
    readonly uploader = input.required<TransferInterface<FileManagerInterface>>();

    readonly fileHoverStart = output<void>();
    readonly fileHoverEnd = output<void>();
    readonly fileAccepted = output<FileManagerInterface[]>();
    readonly fileRejected = output<Error>();

    private _InputFile: any = null;
    private _files: FileManagerInterface[];

    constructor() {}

    public ngOnInit() {
        this._files = [];
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

    @HostListener('change', ['$event'])
    public onChange(event: Event): void {
        this._InputFile = this.getEventTarget(event);

        if (this._InputFile.files.length === 0) {
            this._InputFile = null;
            return;
        }

        const filesData: FileList = this._InputFile.files;

        this.readFile(filesData);

        this.fileAccepted.emit(this._files);

        this._InputFile = null;

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

    private getEventTarget(event: Event | any): any {
        return event.target;
    }
}
