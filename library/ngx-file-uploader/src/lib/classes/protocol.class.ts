import { EventEmitter } from '@angular/core';
import { Utils } from './utils.class';
import { FileSizePipe } from '../pipes/file-size.pipe';
import { FileManagerInterface } from '../interfaces/file-manager.interface';
import { TransferInterface } from '../interfaces/transfer.interface';

// tslint:disable:max-line-length

const { FormData } = <any>window;

/**
 * Abstract proctol class if someone want to write his own protocol
 */
export abstract class Protocol {
    progress: EventEmitter<any>;
    load: EventEmitter<any>;
    error: EventEmitter<any>;
    abort: EventEmitter<any>;

    public set connection(obj: any) {
        const { _file, _connection } = obj;
        if (!this.isConnected(_file)) {
            this._connections.push({
                id: _file.id,
                connection: _connection
            });
        }
    }

    private _id: string;
    private _connections: any[];

    /**
     * Creates an instance of Protocol and for each protocol an own unique ID.
     *
     * @memberOf Protocol
     */
    constructor() {
        this._id = Utils.uniqueID();
        this.progress = new EventEmitter<any>();
        this.load = new EventEmitter<any>();
        this.error = new EventEmitter<any>();
        this.abort = new EventEmitter<any>();
        this._connections = [];
    }

    /**
     * Call uploader method _onCompleteFile.
     *
     * @memberOf Protocol
     */
    public _onLoad(_file: FileManagerInterface, response: any, status: number, headers: any): void {
        const uploader: TransferInterface<FileManagerInterface> = _file.getUploader();
        const gist = this._isSuccessCode(status);
        const method = (g: boolean, f: FileManagerInterface, r: any, s: number, h: any) => {
            if (g) {
                uploader._onSuccessFile(f, r, s, h);
            } else {
                uploader._onErrorFile(f, r, s, h);
            }
        };
        method(gist, _file, response, status, headers);
        uploader._onCompleteFile(_file, response, status, headers);
    }

    /**
     * Call uploader methodes _onErrorFile and _onCompleteFile.
     *
     * @memberOf Protocol
     */
    public _onError(_file: FileManagerInterface, response: any, status: number, headers: any): void {
        const uploader: TransferInterface<FileManagerInterface> = _file.getUploader();
        uploader._onErrorFile(_file, response, status, headers);
        uploader._onCompleteFile(_file, response, status, headers);
    }

    /**
     * Call uploader methodes _onErrorFile and _onCompleteFile.
     *
     * @memberOf Protocol
     */
    public _onAbort(_file: FileManagerInterface, response: any, status: number, headers: any): void {
        const uploader: TransferInterface<FileManagerInterface> = _file.getUploader();
        uploader._onErrorFile(_file, response, status, headers);
        uploader._onCompleteFile(_file, response, status, headers);
    }

    /**
     * Validate response status code.+
     *
     * @memberOf Protocol
     */
    public _isSuccessCode(status: number): boolean {
        return (status >= 200 && status < 300) || status === 304;
    }

    public isConnected(_file: FileManagerInterface): any {
        for (const _request of this._connections) {
            if (_request.id === _file.id) {
                return _request;
            }
        }
        return false;
    }

    public removeConnection(_file: FileManagerInterface): void {
        let _request: any | null = null;
        for (const _key in this._connections) {
            if (this._connections.hasOwnProperty(_key)) {
                _request = this._connections[_key];
                if (_file.id === _request.id) {
                    this._connections.splice(+_key, 1);
                }
            }
        }
    }

    /**
     * Must be implemented at each protocol class.
     *
     * @memberOf Protocol
     */
    abstract run(_file: FileManagerInterface): any;
    abstract cancel(_file: FileManagerInterface): void;
}

/**
 * Standard protocol for server communication (file uploading)
 *
 * @export
 * @extends {Protocol}
 */
export class ProtocolXHR extends Protocol {
    constructor() {
        super();
    }

