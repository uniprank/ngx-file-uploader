"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var hookType;
(function (hookType) {
    hookType[hookType["beforeAddingFile"] = 0] = "beforeAddingFile";
    hookType[hookType["afterAddingFile"] = 1] = "afterAddingFile";
    hookType[hookType["errorAddingFile"] = 2] = "errorAddingFile";
    hookType[hookType["prepareUploadFile"] = 3] = "prepareUploadFile";
    hookType[hookType["progressUploadFile"] = 4] = "progressUploadFile";
    hookType[hookType["successUploadFile"] = 5] = "successUploadFile";
    hookType[hookType["completeUploadFile"] = 6] = "completeUploadFile";
    hookType[hookType["failedUploadFile"] = 7] = "failedUploadFile";
    hookType[hookType["cancelUploadFile"] = 8] = "cancelUploadFile";
    hookType[hookType["prepareUploadAll"] = 9] = "prepareUploadAll";
    hookType[hookType["progressUploadAll"] = 10] = "progressUploadAll";
    hookType[hookType["completeUploadAll"] = 11] = "completeUploadAll";
})(hookType = exports.hookType || (exports.hookType = {}));
var UploaderHook = (function () {
    function UploaderHook(_hookType, _callback, _priority) {
        if (_priority === void 0) { _priority = 0; }
        this._type = null;
        this._callback = null;
        this._priority = null;
        this._type = _hookType;
        this._callback = _callback;
        this._priority = +_priority;
    }
    Object.defineProperty(UploaderHook.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UploaderHook.prototype, "priority", {
        get: function () {
            return this._priority;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UploaderHook.prototype, "callback", {
        get: function () {
            return this._callback;
        },
        enumerable: true,
        configurable: true
    });
    return UploaderHook;
}());
exports.UploaderHook = UploaderHook;
//# sourceMappingURL=uploaderHook.core.js.map