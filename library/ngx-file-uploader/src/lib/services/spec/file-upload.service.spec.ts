import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { FileUploadService, FILE_UPLOADER_CONFIG } from '../file-upload.service';
import { FileUploader } from '../../classes/file-uploader.class';
import { TransferOptionsInterface } from '../../interfaces';
import { HookTypeEnum, FileManager } from '../../classes';
import { HttpEventType } from '@angular/common/http';

describe('FileUploadService', () => {
    let _service: FileUploadService;
    let _httpMock: HttpTestingController;

    const _dummyConfig = { url: 'https://test.test.de/api', method: 'POST' } as TransferOptionsInterface;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [FileUploadService, { provide: FILE_UPLOADER_CONFIG, useValue: _dummyConfig }]
        });

        _service = TestBed.inject(FileUploadService);
        _httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        _httpMock.verify();
    });

    it(`should initialize as 'default'`, () => {
        expect(_service.getUploader('default').id).toBeDefined();
    });

    it(`should return an error when uploader does not exists 'notThere'`, () => {
        expect(() => _service.getUploader('notThere')).toThrowError();
    });

    it(`should register a new uploader`, () => {
        const _uploader = new FileUploader(_dummyConfig);
        _service.registerUploadService('testUploader', _uploader);
        expect(_service.getUploader('testUploader').id).toBeDefined();
    });

    it(`should register a new uploader useDefaultProtocol`, () => {
        const _uploader = new FileUploader(_dummyConfig);
        _service.registerUploadService('testUploader', _uploader);
        _service.useDefaultProtocol('testUploader');
        expect(_service.getUploader('testUploader').id).toBeDefined();
    });

    it(`should does not register a new uploader twice with the same key 'default'`, () => {
        const _uploader = new FileUploader(_dummyConfig);
        expect(() => _service.registerUploadService('default', _uploader)).toThrowError();
    });

    it(`should set a hook to a uploader 'default'`, () => {
        expect(() =>
            _service.setHook('default', HookTypeEnum.prepareUploadFile, (...args) => {
                console.log('Works');
            })
        ).not.toThrowError();
    });

    it(`should not set the same hook twice to 'default'`, () => {
        expect(() => {
            _service.setHook('default', HookTypeEnum.prepareUploadFile, (...args) => {
                console.log('Works');
            });
            _service.setHook('default', HookTypeEnum.prepareUploadFile, (...args) => {
                console.log('Works');
            });
        }).toThrowError();
    });

    it(`should set 2 hooks with different priority to 'default'`, () => {
        expect(() => {
            _service.setHook(
                'default',
                HookTypeEnum.prepareUploadFile,
                (...args) => {
                    console.log('Works');
                },
                3
            );
            _service.setHook(
                'default',
                HookTypeEnum.prepareUploadFile,
                (...args) => {
                    console.log('Works2');
                },
                1
            );
        }).not.toThrowError();
    });

    describe(`with one file`, () => {
        let _file, _fileManager;

        beforeEach(() => {
            _file = new File(['sample'], 'sample.txt', { type: 'text/plain' });
            _fileManager = new FileManager(_file);
        });

        it(`should add a new file`, () => {
            const _uploader = _service.getUploader('default');

            _service.addFile('default', _fileManager);

            expect(_uploader.queueObs[0]).toEqual(_fileManager);
        });

        it(`should start a file upload`, (done: DoneFn) => {
            _service.startFile('default', _fileManager);

            const _req = _httpMock.expectOne(`https://test.test.de/api`);

            expect(_req.request.method).toBe('POST');

            _service.setHook('default', HookTypeEnum.successUploadFile, (...args) => {
                expect(args[0]).toEqual(_fileManager);
                done();
            });

            // Respond with a mocked UploadProgress HttpEvent
            _req.event({ type: HttpEventType.UploadProgress, loaded: 7, total: 10 });
            _req.event({ type: HttpEventType.UploadProgress, loaded: 10, total: 10 });
            _req.event({
                type: HttpEventType.Response,
                clone: null,
                headers: null,
                body: '',
                status: 200,
                statusText: '',
                url: `https://test.test.de/api`,
                ok: true
            });
        });

        it(`should cancel a file upload`, (done: DoneFn) => {
            _service.startFile('default', _fileManager);

            const _req = _httpMock.expectOne(`https://test.test.de/api`);

            expect(_req.request.method).toBe('POST');

            _service.setHook('default', HookTypeEnum.cancelUploadFile, (...args) => {
                expect(args[0]).toEqual(_fileManager);
                done();
            });

            // Respond with a mocked UploadProgress HttpEvent
            _req.event({ type: HttpEventType.UploadProgress, loaded: 3, total: 10 });
            _req.event({ type: HttpEventType.UploadProgress, loaded: 8, total: 10 });
            _service.cancelFile('default', _fileManager);
        });
    });

    describe(`with muliple files`, () => {
        let _fileA, _fileB, _fileManagerArray: FileManager[];

        beforeEach(() => {
            _fileA = new File(['sample'], 'fileA.png', { type: 'image/png' });
            _fileB = new File(['sample'], 'fileB.jpg', { type: 'image/jpg' });

            _fileManagerArray = [];

            _fileManagerArray.push(new FileManager(_fileA));
            _fileManagerArray.push(new FileManager(_fileB));
        });

        it(`should add a new files`, () => {
            const _uploader = _service.getUploader('default');

            _service.addFiles('default', _fileManagerArray);

            expect(_uploader.queueObs[0]).toEqual(_fileManagerArray[0]);
            expect(_uploader.queueObs[1]).toEqual(_fileManagerArray[1]);
        });

        it(`should start uploading all files`, (done: DoneFn) => {
            _service.addFiles('default', _fileManagerArray);
            _service.startAll('default');

            const _req = _httpMock.match(`https://test.test.de/api`);

            expect(_req[0].request.method).toBe('POST');
            expect(_req[1].request.method).toBe('POST');

            let _cnt = 0;
            _service.setHook('default', HookTypeEnum.successUploadFile, (...args) => {
                expect(args[0]).toEqual(_fileManagerArray[_cnt++]);
                if (_cnt === 2) {
                    done();
                }
            });

            // Respond with a mocked UploadProgress HttpEvent
            _req[0].event({ type: HttpEventType.UploadProgress, loaded: 7, total: 10 });
            _req[0].event({ type: HttpEventType.UploadProgress, loaded: 10, total: 10 });
            _req[0].event({
                type: HttpEventType.Response,
                clone: null,
                headers: null,
                body: '',
                status: 200,
                statusText: '',
                url: `https://test.test.de/api`,
                ok: true
            });

            // Respond with a mocked UploadProgress HttpEvent
            _req[1].event({ type: HttpEventType.UploadProgress, loaded: 7, total: 10 });
            _req[1].event({ type: HttpEventType.UploadProgress, loaded: 10, total: 10 });
            _req[1].event({
                type: HttpEventType.Response,
                clone: null,
                headers: null,
                body: '',
                status: 200,
                statusText: '',
                url: `https://test.test.de/api`,
                ok: true
            });
        });

        it(`should cancel all file uploads`, (done: DoneFn) => {
            _service.addFiles('default', _fileManagerArray);
            _service.startAll('default');

            const _req = _httpMock.match(`https://test.test.de/api`);

            expect(_req[0].request.method).toBe('POST');
            expect(_req[1].request.method).toBe('POST');

            let _cnt = 0;
            _service.setHook('default', HookTypeEnum.cancelUploadFile, (...args) => {
                expect(args[0]).toEqual(_fileManagerArray[_cnt++]);
                if (_cnt === 2) {
                    done();
                }
            });

            // Respond with a mocked UploadProgress HttpEvent
            _req[0].event({ type: HttpEventType.UploadProgress, loaded: 2, total: 10 });
            _req[0].event({ type: HttpEventType.UploadProgress, loaded: 5, total: 10 });

            // Respond with a mocked UploadProgress HttpEvent
            _req[1].event({ type: HttpEventType.UploadProgress, loaded: 1, total: 10 });
            _req[1].event({ type: HttpEventType.UploadProgress, loaded: 6, total: 10 });

            _service.cancelAll('default');
        });
    });
});
