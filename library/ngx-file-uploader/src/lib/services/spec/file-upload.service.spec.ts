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

    it(`should add a new file`, () => {
        const _time = new Date();
        const _file = ({
            lastModified: _time,
            size: 256,
            type: 'image/png',
            name: 'Test_Dummy-Image.png'
        } as unknown) as File;
        const _fileManager = new FileManager(_file);
        const _uploader = _service.getUploader('default');

        _service.addFile('default', _fileManager);

        expect(_uploader.queueObs[0]).toEqual(_fileManager);
    });

    it(`should add a new files`, () => {
        const _time = new Date();

        const _fileA = ({
            lastModified: _time,
            size: 256,
            type: 'image/png',
            name: 'Test_Dummy-Image.png'
        } as unknown) as File;

        const _fileB = ({
            lastModified: _time,
            size: 512,
            type: 'image/jpg',
            name: 'Test_Dummy-Image.jpg'
        } as unknown) as File;

        const _fileManagerArray: FileManager[] = [];

        _fileManagerArray.push(new FileManager(_fileA));
        _fileManagerArray.push(new FileManager(_fileB));

        const _uploader = _service.getUploader('default');

        _service.addFiles('default', _fileManagerArray);

        expect(_uploader.queueObs[0]).toEqual(_fileManagerArray[0]);
        expect(_uploader.queueObs[1]).toEqual(_fileManagerArray[1]);
    });

    it(`should start all file upload`, (done: DoneFn) => {
        const _file = new File(['sample'], 'sample.txt', { type: 'text/plain' });
        const _fileManager = new FileManager(_file);

        _service.addFile('default', _fileManager);
        _service.startAll('default');

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

    it(`should start a file upload`, (done: DoneFn) => {
        const _file = new File(['sample'], 'sample.txt', { type: 'text/plain' });
        const _fileManager = new FileManager(_file);

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
});
