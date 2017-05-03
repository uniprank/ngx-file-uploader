import { BehaviorSubject } from 'rxjs/Rx';
import { Utils } from './utils.core';
import { Transfer } from './transfer.core';
import { FileManagerOptions } from '../interface/fileManagerOptions.interface';

// tslint:disable:no-unused-expression

const FileManagerOptionsDefault: FileManagerOptions = {};

const speedObject: any = {
    total: 0,
    loaded: 0,
    percent: 0,
    speed: 0,
    speedToText: '0 bytes'
};

export class FileObject {
    lastModifiedDate: Date | null;
    size: number | null;
    type: string;
    name: string;

    constructor (fileOrInput: any) {
        let isInput = Utils.isElement(fileOrInput);
        let fakePathOrObject = isInput ? fileOrInput.value : fileOrInput;
        let isFakePath = Utils.isString(fakePathOrObject) ?  true : false;
        let method = (v: boolean, x: any) => { if (v) { this._createFromFakePath(x); } else { this._createFromObject(x); } };
        method(isFakePath, fakePathOrObject);
    }

    private _createFromFakePath (path: string) {
            this.lastModifiedDate = null;
            this.size = null;
            this.type = 'like/' + path.slice(path.lastIndexOf('.') + 1).toLowerCase();
            this.name = path.slice(path.lastIndexOf('/') + path.lastIndexOf('\\') + 2);
    }

    private _createFromObject (object: any) {
            this.lastModifiedDate = new Date(object.lastModifiedDate.getTime());
            this.size = object.size;
            this.type = object.type;
            this.name = object.name;
    }
}

export class FileManager {
    public options: FileManagerOptions;
    
    public set protocol(_protocol: any) {
        this._protocol = _protocol;
    }

    public get id(): string {
        return this._id;
    }

    public get progressPercent$(): any {
        return Utils.asObservable(this._progress$);
    }

    public get progress$(): any {
        return Utils.asObservable(this._speed$);
    }

    public get progress(): any {
        return this._progress$.getValue();
    }

    public get element(): any {
        return this._fileElement;
    }

    public get object(): FileObject {
        return this._file;
    }

    public get name(): string {
        return this._file.name;
    }

    public get type(): string {
        return this._file.type;
    }

    public get date(): Date | null {
        return this._file.lastModifiedDate;
    }

    public get size(): number | null  {
        return this._file.size;
    }

    public get inQueue(): boolean {
        return this._fileActive;
    }

    public get success(): boolean {
        return this._isSuccess;
    }

    public get error(): boolean {
        return this._isError;
    }

    private _id: string;
    private _protocol: any;
    private _uploader: Transfer;
    private _fileElement: any;
    private _file: FileObject;
    private _speedDefault: any;

    private _progress$: BehaviorSubject<number> = new BehaviorSubject(0);
    private _speed$: BehaviorSubject<any> = new BehaviorSubject(speedObject);
    private _isUploading: boolean;
    private _isUploaded: boolean;
    private _isSuccess: boolean;
    private _isCancel: boolean;
    private _isError: boolean;
    private _imageLoad: boolean;
    private _fileActive: boolean;

    /**
     * Creates an instance of FileManager.
     * 
     * @param {*} _file
     * @param {Transfer} [_uploader]
     * @param {FileManagerOptions} [_options]
     * 
     * @memberOf FileManager
     */
    constructor (_file: any, _options?: FileManagerOptions, _uploader?: Transfer) {
        this.options = Object.assign({}, FileManagerOptionsDefault, _options);
        this._speedDefault = {

        };

        this._id = Utils.uniqueID();

        this._isUploading = false;
        this._isUploaded = false;
        this._isSuccess = false;
        this._isCancel = false;
        this._isError = false;

        let isInput = Utils.isElement(_file);
        let file = isInput ? new FileObject(_file.files[0]) : new FileObject(_file);

        this._file = file;
        this._fileElement = isInput ? _file.files[0] : _file;
        this._fileActive = false;

        if (typeof _uploader !== 'undefined') {
            this.bindUploader(_uploader);
        }
    }

