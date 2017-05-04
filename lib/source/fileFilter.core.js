"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@angular/common");
var filterType;
(function (filterType) {
    filterType[filterType["regex"] = 0] = "regex";
    filterType[filterType["callback"] = 1] = "callback";
})(filterType = exports.filterType || (exports.filterType = {}));
var FileFilter = (function () {
    function FileFilter(name, _data, _regCheck) {
        if (_regCheck === void 0) { _regCheck = 'name'; }
        this._name = '';
        this._regex = null;
        this._regCheck = null;
        this._callback = null;
        this._type = null;
        this._name = name;
        if (_data instanceof RegExp) {
            this._type = filterType.regex;
            this._regex = _data;
            this._regCheck = _regCheck;
            return;
        }
        else if (_data instanceof Function) {
            this._type = filterType.callback;
            this._callback = _data;
            return;
        }
        throw new Error('FilterData is not defined.');
    }
    Object.defineProperty(FileFilter.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FileFilter.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    FileFilter.prototype.validate = function (_file) {
        var _valid = false;
        switch (this._type) {
            case filterType.regex:
                {
                    switch (this._regCheck) {
                        case 'name':
                            {
                                if (_file.object.name.match(this._regex)) {
                                    _valid = true;
                                }
                            }
                            break;
                        case 'type':
                            {
                                if (_file.object.type.match(this._regex)) {
                                    _valid = true;
                                }
                            }
                            break;
                        case 'size':
                            {
                                if (_file.object.size.match(this._regex)) {
                                    _valid = true;
                                }
                            }
                            break;
                        case 'date':
                            {
                                // Format for validation is `2017-01-01 10:10:10`
                                // tslint:disable-next-line:max-line-length
                                var _checkDate = new common_1.DatePipe('en-US').transform(_file.object.lastModifiedDate, 'yyyy-MM-dd hh:mm:ss');
                                if (_checkDate && _checkDate.match(this._regex)) {
                                    _valid = true;
                                }
                            }
                            break;
                        default: {
                            throw new Error('RegExp can only check on `name | type | size | date`.');
                        }
                    }
                }
                break;
            case filterType.callback:
                {
                    _valid = this._callback(_file);
                }
                break;
            default: {
                throw new Error('Filter type is not defined.');
            }
        }
        return _valid;
    };
    return FileFilter;
}());
exports.FileFilter = FileFilter;
//# sourceMappingURL=fileFilter.core.js.map