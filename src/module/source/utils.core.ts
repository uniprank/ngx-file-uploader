import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

export class Utils {
    static _uniqueNumber: number = 1;

    static nextUID = (): string => (Utils._uniqueNumber++).toString();
    /**
     * Creates a unique id for submit form.
     * 
     * @static
     * @returns
     * 
     * @memberOf utils
     */
    static uniqueID () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            // tslint:disable-next-line:no-bitwise
            let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    /**
     * Validate input and returns true if input is an element
     * 
     * @static
     * @param {*} _input
     * @returns {boolean} True if `value` is a DOM element (or wrapped jQuery element).
     * 
     * @memberOf FileManager
     */
    static isElement (_input: any) {
        return !!( _input &&
        ( _input.nodeName || // we are a direct element
        (_input.prop && _input.attr && _input.find) ) ); // We have an on and find methode part of jQuery API
    }

    /**
     * Validate input and returns true if input is a string
     * 
     * @static
     * @param {*} _input
     * @returns {boolean}
     * 
     * @memberOf Utils
     */
    static isString (_input: any) {
        return !!(typeof _input === 'string');
    }

    static extendValue (...args: any[]) {
        let _value: any = args[0];
        for (let i = 1; i < args.length; i++) {
            if (typeof args[i] !== 'undefined') {
                _value = args[i];
            }
        }
        return _value;
    }

    static asObservable (subject: Subject<any>) {
        return new Observable((fn: any) => subject.subscribe(fn));
    }
}
