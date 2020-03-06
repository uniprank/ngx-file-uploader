import { Utils } from '../utils.class';

describe('Utils', () => {
    it(`should return nextUID to not be 0`, () => {
        expect(Utils.nextUID()).not.toBe('0');
    });

    it(`should return a valid guid`, () => {
        expect(
            Utils.uniqueID().match(new RegExp(/^[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-4[a-zA-Z0-9]{3}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}/))
        ).not.toBe(null);
    });

    it(`should return a true for isElement`, () => {
        expect(Utils.isElement(document.createElement('div'))).toBeTruthy();
    });

    it(`should return a false for isElement`, () => {
        expect(Utils.isElement({ test: 'test' })).toBeFalsy();
    });

    it(`should return a true for isString`, () => {
        expect(Utils.isString('This should work')).toBeTruthy();
    });

    it(`should return a false for isString`, () => {
        expect(Utils.isString(1244)).toBeFalsy();
    });

    it(`should return the last input 'test3'`, () => {
        expect(Utils.extendValue('test', undefined, 'test2', 'test3')).toBe('test3');
    });
});
