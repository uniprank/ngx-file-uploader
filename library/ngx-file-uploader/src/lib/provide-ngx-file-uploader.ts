import { makeEnvironmentProviders, EnvironmentProviders } from '@angular/core';
import { FILE_UPLOADER_CONFIG } from './services/file-upload.service';
import { TransferOptionsInterface } from './interfaces';

export function provideNgxFileUploader(config: TransferOptionsInterface = {}): EnvironmentProviders {
    return makeEnvironmentProviders([
        { provide: FILE_UPLOADER_CONFIG, useValue: config }
    ]);
}
