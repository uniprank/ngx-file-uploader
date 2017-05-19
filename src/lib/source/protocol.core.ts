import { EventEmitter } from '@angular/core';
import { Utils } from './utils.core';
import { Transfer } from './transfer.core';
import { FileManager } from './fileManager.core';
import { FileSizePipe } from '../pipe/fileSizePipe.pipe';

// tslint:disable:max-line-length

const {
    FormData
} = (<any>window);

/**
 * Absractr proctol class if someone want to write his own protocol
 *
 * @export
 * @abstract
 * @class Protocol
 */
export abstract class Protocol {
    _progress: EventEmitter<any>;
    _load: EventEmitter<any>;
    _error: EventEmitter<any>;
    _abort: EventEmitter<any>;

    public set connection(obj: any) {
        const {
            _file,
            _connection
        } = obj;
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
     *
     * @memberOf Protocol
     */
    constructor () {
        this._id = Utils.uniqueID();
        this._progress = new EventEmitter<any>();
        this._load = new EventEmitter<any>();
        this._error = new EventEmitter<any>();
        this._abort = new EventEmitter<any>();
        this._connections = [];
    }

    /**
     * Call uploader method _onCompleteFile.
     *
     * @param {FileManager} _file
     * @param {any} response
     * @param {any} status
     * @param {any} headers
     *
     * @memberOf Protocol
     */
    public _onLoad (_file: FileManager, response: any, status: number, headers: any): void {
        const uploader: Transfer = _file.getUploader();
        const gist = this._isSuccessCode(status);
        const method = (g: boolean, f: FileManager, r: any, s: number, h: any) => { if (g) { uploader._onSuccessFile(f, r, s, h); } else { uploader._onErrorFile(f, r, s, h); } };
        method(gist, _file, response, status, headers);
        uploader._onCompleteFile(_file, response, status, headers);
    }

    /**
     * Call uploader methodes _onErrorFile and _onCompleteFile.
     *
     * @param {FileManager} _file
     * @param {any} response
     * @param {any} status
     * @param {any} headers
     *
     * @memberOf Protocol
     */
    public _onError (_file: FileManager, response: any, status: number, headers: any): void {
        const uploader: Transfer = _file.getUploader();
        uploader._onErrorFile(_file, response, status, headers);
        uploader._onCompleteFile(_file, response, status, headers);
    }

    /**
     * Call uploader methodes _onErrorFile and _onCompleteFile.
     *
     * @param {FileManager} _file
     * @param {any} response
     * @param {any} status
     * @param {any} headers
     *
     * @memberOf Protocol
     */
    public _onAbort (_file: FileManager, response: any, status: number, headers: any): void {
        const uploader: Transfer = _file.getUploader();
        uploader._onErrorFile(_file, response, status, headers);
        uploader._onCompleteFile(_file, response, status, headers);
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

    public isConnected(_file: FileManager): any {
        for (const _request of this._connections) {
            if (_request.id === _file.id) {
                return _request;
            }
        }
        return false;
    }

    public removeConnection(_file: FileManager): void {
        let _request: any | null = null;
        for (const _key in this._connections) {
            if ( this._connections.hasOwnProperty( _key ) ) {
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
     * @abstract
     * @param {FileManager} _file
     *
     * @memberOf Protocol
     */
    abstract run(_file: FileManager): any;
    abstract cancel(_file: FileManager): void;
}

/**
 * Standard protocol for server communication (file uploading)
 *
 * @export
 * @class ProtocolXHR
 * @extends {Protocol}
 */
export class ProtocolXHR extends Protocol {
    constructor () {
        super();
    }

    /**
     * Implementation of the abstract.protocol method `run`
     *
     * @param {FileManager} _file
     *
     * @memberOf ProtocolXHR
     */
    public run (_file: FileManager): void {
        let _xhr: XMLHttpRequest;
        let sendable: any;
        const uploader: Transfer = _file.getUploader();

        const _formData = Utils.extendValue(uploader.options.formData, _file.options.formData);
        const _withCredentials = Utils.extendValue(uploader.options.withCredentials, _file.options.withCredentials);
        const _method = Utils.extendValue(uploader.options.method, _file.options.method);
        const _url = Utils.extendValue(uploader.options.url, _file.options.url);
        const _alias = Utils.extendValue(uploader.options.alias, _file.options.alias);
        const _headers = Utils.extendValue(uploader.options.headers, _file.options.headers);

        const time: number = new Date().getTime();
        let load = 0;
        let speed = 0;
        let sppedToText: string|null = null;
        const $filesize = new FileSizePipe();

        _xhr = new XMLHttpRequest();

        this.connection = {
            _file: _file,
            _connection: _xhr
        };

        sendable = new FormData();

        if (typeof _formData !== 'undefined') {
            // Only allow Multipart
            for (const obj of _formData) {
                for (const key in obj) {
                    if ( obj.hasOwnProperty( key ) ) {
                        const value = obj[key];
                        sendable.append(key, value);
                    }
                }
            }
        }

        sendable.append(_alias, _file.element, _file.name);

        if (typeof(_file.size) !== 'number') {
            throw new TypeError('We need the file size.');
        }

        _xhr.upload.addEventListener('progress', (event: ProgressEvent) => {
            if (event.lengthComputable) {
                const _time = new Date().getTime() - time;
                load = event.loaded - load;
                speed = load / _time * 1000;
                speed = parseInt(<any>speed, 10);
                sppedToText = $filesize.transform(speed);
                const _obj = {
                    total: event.total,
                    loaded: event.loaded,
                    percent: Math.round(event.loaded / event.total * 100),
                    speed: speed,
                    speedToText: sppedToText
                };
                this._progress.emit({_file: _file, _data: _obj});
            }
        });
        _xhr.addEventListener('load', () => {
            const headers = uploader._parseHeaders(_xhr.getAllResponseHeaders());
            const response = uploader._transformResponse(_xhr.response, headers);
            console.log('File upload done');
            const status = _xhr.status;
            this._load.emit({_file: _file, response: response, status: status, headers: headers});
        });
        _xhr.addEventListener('error', () => {
            const headers = uploader._parseHeaders(_xhr.getAllResponseHeaders());
            const response = uploader._transformResponse(_xhr.response, headers);
            console.log('File upload error');
            const status = _xhr.status;
            this._error.emit({_file: _file, response: response, status: status, headers: headers});
        });
        _xhr.addEventListener('abort', () => {
            const headers = uploader._parseHeaders(_xhr.getAllResponseHeaders());
            const response = uploader._transformResponse(_xhr.response, headers);
            console.log('File upload abort');
            const status = _xhr.status;
            this._abort.emit({_file: _file, response: response, status: status, headers: headers});
        });

        _xhr.open(_method, _url, true);

        _xhr.withCredentials = _withCredentials;

        for (const name in _headers) {
            if ( _headers.hasOwnProperty( name ) ) {
                const value = _headers[name];
                _xhr.setRequestHeader(name, value);
            }
        }

        _xhr.send(sendable);
    }

    public cancel(_file: FileManager) {
        const _request = this.isConnected(_file);
        if (!!_request) {
            _request.connection.abort();
            this.removeConnection(_file);
        }
    }
}
