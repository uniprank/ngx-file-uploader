import { Signal } from '@angular/core';

import { FileManagerOptionsInterface } from './file-manager-options.interface';
import { ProgressDetail } from './progress-detail.interface';
import { FileObject } from '../classes/file-object.class';
import { TransferInterface } from './transfer.interface';

export interface FileManagerInterface {
    id: string;
    options: FileManagerOptionsInterface;
    progressPercent: Signal<number>;
    progressDetail: Signal<ProgressDetail>;
    progressValue: number;
    element: any;
    object: FileObject;
    name: string;
    type: string;
    date: Date | null;
    size: number | null;
    inQueue: boolean;
    success: boolean;
    error: boolean;
    response: any;

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

    onBeforeUpload(): void;
    onProgressSpeed(speed: ProgressDetail): void;
    onProgress(progress: number): void;
    onSuccess(response: any, status: number, headers: any): void;
    onError(response: any, status: number, headers: any): void;

    _onBeforeUpload(): void;
    _onProgressFileSpeed(speed: ProgressDetail): void;
    _onProgress(_progress: number): void;
    _onSuccess(response: any, status: number, headers: any): void;
    _onError(response: any, status: number, headers: any): void;
}

export function instanceOfFileManagerInterface(obj: any): obj is FileManagerInterface {
    return [
        'options',
        'progressPercent',
        'progressDetail',

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
