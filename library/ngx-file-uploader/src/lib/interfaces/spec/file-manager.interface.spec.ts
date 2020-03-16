import { DatePipe } from '@angular/common';

import { instanceOfFileManagerInterface } from '../file-manager.interface';

describe('FileManagerInterface function', () => {
    it(`should return true`, () => {
        const _mockFileManager = {
            options: true,
            progressPercent$: true,
            progress$: true,

            handleImageLoad: true,
            canUpload: true,
            isUploading: true,
            isUploaded: true,
            remove: true,
            _cancel: true,
            cancel: true,
            upload: true,
            getUploader: true,

            onBeforeUpload: true,
            onProgressSpeed: true,
            onProgress: true,
            onSuccess: true,
            onError: true,
            _onBeforeUpload: true,
            _onProgressFileSpeed: true,
            _onProgress: true,
            _onSuccess: true,
            _onError: true
        };
        expect(instanceOfFileManagerInterface(_mockFileManager)).toBeTruthy();
    });
});