    /**
     * Implementation of the abstract.protocol method `run`
     *
     * @memberOf ProtocolXHR
     */
    public run(_file: FileManagerInterface): void {
        let _xhr: XMLHttpRequest;
        let sendable: any;
        const uploader: TransferInterface<FileManagerInterface> = _file.getUploader();

        const _formData = Utils.extendValue(uploader.options.formData, _file.options.formData);
        const _withCredentials = Utils.extendValue(uploader.options.withCredentials, _file.options.withCredentials);
        const _method = Utils.extendValue(uploader.options.method, _file.options.method);
        const _url = Utils.extendValue(uploader.options.url, _file.options.url);
        const _alias = Utils.extendValue(uploader.options.alias, _file.options.alias);
        const _headers = Utils.extendValue(uploader.options.headers, _file.options.headers);

        const _time: number = new Date().getTime();
        let _load = 0;
        let _speed = 0;
        let _speedToText: string | null = null;
        const $filesize = new FileSizePipe();

        _xhr = new XMLHttpRequest();

        this.connection = {
            _file: _file,
            _connection: _xhr
        };

        sendable = new FormData();

        if (typeof _formData !== 'undefined') {
            // Only allow Multipart
            for (const key in _formData) {
                if (_formData.hasOwnProperty(key)) {
                    const value = _formData[key];
                    sendable.append(key, value);
                }
            }
        }

        sendable.append(_alias, _file.element, _file.name);

        if (typeof _file.size !== 'number') {
            throw new TypeError('We need the file size.');
        }

        const _progress = (event: ProgressEvent) => {
            if (event.lengthComputable) {
                const _time2 = new Date().getTime() - _time;
                _load = event.loaded - _load;
                _speed = (_load / _time2) * 1000;
                _speed = parseInt(<any>_speed, 10);
                _speedToText = $filesize.transform(_speed);
                const _obj = {
                    total: event.total,
                    loaded: event.loaded,
                    percent: Math.round((event.loaded / event.total) * 100),
                    speed: _speed,
                    speedToText: _speedToText
                };
                this.progress.emit({ _file: _file, _data: _obj });
            }
        };

        const _loadHandler = (event) => {
            const headers = uploader._parseHeaders(_xhr.getAllResponseHeaders());
            const response = uploader._transformResponse(_xhr.response, headers);
            const status = _xhr.status;
            this.load.emit({ _file: _file, response: response, status: status, headers: headers });
        };

        const _errorHandler = (event) => {
            const headers = uploader._parseHeaders(_xhr.getAllResponseHeaders());
            const response = uploader._transformResponse(_xhr.response, headers);
            const status = _xhr.status;
            this.error.emit({ _file: _file, response: response, status: status, headers: headers });
        };

        const _abortHandler = (event) => {
            const headers = uploader._parseHeaders(_xhr.getAllResponseHeaders());
            const response = uploader._transformResponse(_xhr.response, headers);
            const status = _xhr.status;
            this.abort.emit({ _file: _file, response: response, status: status, headers: headers });
        };

        _xhr.upload.addEventListener('progress', _progress);

        _xhr.onreadystatechange = function(ev: Event): any {
            if (this.readyState === 4) {
                if (this.status >= 400) {
                    _errorHandler(ev);
                }
            }
        };
        _xhr.onload = _loadHandler;
        _xhr.addEventListener('abort', _abortHandler);

        _xhr.open(_method, _url, true);

        _xhr.withCredentials = _withCredentials;

        for (const name in _headers) {
            if (_headers.hasOwnProperty(name)) {
                const value = _headers[name];
                _xhr.setRequestHeader(name, value);
            }
        }

        _xhr.send(sendable);
    }

    public cancel(_file: FileManagerInterface) {
        const _request = this.isConnected(_file);
        if (!!_request) {
            _request.connection.abort();
            this.removeConnection(_file);
        }
    }
}
