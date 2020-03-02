import { BehaviorSubject, Observable } from 'rxjs';
import { Utils } from './utils.class';
import { Protocol } from './protocol.class';
import { HookTypeEnum, UploaderHook } from './uploader-hook.class';
import { FileFilter } from './file-filter.class';
import { FileManagerOptions, TransferOptionsInterface } from '../interfaces';
import { TransferInterface } from '../interfaces/transfer.interface';
import { FileManagerInterface, instanceOfFileManagerInterface } from '../interfaces/file-manager.interface';
import { take, map } from 'rxjs/operators';

// tslint:disable:no-unused-expression

const TransferOptionsDefault: TransferOptionsInterface = {
    url: '',
    alias: 'file',
    headers: {},
    filters: [],
    formData: [],
    autoUpload: false,
    method: 'POST',
    removeBySuccess: false,
    queueLimit: -1,
    enableCors: false,
    withCredentials: false,
    uniqueFiles: false
};

/**
 * An abstract class for the transport functionality
 *
 * @export
 */
export abstract class Transfer implements TransferInterface<FileManagerInterface> {
    public options: TransferOptionsInterface;

    public get id(): any {
        return this._id;
    }

    public get queue$(): Observable<FileManagerInterface[]> {
        return this._$queue.asObservable();
    }

    public get queueObs(): FileManagerInterface[] {
        return this._queue;
    }

    private _id: string;
    private _$queue: BehaviorSubject<FileManagerInterface[]> = new BehaviorSubject([]);
    private _queue: FileManagerInterface[] = [];
    private _hooks: UploaderHook[];

    private _isHTML5: boolean;
    private _isDragAndDrop: boolean;

    private _protocol: Protocol;

    /**
     * Creates an instance of Transfer.
     *
     * @memberOf Transfer
     */
    constructor(public type: string, options?: TransferOptionsInterface) {
        const div = document.createElement('div');
        this._isHTML5 = !!(File && FormData && FileReader);
        this._isDragAndDrop = 'draggable' in div || ('ondragstart' in div && 'ondrop' in div) ? true : false;
        this._id = Utils.uniqueID();
        this._hooks = [];

        if (!this._isHTML5) {
            throw new Error(`Your browser doesn't support HTML5. Our NgxFileUploader can't work here.`);
        }

        this.options = Object.assign({}, TransferOptionsDefault, options);
    }

    /**
     * Bind options to FileManagerInterface
     *
     * @memberOf Transfer
     */
    public bindOptions(options: TransferOptionsInterface): void {
        this.options = { ...this.options, ...options };
    }

    /**
     * It gives HTML5 check back
     *
     * @memberOf Transfer
     */
    public isHTML5(): boolean {
        return this._isHTML5;
    }

    /**
     * It gives DragAndDrop check back
     *
     * @memberOf Transfer
     */
    public isDragAndDrop(): boolean {
        return this._isDragAndDrop;
    }

    /**
     * To implement a hock
     *
     * @memberOf Transfer
     */
    public hook(hook: UploaderHook) {
        if (this._hookExists(hook) === -1) {
            this._hooks.push(hook);
            this._hooks.sort((a, b) => {
                if (!a.type || !b.type) {
                    return 0;
                }
                if (a.type !== b.type) {
                    if (a.type < b.type) {
                        return -1;
                    }
                    if (a.type > b.type) {
                        return 1;
                    }
                    return 0;
                } else {
                    if (!a.priority || !b.priority) {
                        return 0;
                    }
                    if (a.priority > b.priority) {
                        return -1;
                    }
                    if (a.priority < b.priority) {
                        return 1;
                    }
                    return 0;
                }
            });
        }
    }

    /**
     *  Remove a hook
     *
     * @memberOf Transfer
     */
    public removeHook(hook: UploaderHook): boolean {
        const key = this._hookExists(hook);
        if (key >= 0) {
            this._hooks.splice(key, 1);
            return true;
        }
        return false;
    }

