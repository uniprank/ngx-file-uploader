import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Transfer, HookTypeEnum, UploaderHook, FileManager, ProtocolXHR, FileUploader } from '../classes';
import { TransferOptionsInterface } from '../interfaces';
import { AngularFileUploadProtocol } from './angular-file-upload.protocol';

interface UploadServiceInterface {
    uploader: Transfer;
}

export const FILE_UPLOADER_CONFIG = new InjectionToken<TransferOptionsInterface>(null);

@Injectable()
export class FileUploadService {
    private _uploadServices: { [key: string]: UploadServiceInterface } = {};

    constructor(private _httpClient: HttpClient, @Inject(FILE_UPLOADER_CONFIG) @Optional() private _config?: TransferOptionsInterface) {
        if (_config && _config.url) {
            this.registerUploadService('default', new FileUploader(_config));
            this.useAngularProtocol('default');
        }
    }

    public registerUploadService(uploaderKey: string, uploader: Transfer): void {
        if (this._uploadServices[uploaderKey] != null) {
            throw new Error(`Upload service with the key [${uploaderKey}] exists.`);
        }
        if (this._config) {
            uploader.bindOptions({ ...this._config, ...uploader.options });
        }
        this._uploadServices[uploaderKey] = {
            uploader
        };
    }

    public setHook(uploaderKey: string, type: HookTypeEnum, fnCallback: (...args) => void, priority = 0): void {
        this._checkUploader(uploaderKey);

        this._uploadServices[uploaderKey].uploader.hook(new UploaderHook(type, fnCallback, priority));
    }

    public useAngularProtocol(uploaderKey: string): void {
        this._checkUploader(uploaderKey);

        this._uploadServices[uploaderKey].uploader.setProtocol(new AngularFileUploadProtocol(this._httpClient));
        this._uploadServices[uploaderKey].uploader.init();
    }

    public useDefaultProtocol(uploaderKey: string): void {
        this._checkUploader(uploaderKey);

        this._uploadServices[uploaderKey].uploader.setProtocol(new ProtocolXHR());
        this._uploadServices[uploaderKey].uploader.init();
    }

    public getUploader(uploaderKey: string): Transfer {
        this._checkUploader(uploaderKey);

        return this._uploadServices[uploaderKey].uploader;
    }

    public addFile(uploaderKey: string, file: FileManager): void {
        this._checkUploader(uploaderKey);

        this._uploadServices[uploaderKey].uploader.addFile(file);
    }

    public addFiles(uploaderKey: string, files: FileManager[]): void {
        this._checkUploader(uploaderKey);

        this._uploadServices[uploaderKey].uploader.addFilesToQueue(files);
    }

    public startAll(uploaderKey: string): void {
        this._checkUploader(uploaderKey);

        this._uploadServices[uploaderKey].uploader.upload();
    }

    public startFile(uploaderKey: string, file: FileManager): void {
        this._checkUploader(uploaderKey);

        this._uploadServices[uploaderKey].uploader.uploadFile(file);
    }

    public cancelAll(uploaderKey: string): void {
        this._checkUploader(uploaderKey);

        this._uploadServices[uploaderKey].uploader.cancel();
    }

    public cancelFile(uploaderKey: string, file: FileManager): void {
        this._checkUploader(uploaderKey);

        this._uploadServices[uploaderKey].uploader.cancelUploadFile(file);
    }

    /** Internal Function */
    private _checkUploader(uploaderKey: string): void {
        if (this._uploadServices[uploaderKey] == null) {
            throw new Error(`Upload service with the key [${uploaderKey}] doesn't exists.`);
        }
    }
}
