import { FileSizePipe } from '../file-size.pipe';

describe('FilterByPropertyPipe', () => {
    let pipe: FileSizePipe;
    beforeEach(() => {
        pipe = new FileSizePipe();
    });

    it(`should return the correct file size of 24.50 MB`, () => {
        expect(pipe.transform(25690112)).toBe('24.50 MB');
    });

    it(`should return ? because isFinite: 1000 / 0`, () => {
        expect(pipe.transform(1000 / 0)).toBe('?');
    });
});
