import { Protocol, ProtocolXHR } from './protocol.core';
import { Transfer } from './transfer.core';
import { FileManager } from './fileManager.core';
import { TransferOptions } from '../interface';

// tslint:disable:max-line-length

export class FileUploader extends Transfer {
    constructor (_options?: TransferOptions, _protocol?: Protocol) {
        super('FileUploader', _options);

        if (typeof _protocol === 'undefined') {
            this._setProtocol( new ProtocolXHR() );

            this._getProtocol()._progress.subscribe((obj: any) => {
                let {
                    _file,
                    _data
                } = obj;
                if (_file instanceof FileManager) {
                    this._onProgressFile(_file, _data.percent);
                    this._onProgressFileSpeed(_file, _data);
                }
            });

            this._getProtocol()._load.subscribe((obj: any) => {
                let {
                    _file,
                    response,
                    status,
                    headers
                } = obj;
                if (_file instanceof FileManager) {
                    let uploader: Transfer = _file.getUploader();
                    let gist = this._isSuccessCode(status);
                    let method = (g: boolean, f: FileManager, r: any, s: number, h: any) => { if (g) { uploader._onSuccessFile(f, r, s, h); } else { uploader._onErrorFile(f, r, s, h); } };
                    method(gist, _file, response, status, headers);
                    uploader._onCompleteFile(_file, response, status, headers);
                }
            });

            this._getProtocol()._error.subscribe((obj: any) => {
                let {
                    _file,
                    response,
                    status,
                    headers
                } = obj;
                if (_file instanceof FileManager) {
                    let uploader: Transfer = _file.getUploader();
                    uploader._onErrorFile(_file, response, status, headers);
                    uploader._onCompleteFile(_file, response, status, headers);
                }
            });

            this._getProtocol()._abort.subscribe((obj: any) => {
                let {
                    _file,
                    response,
                    status,
                    headers
                } = obj;
                if (_file instanceof FileManager) {
                    let uploader: Transfer = _file.getUploader();
                    uploader._onErrorFile(_file, response, status, headers);
                    uploader._onCompleteFile(_file, response, status, headers);
                }
            });
        }
    }
}