    public activeHooks(): string[] {
        return this._hooks.map((_hook) => `${HookTypeEnum[_hook.type]}->prio:${_hook.priority}`);
    }

    /**
     *  Add files to queue
     *
     * @memberOf Transfer
     */
    public addFilesToQueue(files: any, options?: FileManagerOptions): FileManagerInterface[] {
        const _retFiles: FileManagerInterface[] = [];
        let _dummyFile: FileManagerInterface;
        let _check = false;

        if (Utils.isElement(files)) {
            // If _files was not converted
            for (const _fileElement of files.files) {
                try {
                    _dummyFile = this.createDummy(_fileElement, options);
                } catch (e) {
                    throw Error(`Couldn't create a new FileManagerInterface object.`);
                }
                _check = this.addFile(_dummyFile);
                _check && _retFiles.push(_dummyFile);
            }
        } else if (files instanceof Object) {
            // If _files is an array of FileManger
            if (typeof files[0] !== 'undefined' && instanceOfFileManagerInterface(files[0])) {
                for (const _file of files) {
                    _check = this.addFile(_file);
                    _check && _retFiles.push(_file);
                }
                // If _files is only a FileManger
            } else if (instanceOfFileManagerInterface(files)) {
                _check = this.addFile(files);
                _check && _retFiles.push(files);
            } else {
                throw new Error(`Couldn'FileManagerInterface put file/files to the queue. [${files}]`);
            }
        } else {
            throw new Error(`Couldn'FileManagerInterface initialise FileUploader file/files are not defined. [${files}]`);
        }
        this._onAddFileAll();

        return _retFiles;
    }

    public addFile(file: FileManagerInterface): boolean {
        try {
            this.validate(file);
        } catch (e) {
            this._onAddFileError(file);
            return false;
        }

        const queue = this._queue;
        if (this.options.uniqueFiles) {
            if (this.inQueue(file) === -1) {
                this._runHook(HookTypeEnum.beforeAddingFile, file);
                queue.push(file);
                this._$queue.next(queue);
                this._onAddFile(file);
                this._runHook(HookTypeEnum.afterAddingFile, file);
                this.options.autoUpload && file.upload();
                return true;
            }
        } else {
            this._runHook(HookTypeEnum.beforeAddingFile, file);
            queue.push(file);
            this._$queue.next(queue);
            this._onAddFile(file);
            this._runHook(HookTypeEnum.afterAddingFile, file);
            this.options.autoUpload && file.upload();
            return true;
        }
        this._onAddFileError(file);
        return false;
    }

    public removeFile(_file: FileManagerInterface): boolean {
        const key = this.inQueue(_file);
        if (key !== -1) {
            this._queue.splice(key, 1);
            this._$queue.next(this._queue);
            this._onRemoveFile(_file);
            return true;
        }
        return false;
    }

    public inQueue(_file: FileManagerInterface): number {
        return this._queue.findIndex((obj) => {
            return obj.id === _file.id || obj.name + obj.type + obj.size === _file.name + _file.type + _file.size;
        });
    }

    public addFilter(_filter: FileFilter): void {
        if (this._filterExists(_filter) !== -1) {
            (<FileFilter[]>this.options.filters).push(_filter);
        }
    }

    public validate(_file: FileManagerInterface): boolean {
        return (<FileFilter[]>this.options.filters).some((_filter) => _filter.validate(_file));
    }

    public setProtocol(_protocol: Protocol) {
        this._protocol = _protocol;
    }

    public getProtocol(): Protocol {
        return this._protocol;
    }

    /**
     * Validate response status code.
     *
     * @memberOf Transfer
     */
    public isSuccessCode(status: number): boolean {
        return (status >= 200 && status < 300) || status === 304;
    }

