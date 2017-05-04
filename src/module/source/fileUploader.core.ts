import { Protocol, ProtocolXHR } from './protocol.core';
import { Subscription } from 'rxjs/Subscription';
import { Transfer } from './transfer.core';
import { FileManager } from './fileManager.core';
import { TransferOptions } from '../interface';

// tslint:disable:max-line-length

export class FileUploader extends Transfer {
    private _subs: Subscription[] = [];

    constructor (_options?: TransferOptions, _protocol?: Protocol) {
        super('FileUploader', _options);

        if (typeof _protocol === 'undefined') {
            this._setProtocol( new ProtocolXHR() );

            const sub1 = this._getProtocol()._progress.subscribe((obj: any) => {
                const {
                    _file,
                    _data
                } = obj;
                if (_file instanceof FileManager) {
                    this._onProgressFile(_file, _data.percent);
                    this._onProgressFileSpeed(_file, _data);
                }
            }, error => {
                throw new Error(error);
            });
            this._subs.push(sub1);

            const sub2 = this._getProtocol()._load.subscribe((obj: any) => {
                const {
                    _file,
                    response,
                    status,
                    headers
                } = obj;
                if (_file instanceof FileManager) {
                    const uploader: Transfer = _file.getUploader();
                    const gist = this._isSuccessCode(status);
                    const method = (g: boolean, f: FileManager, r: any, s: number, h: any) => { if (g) { uploader._onSuccessFile(f, r, s, h); } else { uploader._onErrorFile(f, r, s, h); } };
                    method(gist, _file, response, status, headers);
                    uploader._onCompleteFile(_file, response, status, headers);
                }
            }, error => {
                throw new Error(error);
            });
            this._subs.push(sub2);

            const sub3 = this._getProtocol()._error.subscribe((obj: any) => {
                const {
                    _file,
                    response,
                    status,
                    headers
                } = obj;
                if (_file instanceof FileManager) {
                    const uploader: Transfer = _file.getUploader();
                    uploader._onErrorFile(_file, response, status, headers);
                    uploader._onCompleteFile(_file, response, status, headers);
                }
            }, error => {
                throw new Error(error);
            });
            this._subs.push(sub3);

            const sub4 = this._getProtocol()._abort.subscribe((obj: any) => {
                const {
                    _file,
                    response,
                    status,
                    headers
                } = obj;
                if (_file instanceof FileManager) {
                    const uploader: Transfer = _file.getUploader();
                    uploader._onErrorFile(_file, response, status, headers);
                    uploader._onCompleteFile(_file, response, status, headers);
                }
            }, error => {
                throw new Error(error);
            });
            this._subs.push(sub4);
        }
    }

    public destroy() {
        for (const _sub of this._subs) {
            _sub.unsubscribe();
        }
        this._subs = [];
    }
}
