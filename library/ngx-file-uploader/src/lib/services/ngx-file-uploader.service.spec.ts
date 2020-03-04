import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { FileUploadService } from './file-upload.service';

describe('NgxFileUploaderService', () => {
    let service: FileUploadService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [FileUploadService]
        });
        service = TestBed.inject(FileUploadService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
