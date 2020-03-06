import { DatePipe } from '@angular/common';

import { FileFilter } from '../file-filter.class';
import { FileManagerInterface } from '../../interfaces/file-manager.interface';
import { FileObject } from '../file-object.class';

describe('FileFilter', () => {
    const fileObject = {
        lastModifiedDate: new Date(),
        size: 5242886,
        type: 'image/jpeg',
        name: 'Test-File-Name'
    } as FileObject;

    it(`should return the correct name 'Test' and type 'name'`, () => {
        const _test1 = new FileFilter('Test', new RegExp(/^Test.*/), 'name');
        expect(_test1.name).toBe('Test');
        expect(_test1.type).toBe('regex');
    });

    describe('with type RegExp', () => {
        it(`should validate against type 'name'`, () => {
            const _fileFilterName = new FileFilter('Name', new RegExp(/^Test-.*/g), 'name');
            expect(_fileFilterName.validate(({ object: fileObject } as unknown) as FileManagerInterface)).toBeTruthy();
        });
        it(`should validate against type 'type'`, () => {
            const _fileFilterType = new FileFilter('Name', new RegExp('image/jpeg|image/png|image/gif'), 'type');
            expect(_fileFilterType.validate(({ object: fileObject } as unknown) as FileManagerInterface)).toBeTruthy();
        });
        it(`should validate against type 'date'`, () => {
            const _checkDate: string | null = new DatePipe('en-US').transform(new Date(), 'yyyy-MM');
            const _fileFilterDate = new FileFilter('Name', new RegExp(`^${_checkDate}`), 'date');
            expect(_fileFilterDate.validate(({ object: fileObject } as unknown) as FileManagerInterface)).toBeTruthy();
        });
    });
    describe('with type function', () => {
        it(`should validate against the given callback function return true`, () => {
            const _fileFilterCallback = new FileFilter('callback', (file: FileManagerInterface) => {
                return true;
            });
            expect(_fileFilterCallback.validate(({ object: fileObject } as unknown) as FileManagerInterface)).toBeTruthy();
        });
        it(`should validate against the given callback function return false`, () => {
            const _fileFilterCallback = new FileFilter('callback', (file: FileManagerInterface) => {
                return false;
            });
            expect(_fileFilterCallback.validate(({ object: fileObject } as unknown) as FileManagerInterface)).toBeFalsy();
        });
    });
});
