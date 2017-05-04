// tslint:disable-next-line:max-line-length
import { Component, Directive, EventEmitter, ElementRef, Renderer, HostListener, Output, Input, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/Rx';
import { Subscription } from 'rxjs/Subscription';
import { FileManager, FileManagerOptions, FileUploader, Utils, Transfer, TransferOptions } from '@uniprank/ngx-file-uploader';

// tslint:disable:component-selector
// tslint:disable:no-unused-expression
@Component({
    selector: 'file-drop',
    templateUrl: './fileDrop.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: [
        './fileDrop.component.scss'
    ]
})
export class FileDropComponent implements OnInit, OnDestroy {
    @Output()
    public fileHoverStart: EventEmitter<any> = new EventEmitter<any>();
    @Output()
    public fileHoverEnd: EventEmitter<any> = new EventEmitter<any>();
    @Output()
    public fileAccepted: EventEmitter<FileManager[]> = new EventEmitter<FileManager[]>();
    @Output()
    public fileRejected: EventEmitter<Error> = new EventEmitter<Error>();
    @Output()
    public progress: EventEmitter<number> = new EventEmitter<number>();

    @Input()
    public fileOptions: FileManagerOptions;
    @Input()
    public uploader: Transfer;
    @Input()
    public maxFiles: number;

    public imageLoaded = false;

    private _subs: Subscription[] = [];

    private _limit: number = -1;
    private _files: FileManager[];

    private _lastFile$: BehaviorSubject<FileManager> = new BehaviorSubject( null );
    private _files$: BehaviorSubject<FileManager[]> = new BehaviorSubject( [] );

    constructor (private element: ElementRef, private renderer: Renderer) {
        this._files = [];
    }

    public ngOnInit(): void {
        if (typeof this.maxFiles !== 'undefined') {
            this._limit = this.maxFiles;
        }

        const sub1 = this.uploader.queue$.subscribe( (data: FileManager[]) => {
            this.checkClass();
        }, (error: any) => {
            throw new Error(error);
        });
        this._subs.push(sub1);

        const sub2 = this._files$.subscribe( (data: FileManager[]) => {
            this.imageLoaded = (data.length > 0);
        }, (error: any) => {
            throw new Error(error);
        });
        this._subs.push(sub2);
    }

    public ngOnDestroy() {
        for (const _sub of this._subs) {
            _sub.unsubscribe();
        }
        this._subs = [];
    }

    public get files(): any {
        const files = this._files$.getValue();
        return files;
    }

    public get latestFile(): any {
        return Utils.asObservable(this._lastFile$);
    }

    public onFileHoverStart(event: any): void {
        this.fileHoverStart.emit(event);
    }

    public onFileHoverEnd(event: any): void {
        this.fileHoverEnd.emit(event);
    }

    public onFileAccepted(event: any): void {
        if (event.length > 0) {
            this.imageLoaded = true;
        }
        this._files$.next(event);
        this.checkClass();
        this.fileAccepted.emit(event);
    }

    public onFileRejected(event: any): void {
        this.fileRejected.emit(event);
    }

    public onProgress(event: number): void {
        this.progress.emit(event);
    }

    private checkClass(): void {
        (this._files.length > 0) ?
            this.renderer.setElementClass(this.element.nativeElement, 'has-files', true) :
            this.renderer.setElementClass(this.element.nativeElement, 'has-files', false);

        this.cleanUp();
    }

    private cleanUp(): void {
        const files = this._files$.getValue();
        for (const key in files) {
            if ( files.hasOwnProperty( key ) ) {
                const file = files[key];
                (!file.inQueue) && files.splice(+key, 1);
            }
        }
        (files.length > 0)  && this._lastFile$.next(files[files.length - 1]);
        (files.length === 0)  && this._lastFile$.next(null);

        this._files$.next(files);
    }
}