    /**
     * Upload functions
     */
    public upload() {
        this._onBeforeUploadAll();
        for (const _file of this.queueObs) {
            this.uploadFile(_file);
        }
    }
    public cancel() {
        for (const _file of this.queueObs) {
            this.cancelUploadFile(_file);
        }
    }
    public remove() {
        const _queue = [...this.queueObs];
        for (const _file of _queue) {
            this.removeFile(_file);
        }
    }
    public uploadFile(item: FileManagerInterface): void {
        if (this.inQueue(item) === -1) {
            this.addFile(item);
        }
        this._onBeforeUpload(item);
        this.getProtocol().run(item);
    }
    public cancelUploadFile(item: FileManagerInterface) {
        if (this.inQueue(item) === -1) {
            return;
        }
        item.isUploading && this.getProtocol().cancel(item);
        item.isUploading && item._cancel();
    }

    /**
     * Overwrite functions
     */

    public onAddFileAll(_uploader: TransferInterface<FileManagerInterface>): void {
        return;
    }
    public onAddFile(_file: FileManagerInterface): void {
        return;
    }
    public onAddFileError(_file: FileManagerInterface): void {
        return;
    }
    public onRemoveFile(_file: FileManagerInterface): void {
        return;
    }
    public onBeforeUploadAll(_uploader: TransferInterface<FileManagerInterface>): void {
        return;
    }
    public onBeforeUpload(_file: FileManagerInterface): void {
        return;
    }
    public onProgress(_uploader: TransferInterface<FileManagerInterface>, _progress: any): void {
        return;
    }
    public onProgressFile(_file: FileManagerInterface, _progress: number): void {
        return;
    }
    public onProgressFileSpeed(_file: FileManagerInterface, _progress: any): void {
        return;
    }
    public onSuccess(_file: FileManagerInterface, _response: any, _status: number, _headers: any): void {
        return;
    }
    public onError(_file: FileManagerInterface, _response: any, _status: number, _headers: any): void {
        return;
    }
    public onComplete(_file: FileManagerInterface, _response: any, _status: number, _headers: any): void {
        return;
    }
    public onCompleteAll(_uploader: TransferInterface<FileManagerInterface>): void {
        return;
    }

    /**
     * Internal functions
     */

    /**
     *
     * @memberOf FileManagerInterface
     */
    public _onAddFileAll(): void {
        this.onAddFileAll(this as any);
    }
    public _onAddFile(_file: FileManagerInterface): void {
        this.onAddFile(_file);
    }
    public _onAddFileError(_file: FileManagerInterface): void {
        this._runHook(HookTypeEnum.errorAddingFile, _file);
        this.onAddFileError(_file);
    }
    public _onRemoveFile(_file: FileManagerInterface): void {
        this._runHook(HookTypeEnum.removeFile, _file);
        this.onRemoveFile(_file);
    }
    public _onBeforeUploadAll(): void {
        this._runHook(HookTypeEnum.prepareUploadAll, this);
        this.onBeforeUploadAll(this as any);
    }
    public _onBeforeUpload(_file: FileManagerInterface): void {
        this._runHook(HookTypeEnum.prepareUploadFile, _file);
        _file._onBeforeUpload();
        this.onBeforeUpload(_file);
    }
    public _onProgressFileSpeed(_file: FileManagerInterface, _speed: any): void {
        this._runHook(HookTypeEnum.progressUploadSpeed, _file, _speed);
        _file._onProgressFileSpeed(_speed);
        this.onProgressFileSpeed(_file, _speed);
    }
    public _onProgressFile(_file: FileManagerInterface, _progress: number): void {
        this._runHook(HookTypeEnum.progressUploadFile, _file, _progress);
        _file._onProgress(_progress);
        this.onProgressFile(_file, _progress);
        this._onProgress();
    }
    public _onProgress(): void {
        const queue: FileManagerInterface[] = this._queue;
        if (queue.length > 0) {
            let percent = 0;
            for (const file of queue) {
                if (file.success || file.error) {
                    percent += 100;
                } else if (file.isUploading) {
                    percent += file.progress;
                }
            }
            percent = Math.floor(percent / queue.length);
            this._runHook(HookTypeEnum.progressUploadAll, percent);
            this.onProgress(this as any, percent);
            percent >= 100 && this._onCompleteAll();
            return;
        }
        this.onProgress(this as any, 100);
        this._onCompleteAll();
    }
    public _onSuccessFile(_file: FileManagerInterface, response: any, status: number, headers: any): void {
        this._runHook(HookTypeEnum.successUploadFile, _file, response, status, headers);
        _file._onSuccess(response, status, headers);
        this.onSuccess(_file, response, status, headers);
    }
    public _onErrorFile(_file: FileManagerInterface, response: any, status: number, headers: any): void {
        this._runHook(HookTypeEnum.failedUploadFile, _file, response, status, headers);
        _file._onError(response, status, headers);
        this.onError(_file, response, status, headers);
    }
    public _onCompleteFile(_file: FileManagerInterface, response: any, status: number, headers: any): void {
        this._runHook(HookTypeEnum.completeUploadFile, _file, response, status, headers);
        this._onProgress();
        this.onComplete(_file, response, status, headers);
    }
    public _onCompleteAll(): void {
        this._runHook(HookTypeEnum.completeUploadAll, this);
        this.onCompleteAll(this as any);
    }

