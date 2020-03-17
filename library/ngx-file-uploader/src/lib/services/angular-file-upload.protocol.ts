import { HttpClient, HttpEvent, HttpEventType, HttpRequest } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { map, catchError, takeUntil } from 'rxjs/operators';

import { Protocol, Utils } from '../classes';
import { FileSizePipe } from '../pipes';
import { TransferInterface, FileManagerInterface } from '../interfaces';

export class AngularFileUploadProtocol extends Protocol {
    protected ngUnsubscribe: Subject<void> = new Subject<void>();

    constructor(private _httpClient: HttpClient) {
        super();
    }

    /**
     * Implementation of the abstract.protocol method `run`
     *
     * @memberOf ProtocolXHR
     */
    public async run<T>(_file: FileManagerInterface): Promise<void> {
        let sendable: any;
        const uploader: TransferInterface<FileManagerInterface> = _file.getUploader();

        const _formData = Utils.extendValue(uploader.options.formData, _file.options.formData);
        const _withCredentials = Utils.extendValue(uploader.options.withCredentials, _file.options.withCredentials);
        const _method = Utils.extendValue(uploader.options.method, _file.options.method);
        const _url = Utils.extendValue(uploader.options.url, _file.options.url);
        const _alias = Utils.extendValue(uploader.options.alias, _file.options.alias);
        const _headers = Utils.extendValue(uploader.options.headers, _file.options.headers, { 'Content-Type': 'multipart/form-data' });

        const time: number = new Date().getTime();

        this.connection = {
            _file: _file,
            _connection: null
        };

        sendable = new FormData();

        if (typeof _formData !== 'undefined') {
            // Only allow Multipart
            for (const obj of _formData) {
                for (const key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        const value = obj[key];
                        sendable.append(key, value);
                    }
                }
            }
        }

        sendable.append(_alias, _file.element, _file.name);

        if (typeof _file.size !== 'number') {
            throw new TypeError('We need the file size.');
        }

        const _req = new HttpRequest(_method, _url, sendable, {
            headers: _headers,
            reportProgress: true,
            withCredentials: _withCredentials
        });

        const _post = this._httpClient.request<T>(_req);
        await this.handleMethode<T>(_file, _post, time);
    }

    public async handleMethode<T>(
        _file: FileManagerInterface,
        requestHandle: Observable<HttpEvent<T>>,
        time: number
    ): Promise<HttpEvent<T>> {
        let _load = 0;
        let _speed = 0;
        let _speedToText: string | null = null;
        const _$filesize = new FileSizePipe();

        let _headers, _response, _status, _request;

        return requestHandle
            .pipe(
                takeUntil(this.ngUnsubscribe),
                map((event) => {
                    switch (event.type) {
                        case HttpEventType.UploadProgress:
                            const _time = new Date().getTime() - time;
                            _load = event.loaded - _load;
                            _speed = (_load / _time) * 1000;
                            _speed = parseInt(<any>_speed, 10);
                            _speedToText = _$filesize.transform(_speed);
                            const _obj = {
                                total: event.total,
                                loaded: event.loaded,
                                percent: Math.round((event.loaded / event.total) * 100),
                                speed: _speed,
                                speedToText: _speedToText
                            };
                            _request = this.isConnected(_file);
                            if (!!_request) {
                                this.progress.emit({ _file: _file, _data: _obj });
                            }
                            return event;

                        case HttpEventType.Response:
                            _headers = event.headers;
                            _response = event.body;
                            _status = event.status;
                            _request = this.isConnected(_file);
                            if (!!_request) {
                                this.load.emit({ _file: _file, response: _response, status: _status, headers: _headers });
                            }
                            return event;
                        default:
                            return event;
                    }
                }),
                catchError((operation = 'operation', result?: any) => {
                    return (error: any): Observable<any> => {
                        console.log(`${operation} failed: ${error.message}`);
                        this.error.emit({ _file: _file, response: result, status: error.status, headers: {} });
                        console.error(error);

                        return of(result);
                    };
                })
            )
            .toPromise();
    }

    public cancel(_file: FileManagerInterface) {
        const _request = this.isConnected(_file);
        if (!!_request) {
            this.ngUnsubscribe.next();
            this.ngUnsubscribe.complete();
            this.abort.emit({ _file: _file, response: {}, status: 999, headers: {} });
            this.removeConnection(_file);
        }
    }
}
