import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, fakeAsync, async } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';

import { FileUploader } from '../file-uploader.class';
import { TransferOptionsInterface } from '../../interfaces';
import { AngularFileUploadProtocol } from '../../services';
import { UploaderHook, HookTypeEnum } from '../uploader-hook.class';
import { FileManager } from '../file-manager.class';
import { FileFilter } from '../file-filter.class';

describe('FileUploader', () => {
    let _httpClient: HttpClient;
    let _httpMock: HttpTestingController;
    let _fileUploader: FileUploader;
    let _dummyConfig: TransferOptionsInterface;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: []
        });

        _httpClient = TestBed.inject(HttpClient);
        _httpMock = TestBed.inject(HttpTestingController);
        _dummyConfig = { url: 'https://test.test.de/api', method: 'POST' };

        _fileUploader = new FileUploader(_dummyConfig, new AngularFileUploadProtocol(_httpClient));
    });
    it(`should create a new file uploader instance`, () => {
        const _fileUploaderTest = new FileUploader();
        expect(_fileUploaderTest).toBeDefined();
    });

    it(`should create a file uploader with options and protocol`, () => {
        expect(_fileUploader).toBeDefined();
    });

    it(`should is HTML5`, () => {
        expect(_fileUploader.isHTML5()).toBeTruthy();
    });

    it(`should be drag and drop able`, () => {
        expect(_fileUploader.isDragAndDrop()).toBeTruthy();
    });

    it(`should set and remove the same hook`, () => {
        const _customHook = new UploaderHook(HookTypeEnum.afterAddingFile, () => console.log('Test'));
        expect(() => _fileUploader.hook(_customHook)).not.toThrowError();
        expect(_fileUploader.activeHooks().join(' - ')).toBe(`afterAddingFile->prio:0`);
        expect(_fileUploader.removeHook(_customHook)).toBeTruthy();
        expect(_fileUploader.removeHook(_customHook)).toBeFalsy();
    });

    it(`should set hooks and sorting correct`, () => {
        const _customHook1 = new UploaderHook(HookTypeEnum.afterAddingFile, () => console.log('Test'));
        const _customHook21 = new UploaderHook(HookTypeEnum.errorAddingFile, () => console.log('Test2.1'));
        const _customHook22 = new UploaderHook(HookTypeEnum.errorAddingFile, () => console.log('Test2.2'));
        const _customHook31 = new UploaderHook(HookTypeEnum.beforeAddingFile, () => console.log('Test3.1'), 5);
        const _customHook32 = new UploaderHook(HookTypeEnum.beforeAddingFile, () => console.log('Test3.2'), 1);
        const _customHook33 = new UploaderHook(HookTypeEnum.beforeAddingFile, () => console.log('Test3.3'), 1);
        const _customHook34 = new UploaderHook(HookTypeEnum.beforeAddingFile, () => console.log('Test3.4'), 6);

        _fileUploader.hook(_customHook1);
        _fileUploader.hook(_customHook21);
        _fileUploader.hook(_customHook22);
        _fileUploader.hook(_customHook31);
        _fileUploader.hook(_customHook32);
        _fileUploader.hook(_customHook33);
        _fileUploader.hook(_customHook34);

        expect(_fileUploader.activeHooks().join(';')).toBe(
            // tslint:disable-next-line: max-line-length
            `afterAddingFile->prio:0;beforeAddingFile->prio:6;beforeAddingFile->prio:5;beforeAddingFile->prio:1;beforeAddingFile->prio:1;errorAddingFile->prio:0;errorAddingFile->prio:0`
        );
    });

    it(`should add new file to queue`, (done: DoneFn) => {
        const _fileUploaderDummy = new FileUploader(
            { ..._dummyConfig, ...{ uniqueFiles: true } },
            new AngularFileUploadProtocol(_httpClient)
        );
        const _file = new File(['sample'], 'sample.txt', { type: 'text/plain' });
        const _fileManager = new FileManager(_file);

        _fileUploaderDummy.queue$.subscribe((data) => {
            if (data != null && data.length === 1) {
                expect(data[0]).toEqual(_fileManager);
                done();
            }
        });

        _fileUploaderDummy.addFile(_fileManager);

        expect(_fileUploaderDummy.addFile(_fileManager)).toBeFalsy();
    });

    it(`should add and remove a file`, () => {
        const _file = new File(['sample'], 'sample.txt', { type: 'text/plain' });
        const _fileManager = new FileManager(_file);

        const _file2 = new File(['sample'], 'sample.jpg', { type: 'image/jpeg' });
        const _fileManager2 = new FileManager(_file2);

        const _fileTxtFilter = new FileFilter('TextFilter', new RegExp('text/plain'), 'type');

        _fileUploader.addFilter(_fileTxtFilter);

        expect(_fileUploader.addFile(_fileManager)).toBeTruthy();
        expect(_fileUploader.addFile(_fileManager2)).toBeFalsy();
        expect(_fileUploader.removeFile(_fileManager)).toBeTruthy();
        expect(_fileUploader.removeFile(_fileManager)).toBeFalsy();
    });

    it(`should add filter and validate`, () => {
        const _fileTxt = new File(['sample'], 'sample.txt', { type: 'text/plain' });
        const _fileTxtManager = new FileManager(_fileTxt);

        const _fileJpg = new File(['sample'], 'sample.jpg', { type: 'image/jpeg' });
        const _fileJpgManager = new FileManager(_fileJpg);

        const _fileJpgFilter = new FileFilter('ImageFilter', new RegExp('image/jpeg|image/png|image/gif'), 'type');

        _fileUploader.addFilter(_fileJpgFilter);
        _fileUploader.addFilter(_fileJpgFilter);

        expect(_fileUploader.validate(_fileTxtManager)).toBeFalsy();
        expect(_fileUploader.validate(_fileJpgManager)).toBeTruthy();
    });

    it(`should remove all files`, () => {
        const _file = new File(['sample'], 'sample.txt', { type: 'text/plain' });
        const _fileManager = new FileManager(_file);

        const _file2 = new File(['sample'], 'sample.jpg', { type: 'image/jpeg' });
        const _fileManager2 = new FileManager(_file2);

        expect(_fileUploader.addFile(_fileManager)).toBeTruthy();
        expect(_fileUploader.addFile(_fileManager2)).toBeTruthy();

        _fileUploader.remove();

        expect(_fileUploader.queueObs.length).toBe(0);
    });
});
