import { TransferOptionsInterface } from './transfer-options.interface';
import { FileManagerOptionsInterface } from './file-manager-options.interface';

import { Observable } from 'rxjs';
import { UploaderHook, HookTypeEnum } from '../classes/uploader-hook.class';
import { FileFilter } from '../classes/file-filter.class';
import { Protocol } from '../classes/protocol.class';

export interface TransferInterface<T> {
    options: TransferOptionsInterface;

    id: string;
    queue$: Observable<T[]>;
    queueObs: T[];
    type: string;

    bindOptions(options: TransferOptionsInterface): void;
    isHTML5(): boolean;
    isDragAndDrop(): boolean;

    createDummy(fileElement: any, options: FileManagerOptionsInterface): T;

    hook(hook: UploaderHook);
    removeHook(hook: UploaderHook): boolean;
    activeHooks(): string[];

    addFilter(filter: FileFilter): void;

    addFile(file: T): boolean;
    removeFile(file: T): boolean;
    uploadFile(file: T): void;
    cancelUploadFile(file: T): void;

    setProtocol(protocol: Protocol): void;
    getProtocol(): Protocol;

    inQueue(file: T): number;
    validate(file: T): boolean;
    isSuccessCode(status: number): boolean;

    upload(): void;
    cancel(): void;
    remove(): void;

    /**
     * Overwrite functions
     */
    onAddFileAll(uploader: TransferInterface<T>): void;
    onAddFile(file: T): void;
    onAddFileError(file: T): void;
    onRemoveFile(file: T): void;
    onBeforeUploadAll(uploader: TransferInterface<T>): void;
    onBeforeUpload(file: T): void;
    onProgress(uploader: TransferInterface<T>, progress: any): void;
    onProgressFile(file: T, progress: number): void;
    onProgressFileSpeed(file: T, progress: any): void;
    onSuccess(file: T, response: any, status: number, headers: any): void;
    onError(file: T, response: any, status: number, headers: any): void;
    onCancel(file: T, response: any, status: number, headers: any): void;
    onComplete(file: T, response: any, status: number, headers: any): void;
    onCompleteAll(uploader: TransferInterface<T>): void;

    /**
     * Internal functions
     */
    _onAddFileAll(): void;
    _onAddFile(file: T): void;
    _onAddFileError(file: T): void;
    _onRemoveFile(file: T): void;
    _onBeforeUploadAll(): void;
    _onBeforeUpload(file: T): void;
    _onProgressFileSpeed(file: T, _speed: any): void;
    _onProgressFile(file: T, progress: number): void;
    _onProgress(): void;
    _onSuccessFile(file: T, response: any, status: number, headers: any): void;
    _onErrorFile(file: T, response: any, status: number, headers: any): void;
    _onCancelFile(file: T, response: any, status: number, headers: any): void;
    _onCompleteFile(file: T, response: any, status: number, headers: any): void;
    _onCompleteAll(): void;

    _headersGetter(parsedHeaders: any): (name: string) => any;
    _parseHeaders(headers: string): object;
    _transformResponse(response: any, headers: any): any;

    _runHook(type: HookTypeEnum, ...args: any[]): void;

    init(): void;
    destroy(): void;
}
