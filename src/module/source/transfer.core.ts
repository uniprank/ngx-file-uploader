import { BehaviorSubject } from 'rxjs/Rx';
import { Utils } from './utils.core';
import { FileManager } from './fileManager.core';
import { Protocol } from './protocol.core';
import { hookType, UploaderHook } from './uploaderHook.core';
import { FileFilter } from './fileFilter.core';
import { FileManagerOptions, TransferOptions } from '../interface';

// tslint:disable:no-unused-expression

const TransferOptionsDefault: TransferOptions = {
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
 * @abstract
 * @class Transfer
 */
export abstract class Transfer {
    public options: TransferOptions;

    public get id (): any {
        return this._id;
    }

    public get queue$ (): any {
        return Utils.asObservable(this._queue$);
    }

    public get queueObs (): FileManager[] {
        return this._queue$.getValue();
    }

    private _id: string;
    private _queue$: BehaviorSubject<FileManager[]> = new BehaviorSubject( [] );
    private _hooks: UploaderHook[];

    private _isHTML5: Boolean;
    private _isDragAndDrop: Boolean;

    private _protocol: Protocol;

    /**
     * Creates an instance of Transfer.
     * 
     * @param {string} type
     * 
     * @memberOf Transfer
     */
    constructor (public type: string, _options?: TransferOptions) {
        let div = document.createElement( 'div' );
        this._isHTML5 = !!(File && FormData && FileReader);
        this._isDragAndDrop = ( ( 'draggable' in div ) || ( 'ondragstart' in div && 'ondrop' in div ) ) ? true : false;
        this._id = Utils.uniqueID();
        this._hooks = [];

        if (!this._isHTML5) {
            throw new Error(`Your browser doesn't support HTML5. Our FileUploader can't work here.`);
        }

        this.options = Object.assign({}, TransferOptionsDefault, _options);
    }

    /**
     * Bind options to FileManager
     * 
     * @param {FileManagerOptions} _options
     * 
     * @memberOf FileManager
     */
    public bindOptions (_options: TransferOptions): void {
        this.options = Object.assign({}, this.options, _options);
    }

    /**
     * It gives HTML5 check back
     * 
     * @returns {Boolean}
     * 
     * @memberOf Transfer
     */
    public isHTML5 (): Boolean {
        return this._isHTML5;
    }

    /**
     * It gives DragAndDrop check back
     * 
     * @returns {Boolean}
     * 
     * @memberOf Transfer
     */
    public isDragAndDrop (): Boolean {
        return this._isDragAndDrop;
    }

    /**
     * To implement a hock
     * 
     * @param {UploaderHook} hook
     * 
     * @memberOf Transfer
     */
    public hook ( _hook: UploaderHook ) {
        if ( this.hookExists(_hook) === -1 ) {
            this._hooks.push(_hook);
            this._hooks.sort( (a, b) => {
                if ( !(a.type) || !(b.type) ) {
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
                    if ( !(a.priority) || !(b.priority) ) {
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
     * 
     * 
     * @param {UploaderHook} hook
     * @returns this
     * 
     * @memberOf Transfer
     */
    public removeHook ( _hook: UploaderHook ): boolean {
        let key = this.hookExists(_hook);
        if ( key >= 0 ) {
            this._hooks.splice(key, 1);
            return true;
        }
        return false;
    }

    public addFilesToQueue (_files: any, options?: FileManagerOptions): FileManager[] {
        let _retFiles: FileManager[] = [];
        let _dummyFile: FileManager;
        let _check = false;

        if (Utils.isElement(_files)) {
            // If _files was not converted
            for (let _fileElement of _files.files) {
                try {
                    _dummyFile = new FileManager(_fileElement, options, this);
                } catch (e) {
                    throw Error(`Couldn't create a new FileManager object.`);
                }
                _check = this.addFile(_dummyFile);
                (_check) && _retFiles.push(_dummyFile);
            }
        } else if (_files instanceof Object) {
            // If _files is an array of FileManger
            if ( (typeof _files[0] !== 'undefined') && (_files[0] instanceof FileManager) ) {
                for (let _file of _files) {
                    _check = this.addFile(_file);
                    (_check) && _retFiles.push(_file);
                }
            // If _files is only a FileManger
            } else if (_files instanceof FileManager) {
                _check = this.addFile(_files);
                (_check) && _retFiles.push(_files);
            } else {
                throw new Error(`Couldn't put file/files to the queue. [${_files}]`);
            }
        } else {
            throw new Error(`Couldn't initialise FileUploader file/files are not defined. [${_files}]`);
        }
        this._onAddFileAll();
        return _retFiles;
    }

    public addFile (_file: FileManager): boolean {
        try {
            this.validate(_file);
        } catch (e) {
            console.log(e.message);
            this._onAddFileError(_file);
            return false;
        }

        let queue = this._queue$.getValue();
        if (this.options.uniqueFiles) {
            if (this.notInQueue(_file) === -1) {
                this._runHook(hookType.beforeAddingFile, _file);
                queue.push(_file);
                this._queue$.next( queue );
                this._onAddFile(_file);
                this._runHook(hookType.afterAddingFile, _file);
                (this.options.autoUpload) && _file.upload();
                return true;
            }
        } else {
            this._runHook(hookType.beforeAddingFile, _file);
            queue.push(_file);
            this._queue$.next( queue );
            this._onAddFile(_file);
            this._runHook(hookType.afterAddingFile, _file);
            (this.options.autoUpload) && _file.upload();
            return true;
        }
        this._onAddFileError(_file);
        return false;
    }

    public removeFile (_file: FileManager): boolean {
        let key = this.notInQueue(_file);
        let queue = this._queue$.getValue();
        if (key >= 0) {
            queue.splice(key, 1);
            this._queue$.next( queue );
            return true;
        }
        return false;
    }

    public notInQueue (_file: FileManager ): number {
        let queue = this._queue$.getValue();
        for (let key in queue) {
            if ( queue.hasOwnProperty( key ) ) {
                let obj = queue[key];
                if (
                    (obj.id === _file.id) ||
                    ( (obj.name + obj.type + obj.size) ===
                        (_file.name + _file.type + _file.size) )
                ) {
                    return +key;
                }
            }
        }
        return -1;
    }

    public addFilter (_filter: FileFilter): void {
        if (this.filterExists(_filter) !== -1) {
            (<FileFilter[]>this.options.filters).push(_filter);
        }
    }

    public validate (_file: FileManager) {
        for (let _filter of (<FileFilter[]>this.options.filters)) {
            if (!_filter.validate(_file)) {
                throw new Error(`File [${_file.name}] doesn't fit with filter [${_filter.name}]`);
            }
        }
        return true;
    }

    public _setProtocol (_protocol: Protocol) {
        this._protocol = _protocol;
    }

    public _getProtocol (): Protocol {
        return this._protocol;
    }

     /**
      * Validate response status code.
      * 
      * @param {number} status
      * @returns {boolean}
      * 
      * @memberOf Protocol
      */
     public _isSuccessCode(status: number): boolean {
         return (status >= 200 && status < 300) || status === 304;
     }

    /**
     * Upload functions
     */
    public upload () {
        this._onBeforeUploadAll();
        for (let _file of this.queueObs) {
            this.uploadItem(_file);
        }
    }
    public cancel () {
        for (let _file of this.queueObs) {
            this.cancelUploadItem(_file);
        }
    }
    public remove () {
        for (let _file of this.queueObs) {
            this.removeFile(_file);
        }
    }
    public uploadItem (item: FileManager) {
        if (this.notInQueue(item) === -1) {
            this.addFile(item);
        }
        this._onBeforeUpload(item);
        this._getProtocol().run(item);
    }
    public cancelUploadItem (item: FileManager) {
        if (this.notInQueue(item) === -1) {
            return;
        }
        (item.isUploading) && this._getProtocol().cancel(item);
        (item.isUploading) && item._cancel();
    }

    /**
     * Overwrite functions
     */

    onAddFileAll(_uploader: Transfer): void { return; }
    onAddFile(_file: FileManager): void { return; }
    onAddFileError(_file: FileManager): void { return; }
    onBeforeUploadAll(_uploader: Transfer): void { return; }
    onBeforeUpload(_file: FileManager): void { return; }
    onProgress(_uploader: Transfer, _progress: any): void { return; }
    onProgressFile(_file: FileManager, _progress: number): void { return; }
    onProgressFileSpeed(_file: FileManager, _progress: any): void { return; }
    onSuccess(_file: FileManager, _response: any, _status: number, _headers: any): void { return; }
    onError(_file: FileManager, _response: any, _status: number, _headers: any): void { return; }
    onComplete(_file: FileManager, _response: any, _status: number, _headers: any): void { return; }
    onCompleteAll(_uploader: Transfer): void { return; };

    /**
     * Internal functions
     */

    /**
     * 
     * 
     * @param {FileManager} _file
     * @param {number} _progress
     * @returns {void}
     * 
     * @memberOf FileManager
     */
    _onAddFileAll(): void {
        this.onAddFileAll(this);
    }
    _onAddFile(_file: FileManager): void {
        this.onAddFile(_file);
    }
    _onAddFileError(_file: FileManager): void {
        this._runHook(hookType.errorAddingFile, _file);
        this.onAddFileError(_file);
    }
    _onBeforeUploadAll(): void {
        this._runHook(hookType.prepareUploadAll, this);
        this.onBeforeUploadAll(this);
    }
    _onBeforeUpload(_file: FileManager): void {
        this._runHook(hookType.prepareUploadFile, _file);
        _file._onBeforeUpload();
        this.onBeforeUpload(_file);
    }
    _onProgressFileSpeed(_file: FileManager, _speed: any): void {
        this._runHook(hookType.prepareUploadFile, _file, _speed);
        _file._onProgressFileSpeed(_speed);
        this.onProgressFileSpeed(_file, _speed);
    }
    _onProgressFile(_file: FileManager, _progress: number): void {
        _file._onProgress(_progress);
        this.onProgressFile(_file, _progress);
        this._onProgress();
     }
    _onProgress(): void {
        let queue: FileManager[] = this._queue$.getValue();
        if (queue.length > 0) {
            let percent = 0;
            for (let file of queue) {
                if (file.success || file.error) {
                    percent += 100;
                } else if (file.isUploading) {
                    percent += file.progress;
                }
            }
            percent = Math.floor(percent / queue.length);
            this._runHook(hookType.progressUploadAll, percent);
            this.onProgress(this, percent);
            (percent >= 100) && this._onCompleteAll();
            return;
        }
        this.onProgress(this, 100);
        this._onCompleteAll();
     }
     _onSuccessFile(_file: FileManager, response: any, status: number, headers: any): void {
        this._runHook(hookType.successUploadFile, _file, response, status, headers);
        _file._onSuccess(response, status, headers);
        this.onSuccess(_file, response, status, headers);
     }
     _onErrorFile(_file: FileManager, response: any, status: number, headers: any): void {
        this._runHook(hookType.failedUploadFile, _file, response, status, headers);
        this.onError(_file, response, status, headers);
     }
     _onCompleteFile(_file: FileManager, response: any, status: number, headers: any): void {
        this._runHook(hookType.completeUploadFile, _file, response, status, headers);
        this._onProgress();
        this.onComplete(_file, response, status, headers);
     }
     _onCompleteAll(): void {
        this._runHook(hookType.completeUploadAll, this);
        this.onCompleteAll(this);
     }

    _headersGetter(parsedHeaders: any) {
        return (name: any) => {
            if (name) {
                return parsedHeaders[name.toLowerCase()] || null;
            }
            return parsedHeaders;
        };
    }
    _parseHeaders(headers: any): any {
        let parsed: any = {}, key: any, val: any, i: any;

        if (!headers) { return parsed; }

        let incomeHeaders = headers.split('\n');
        for (let line of incomeHeaders) {
            i = line.indexOf(':');
            key = line.slice(0, i).trim().toLowerCase();
            val = line.slice(i + 1).trim();

            if (key) {
                parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
            }
        }

        return parsed;
    }
    _transformResponse(response: any, headers: any): void {
        headers = {};
        return response;
    }

    _runHook(type: hookType, ...args: any[]): void {
        for (let key in this._hooks) {
            if ( this._hooks.hasOwnProperty( key ) ) {
                let obj = this._hooks[key];
                if (obj.type === type) {
                    switch (type) {
                        case hookType.beforeAddingFile:
                        case hookType.prepareUploadAll:
                        case hookType.prepareUploadFile:
                        case hookType.afterAddingFile:
                        case hookType.errorAddingFile:
                        case hookType.completeUploadAll:
                        case hookType.progressUploadAll: {
                            (<Function>obj.callback)(args[0]);
                        }break;

                        case hookType.progressUploadFile: {
                            (<Function>obj.callback)(args[0], args[1]);
                        }break;

                        case hookType.cancelUploadFile:
                        case hookType.successUploadFile:
                        case hookType.failedUploadFile:
                        case hookType.completeUploadFile: {
                            (<Function>obj.callback)(args[0], args[1], args[2], args[3]);
                        }break;

                        default: {
                            throw new Error(`hookType unknown or not defined`);
                        }
                    }
                }
            }
        }
    }

    /**
     * 
     * 
     * @private
     * @param {UploaderHook} hook
     * @returns {Boolean}
     * 
     * @memberOf Transfer
     */
    private hookExists ( hook: UploaderHook ): number {
        for (let key in this._hooks) {
            if ( this._hooks.hasOwnProperty( key ) ) {
                let obj = this._hooks[key];
                if (
                    (obj.type === hook.type) && ('' + obj.callback === '' + hook.callback)
                ) {
                    return +key;
                }
            }
        }
        return -1;
    }

    private filterExists (_filter: FileFilter): number {
        let filters = <FileFilter[]>this.options.filters;
        for (let key in filters) {
            if ( filters.hasOwnProperty( key ) ) {
                let obj = filters[key];
                if ( obj.name === _filter.name ) {
                    return +key;
                }
            }
        }
        return -1;
    }
}
