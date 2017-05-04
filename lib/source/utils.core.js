"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = require("rxjs/Observable");
var Utils = (function () {
    function Utils() {
    }
    /**
     * Creates a unique id for submit form.
     *
     * @static
     * @returns
     *
     * @memberOf utils
     */
    Utils.uniqueID = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            // tslint:disable-next-line:no-bitwise
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    /**
     * Validate input and returns true if input is an element
     *
     * @static
     * @param {*} _input
     * @returns {boolean} True if `value` is a DOM element (or wrapped jQuery element).
     *
     * @memberOf FileManager
     */
    Utils.isElement = function (_input) {
        return !!(_input &&
            (_input.nodeName ||
                (_input.prop && _input.attr && _input.find))); // We have an on and find methode part of jQuery API
    };
    /**
     * Validate input and returns true if input is a string
     *
     * @static
     * @param {*} _input
     * @returns {boolean}
     *
     * @memberOf Utils
     */
    Utils.isString = function (_input) {
        return !!(typeof _input === 'string');
    };
    Utils.extendValue = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _value = args[0];
        for (var i = 1; i < args.length; i++) {
            if (typeof args[i] !== 'undefined') {
                _value = args[i];
            }
        }
        return _value;
    };
    Utils.asObservable = function (subject) {
        return new Observable_1.Observable(function (fn) { return subject.subscribe(fn); });
    };
    return Utils;
}());
Utils._uniqueNumber = 1;
Utils.nextUID = function () { return (Utils._uniqueNumber++).toString(); };
exports.Utils = Utils;
//# sourceMappingURL=utils.core.js.map