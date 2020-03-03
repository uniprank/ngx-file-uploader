import { BehaviorSubject, Observable } from 'rxjs';

import { TransferInterface } from '../interfaces/transfer.interface';
import { FileManagerOptionsInterface } from '../interfaces/file-manager-options.interface';
import { FileManagerInterface } from '../interfaces/file-manager.interface';

import { FileObject } from './file-object.class';
import { Utils } from './utils.class';

const FileManagerOptionsDefault: FileManagerOptionsInterface = {};

const speedObject: any = {
    total: 0,
    loaded: 0,
    percent: 0,
    speed: 0,
    speedToText: '0 bytes'
};

export class FileManager implements FileManagerInterface {
    public options: FileManagerOptionsInterface;

    private _id: string;
    private _protocol: any;
    private _uploader: TransferInterface<FileManagerInterface>;
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

    private _response: any;

    public set protocol(_protocol: any) {
        this._protocol = _protocol;
    }

    public get id(): string {
        return this._id;
    }

    public get progressPercent$(): Observable<number> {
        return this._progress$.asObservable();
    }

    public get progress$(): Observable<any> {
        return this._speed$.asObservable();
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

    public get size(): number | null {
        return this._file.size;
    }

    public get inQueue(): boolean {
        return this._fileActive;
    }

    public get response(): any {
        return this._response;
    }

    public get success(): boolean {
        return this._isSuccess;
    }

    public get error(): boolean {
        return this._isError;
    }

    /**
     * Creates an instance of FileManager.
     *
     * @memberOf FileManager
     */
    constructor(file: any, options?: FileManagerOptionsInterface, uploader?: TransferInterface<FileManagerInterface>) {
        this.options = Object.assign({}, FileManagerOptionsDefault, options);
        this._speedDefault = {};

        this._id = Utils.uniqueID();

        this._isUploading = false;
        this._isUploaded = false;
        this._isSuccess = false;
        this._isCancel = false;
        this._isError = false;

        const _isInput = Utils.isElement(file);
        const _file = _isInput ? new FileObject(file.files[0]) : new FileObject(file);

        this._file = _file;
        this._fileElement = _isInput ? file.files[0] : file;
        this._fileActive = false;

        if (typeof uploader !== 'undefined') {
            this.bindUploader(uploader);
        }
    }

    /**
     * Bind uploader to FileManager
     *
     * @memberOf FileManager
     */
    public bindUploader(uploader: TransferInterface<FileManagerInterface>): void {
        this._uploader = uploader;
        const check = this._uploader.addFile(this);
        this._setFileActive(check);
    }

    /**
     * Bind options to FileManager
     *
     * @memberOf FileManager
     */
    public bindOptions(options: FileManagerOptionsInterface): void {
        const _formData = { ...this.options.formData, ...options?.formData };
        this.options = { ...this.options, ...options, ...{ formData: _formData } };
    }

    /**
     * Return uploader if exists else throw error
     *
     * @memberOf FileManager
     */
    public getUploader(): TransferInterface<FileManagerInterface> {
        return this._uploader;
    }

    /**
     * Start uploading this file
     *
     *
     * @memberOf FileManager
     */
    public upload(): void {
        let _uploader: TransferInterface<FileManagerInterface>;

        try {
            _uploader = this.getUploader();
        } catch (e) {
            throw new Error('Couldn`t upload because uploader was not defined. ERR_MSG: ' + (<Error>e).message);
        }

        this._isUploading = true;

        try {
            _uploader.uploadFile(this);
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
    public cancel(): void {
        if (this._isUploading) {
            const uploader = this.getUploader();
            uploader.cancelUploadFile(this);
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
    public remove(): void {
        let _uploader: any;

        try {
            _uploader = this.getUploader();
        } catch (e) {
            throw new Error('Couldn`t remove because uploader was not defined. ERR_MSG: ' + (<Error>e).message);
        }

        if (this._isUploading) {
            this.cancel();
        }

        _uploader.removeFile(this);
        this._setFileActive(false);
    }

    public isUploaded(): boolean {
        return this._isUploaded;
    }

    public isUploading(): boolean {
        return this._isUploading;
    }

    public canUpload(): boolean {
        return !this._isUploaded && !this._isUploading && !this._isSuccess && !this._isError;
    }

    public handleImageLoad(): void {
        this._imageLoad = true;
    }

    /**
     * Overwrite functions
     */

    onBeforeUpload(): void {
        return;
    }
    onProgressSpeed(speed: any): void {
        speed = speed;
    }

    onProgress(progress: number): void {
        progress = progress;
    }
    onSuccess(response: any, status: number, headers: any): void {
        response = response;
        status = status;
        headers = headers;
    }
    onError(response: any, status: number, headers: any): void {
        response = response;
        status = status;
        headers = headers;
    }

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

    _onProgressFileSpeed(speed: any) {
        this._speed$.next(speed);
        this.onProgressSpeed(speed);
    }

    _onProgress(progress: number): void {
        this._progress$.next(progress);
        this.onProgress(progress);
    }

    _onSuccess(response: any, status: number, headers: any): void {
        this._isUploading = false;
        this._isUploaded = true;
        this._isSuccess = true;
        this._isError = false;
        this._response = response;
        this.onSuccess(response, status, headers);
        if (this._uploader.options.removeBySuccess) {
            this.remove();
        }
    }

    _onError(response: any, status: number, headers: any): void {
        this._isUploading = false;
        this._isUploaded = false;
        this._isSuccess = false;
        this._isError = true;
        this._response = response;
        this.onError(response, status, headers);
    }

    private _setFileActive(check: boolean): void {
        this._fileActive = check;
    }
}
