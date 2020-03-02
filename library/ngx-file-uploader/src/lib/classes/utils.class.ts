// @dynamic
export class Utils {
    static _uniqueNumber = 1;

    static nextUID = (): string => (Utils._uniqueNumber++).toString();
    /**
     * Creates a unique id for submit form.
     *
     * @returns string
     *
     * @memberOf utils
     */
    static uniqueID(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            // tslint:disable-next-line:no-bitwise
            const r = (Math.random() * 16) | 0,
                v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    /**
     * Validate input and returns true if input is an element
     *
     * @param input any
     * @returns True if `value` is a DOM element (or wrapped jQuery element).
     *
     * @memberOf FileManager
     */
    static isElement(input: any) {
        return !!(
            input &&
            (input.nodeName || // we are a direct element
                (input.prop && input.attr && input.find))
        ); // We have an on and find methode part of jQuery API
    }

    /**
     * Validate input and returns true if input is a string
     *
     * @param input any
     * @returns boolean
     *
     * @memberOf Utils
     */
    static isString(input: any) {
        return !!(typeof input === 'string');
    }

    static extendValue(...args: any[]) {
        let _value: any = args[0];
        for (let i = 1; i < args.length; i++) {
            if (typeof args[i] !== 'undefined') {
                _value = args[i];
            }
        }
        return _value;
    }
}