    public _headersGetter(parsedHeaders: any) {
        return (name: any) => {
            if (name) {
                return parsedHeaders[name.toLowerCase()] || null;
            }
            return parsedHeaders;
        };
    }
    public _parseHeaders(headers: any): any {
        const parsed: any = {};
        let key: any, val: any, i: any;

        if (!headers) {
            return parsed;
        }

        const incomeHeaders = headers.split('\n');
        for (const line of incomeHeaders) {
            i = line.indexOf(':');
            key = line
                .slice(0, i)
                .trim()
                .toLowerCase();
            val = line.slice(i + 1).trim();

            if (key) {
                parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
            }
        }

        return parsed;
    }
    public _transformResponse(response: any, headers: any): void {
        headers = {};
        return response;
    }

    public _runHook(type: HookTypeEnum, ...args: any[]): void {
        for (const key in this._hooks) {
            if (this._hooks.hasOwnProperty(key)) {
                const obj = this._hooks[key];
                if (obj.type === type) {
                    switch (type) {
                        case HookTypeEnum.beforeAddingFile:
                        case HookTypeEnum.prepareUploadAll:
                        case HookTypeEnum.prepareUploadFile:
                        case HookTypeEnum.afterAddingFile:
                        case HookTypeEnum.errorAddingFile:
                        case HookTypeEnum.completeUploadAll:
                        case HookTypeEnum.progressUploadAll:
                        case HookTypeEnum.removeFile:
                            {
                                (<(...args) => void>obj.callback)(args[0]);
                            }
                            break;

                        case HookTypeEnum.progressUploadFile:
                        case HookTypeEnum.progressUploadSpeed:
                            {
                                (<(...args) => void>obj.callback)(args[0], args[1]);
                            }
                            break;

                        case HookTypeEnum.cancelUploadFile:
                        case HookTypeEnum.successUploadFile:
                        case HookTypeEnum.failedUploadFile:
                        case HookTypeEnum.completeUploadFile:
                            {
                                (<(...args) => void>obj.callback)(args[0], args[1], args[2], args[3]);
                            }
                            break;

                        default: {
                            throw new Error(`hookType unknown or not defined`);
                        }
                    }
                }
            }
        }
    }

    private _hookExists(hook: UploaderHook): number {
        for (const key in this._hooks) {
            if (this._hooks.hasOwnProperty(key)) {
                const obj = this._hooks[key];
                if (obj.type === hook.type && '' + obj.callback === '' + hook.callback) {
                    return +key;
                }
            }
        }
        return -1;
    }

    private _filterExists(_filter: FileFilter): number {
        const filters = <FileFilter[]>this.options.filters;
        for (const key in filters) {
            if (filters.hasOwnProperty(key)) {
                const obj = filters[key];
                if (obj.name === _filter.name) {
                    return +key;
                }
            }
        }
        return -1;
    }

    public abstract init(): void;
    public abstract destroy(): void;
    public abstract createDummy(fileElement: any, options: FileManagerOptions): FileManagerInterface;
}
