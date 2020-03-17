import { Protocol, ProtocolXHR } from './protocol.class';
import { Subscription } from 'rxjs';
import { Transfer } from './transfer.class';
import { FileManager } from './file-manager.class';
import { TransferOptionsInterface, FileManagerOptionsInterface } from '../interfaces';
import { TransferInterface } from '../interfaces/transfer.interface';
import { FileManagerInterface, instanceOfFileManagerInterface } from '../interfaces/file-manager.interface';

export class FileUploader extends Transfer implements TransferInterface<FileManagerInterface> {
    private _subs: Subscription[] = [];

    constructor(_options?: TransferOptionsInterface, _protocol?: Protocol) {
        super('FileUploader', _options);

        if (typeof _protocol === 'undefined') {
            this.setProtocol(new ProtocolXHR());
        } else {
            this.setProtocol(_protocol);
        }
        this.init();
    }

    public init() {
        this.destroy();

        const sub1 = this.getProtocol().progress.subscribe(
            (obj: any) => {
                const { _file, _data } = obj;
                if (instanceOfFileManagerInterface(_file)) {
                    this._onProgressFile(_file, _data.percent);
                    this._onProgressFileSpeed(_file, _data);
                }
            },
            (error: any) => {
                throw new Error(error);
            }
        );
        this._subs.push(sub1);

        const sub2 = this.getProtocol().load.subscribe(
            (obj: any) => {
                const { _file, response, status, headers } = obj;
                if (instanceOfFileManagerInterface(_file)) {
                    const uploader: TransferInterface<FileManagerInterface> = _file.getUploader();
                    const gist = this.isSuccessCode(status);
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
            },
            (error: any) => {
                throw new Error(error);
            }
        );
        this._subs.push(sub2);

        const sub3 = this.getProtocol().error.subscribe(
            (obj: any) => {
                const { _file, response, status, headers } = obj;
                if (instanceOfFileManagerInterface(_file)) {
                    const uploader: TransferInterface<FileManagerInterface> = _file.getUploader();
                    uploader._onErrorFile(_file, response, status, headers);
                    uploader._onCompleteFile(_file, response, status, headers);
                }
            },
            (error: any) => {
                throw new Error(error);
            }
        );
        this._subs.push(sub3);

        const sub4 = this.getProtocol().abort.subscribe(
            (obj: any) => {
                const { _file, response, status, headers } = obj;
                if (instanceOfFileManagerInterface(_file)) {
                    const uploader: TransferInterface<FileManagerInterface> = _file.getUploader();
                    uploader._onCancelFile(_file, response, status, headers);
                    uploader._onCompleteFile(_file, response, status, headers);
                }
            },
            (error: any) => {
                throw new Error(error);
            }
        );
        this._subs.push(sub4);
    }

    public destroy() {
        for (const _sub of this._subs) {
            _sub.unsubscribe();
        }
        this._subs = [];
    }
}
