import { DatePipe } from '@angular/common';

import { FileObject } from '../file-object.class';

describe('FileObject', () => {
    it(`should return a file object with only given HTMLInputElement mock`, () => {
        const _mockHtmlInput = ({
            value: 'test.com/image/test.jpg',
            nodeName: true
        } as unknown) as HTMLInputElement;
        const _test1 = new FileObject(_mockHtmlInput);
        expect(_test1.name).toBe('test.jpg');
        expect(_test1.type).toBe('like/jpg');
        expect(_test1.lastModifiedDate).toBeNull();
        expect(_test1.size).toBeNull();
    });

    it(`should return a file object with only given File mock with lastModified`, () => {
        const _time = Date.now();
        const _mockFile = ({
            lastModified: _time,
            size: 256,
            type: 'image/png',
            name: 'Test_Dummy-Image.png'
        } as unknown) as File;
        const _test1 = new FileObject(_mockFile);
        expect(_test1.name).toBe('Test_Dummy-Image.png');
        expect(_test1.type).toBe('image/png');
        expect(_test1.lastModifiedDate).toEqual(new Date(_time));
        expect(_test1.size).toBe(256);
    });

    it(`should return a file object with only given File mock with lastModifiedDate`, () => {
        const _time = new Date();
        const _mockFile = ({
            lastModifiedDate: _time,
            size: 256,
            type: 'image/png',
            name: 'Test_Dummy-Image.png'
        } as unknown) as File;
        const _test1 = new FileObject(_mockFile);
        expect(_test1.name).toBe('Test_Dummy-Image.png');
        expect(_test1.type).toBe('image/png');
        expect(_test1.lastModifiedDate).toEqual(_time);
        expect(_test1.size).toBe(256);
    });
});