    /**
     * Bind uploader to FileManager
     *
     * @param {Transfer} _uploader
     *
     * @memberOf FileManager
     */
    public bindUploader (_uploader: Transfer): void {
        if (this._uploader instanceof Transfer) {
            this._uploader.removeFile(this);
        }
        this._uploader = _uploader;
        let check = this._uploader.addFile(this);
        this._setFileActive(check);
    }

    /**
     * Bind options to FileManager
     *
     * @param {FileManagerOptions} _options
     *
     * @memberOf FileManager
     */
    public bindOptions (_options: FileManagerOptions): void {
        this.options = Object.assign({}, this.options, _options);
    }

    /**
     * Return uploader if exists else throw error
     * 
     * @returns {Transfer}
     * 
     * @memberOf FileManager
     */
    public getUploader (): Transfer {
        if (this._uploader instanceof Transfer) {
            return this._uploader;
        }
        throw new Error('Not uploader for this file defined.');
    }

    /**
     * Start uploading this file
     * 
     * 
     * @memberOf FileManager
     */
    public upload (): void {
        let _uploader: Transfer;

        try {
            _uploader = this.getUploader();
        } catch (e) {
            throw new Error('Couldn`t upload because uploader was not defined. ERR_MSG: ' + (<Error>e).message);
        }

        this._isUploading = true;

        try {
            _uploader.uploadItem(this);
        } catch (e) {
            // TODO write error handling
        }
    }

    /**
     * Cancel upload process from this file
     * 
     * 
     * @memberOf FileManager
     */
    public cancel (): void {
        if (this._isUploading) {
            let uploader = this.getUploader();
            uploader.cancelUploadItem(this);
        }
    }

    public _cancel(): void {
        if (this._isUploading) {
            this._isCancel = true;
            this._isUploaded = false;
            this._isUploading = false;
        }
    }

    /**
     * Remove this FileManger from uploader queue
     * 
     * 
     * @memberOf FileManager
     */
    public remove (): void {
        let _uploader: any;

        try {
            _uploader = this.getUploader();
        } catch (e) {
            throw new Error('Couldn`t remove because uploader was not defined. ERR_MSG: ' + (<Error>e).message);
        }

        (this._isUploading) && this.cancel();

        _uploader.removeFile(this);
        this._setFileActive(false);
    }

    public isUploaded (): boolean {
        return this._isUploaded;
    }

    public isUploading (): boolean {
        return this._isUploading;
    }

    public canUpload(): boolean {
        return (!this._isUploaded && !this._isUploading && !this._isSuccess && !this._isError);
    }

    public handleImageLoad(): void {
        this._imageLoad = true;
    }

    /**
     * Overwrite functions
     */

    /**
     * Callback
     * @private
     */
    onBeforeUpload(): void { return; }

    onProgressSpeed(speed: any): void { speed = speed; }

    /**
     * Callback
     * @param {Number} progress
     * @private
     */
    onProgress(progress: number): void { progress = progress; }
    /**
     * Callback
     * @param {any} response
     * @param {Number} status
     * @param {Object} headers
     */
    onSuccess(response: any, status: number, headers: any): void { response = response; status = status; headers = headers;  }
    onError(response: any, status: number, headers: any): void { response = response; status = status; headers = headers;  }

    /**
     *  Internal functions
     */
    _onBeforeUpload(): void {
        this._isUploading = true;
        this._isUploaded = false;
        this._isSuccess = false;
        this._isCancel = false;
        this._isError = false;
        this._progress$.next(0);
        this.onBeforeUpload();
    }

    _onProgressFileSpeed (speed: any) {
        this._speed$.next(speed);
        this.onProgressSpeed(speed);
    }

    _onProgress (_progress: number): void {
        this._progress$.next(_progress);
        this.onProgress(_progress);
    }

    _onSuccess (response: any, status: number, headers: any): void {
        if (this._uploader.options.removeBySuccess) {
            this.remove();
        }
        this._isUploading = false;
        this._isUploaded = true;
        this._isSuccess = true;
        this._isError = false;
        this.onSuccess(response, status, headers);
    }

    _onError (response: any, status: number, headers: any): void {
        this._isUploading = false;
        this._isUploaded = false;
        this._isSuccess = false;
        this._isError = true;
        this.onError(response, status, headers);
    }

    private _setFileActive(check: boolean): void {
        this._fileActive = check;
    }
}
