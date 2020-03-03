import { Observable } from 'rxjs';

import { FileManagerOptionsInterface } from './file-manager-options.interface';
import { FileObject } from '../classes/file-object.class';
import { TransferInterface } from './transfer.interface';

export interface FileManagerInterface {
    id: string;
    options: FileManagerOptionsInterface;
    progressPercent$: Observable<number>;
    progress$: Observable<any>;
    progress: any;
    element: any;
    object: FileObject;
    name: string;
    type: string;
    date: Date | null;
    size: number | null;
    inQueue: boolean;
    success: boolean;
    error: boolean;

    protocol(_protocol: any): void;

    bindUploader(_uploader: TransferInterface<FileManagerInterface>): void;
    bindOptions(_options: FileManagerOptionsInterface): void;

    getUploader(): TransferInterface<FileManagerInterface>;
    upload(): void;

    cancel(): void;
    _cancel(): void;

    remove(): void;

    isUploaded(): boolean;
    isUploading(): boolean;
    canUpload(): boolean;

    handleImageLoad(): void;

    /**
     * Overwrite functions
     */
    onBeforeUpload(): void;
    onProgressSpeed(speed: any): void;
    onProgress(progress: number): void;
    onSuccess(response: any, status: number, headers: any): void;
    onError(response: any, status: number, headers: any): void;

    /**
     *  Internal functions
     */
    _onBeforeUpload(): void;
    _onProgressFileSpeed(speed: any);
    _onProgress(_progress: number): void;
    _onSuccess(response: any, status: number, headers: any): void;
    _onError(response: any, status: number, headers: any): void;
}

export function instanceOfFileManagerInterface(obj: any): obj is FileManagerInterface {
    return [
        'options',
        'progressPercent$',
        'progress$',

        'handleImageLoad',
        'canUpload',
        'isUploading',
        'isUploaded',
        'remove',
        '_cancel',
        'cancel',
        'upload',
        'getUploader',

        'onBeforeUpload',
        'onProgressSpeed',
        'onProgress',
        'onSuccess',
        'onError',
        '_onBeforeUpload',
        '_onProgressFileSpeed',
        '_onProgress',
        '_onSuccess',
        '_onError'
    ].every((key) => key in obj);
}
