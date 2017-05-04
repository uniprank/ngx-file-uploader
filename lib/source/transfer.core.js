"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Rx_1 = require("rxjs/Rx");
var utils_core_1 = require("./utils.core");
var fileManager_core_1 = require("./fileManager.core");
var uploaderHook_core_1 = require("./uploaderHook.core");
// tslint:disable:no-unused-expression
var TransferOptionsDefault = {
    url: '',
    alias: 'file',
    headers: {},
    filters: [],
    formData: [],
    autoUpload: false,
    method: 'POST',
    removeBySuccess: false,
    queueLimit: -1,
    enableCors: false,
    withCredentials: false,
    uniqueFiles: false
};
/**
 * An abstract class for the transport functionality
 *
 * @export
 * @abstract
 * @class Transfer
 */
var Transfer = (function () {
    /**
     * Creates an instance of Transfer.
     *
     * @param {string} type
     *
     * @memberOf Transfer
     */
    function Transfer(type, _options) {
        this.type = type;
        this._queue$ = new Rx_1.BehaviorSubject([]);
        var div = document.createElement('div');
        this._isHTML5 = !!(File && FormData && FileReader);
        this._isDragAndDrop = (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) ? true : false;
        this._id = utils_core_1.Utils.uniqueID();
        this._hooks = [];
        if (!this._isHTML5) {
            throw new Error("Your browser doesn't support HTML5. Our FileUploader can't work here.");
        }
        this.options = Object.assign({}, TransferOptionsDefault, _options);
    }
    Object.defineProperty(Transfer.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Transfer.prototype, "queue$", {
        get: function () {
            return utils_core_1.Utils.asObservable(this._queue$);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Transfer.prototype, "queueObs", {
        get: function () {
            return this._queue$.getValue();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Bind options to FileManager
     *
     * @param {FileManagerOptions} _options
     *
     * @memberOf FileManager
     */
    Transfer.prototype.bindOptions = function (_options) {
        this.options = Object.assign({}, this.options, _options);
    };
    /**
     * It gives HTML5 check back
     *
     * @returns {Boolean}
     *
     * @memberOf Transfer
     */
    Transfer.prototype.isHTML5 = function () {
        return this._isHTML5;
    };
    /**
     * It gives DragAndDrop check back
     *
     * @returns {Boolean}
     *
     * @memberOf Transfer
     */
    Transfer.prototype.isDragAndDrop = function () {
        return this._isDragAndDrop;
    };
    /**
     * To implement a hock
     *
     * @param {UploaderHook} hook
     *
     * @memberOf Transfer
     */
    Transfer.prototype.hook = function (_hook) {
        if (this.hookExists(_hook) === -1) {
            this._hooks.push(_hook);
            this._hooks.sort(function (a, b) {
                if (!(a.type) || !(b.type)) {
                    return 0;
                }
                if (a.type !== b.type) {
                    if (a.type < b.type) {
                        return -1;
                    }
                    if (a.type > b.type) {
                        return 1;
                    }
                    return 0;
                }
                else {
                    if (!(a.priority) || !(b.priority)) {
                        return 0;
                    }
                    if (a.priority > b.priority) {
                        return -1;
                    }
                    if (a.priority < b.priority) {
                        return 1;
                    }
                    return 0;
                }
            });
        }
    };
    /**
     *
     *
     * @param {UploaderHook} hook
     * @returns this
     *
     * @memberOf Transfer
     */
    Transfer.prototype.removeHook = function (_hook) {
        var key = this.hookExists(_hook);
        if (key >= 0) {
            this._hooks.splice(key, 1);
            return true;
        }
        return false;
    };
    Transfer.prototype.addFilesToQueue = function (_files, options) {
        var _retFiles = [];
        var _dummyFile;
        var _check = false;
        if (utils_core_1.Utils.isElement(_files)) {
            // If _files was not converted
            for (var _i = 0, _a = _files.files; _i < _a.length; _i++) {
                var _fileElement = _a[_i];
                try {
                    _dummyFile = new fileManager_core_1.FileManager(_fileElement, options, this);
                }
                catch (e) {
                    throw Error("Couldn't create a new FileManager object.");
                }
                _check = this.addFile(_dummyFile);
                (_check) && _retFiles.push(_dummyFile);
            }
        }
        else if (_files instanceof Object) {
            // If _files is an array of FileManger
            if ((typeof _files[0] !== 'undefined') && (_files[0] instanceof fileManager_core_1.FileManager)) {
                for (var _b = 0, _files_1 = _files; _b < _files_1.length; _b++) {
                    var _file = _files_1[_b];
                    _check = this.addFile(_file);
                    (_check) && _retFiles.push(_file);
                }
                // If _files is only a FileManger
            }
            else if (_files instanceof fileManager_core_1.FileManager) {
                _check = this.addFile(_files);
                (_check) && _retFiles.push(_files);
            }
            else {
                throw new Error("Couldn't put file/files to the queue. [" + _files + "]");
            }
        }
        else {
            throw new Error("Couldn't initialise FileUploader file/files are not defined. [" + _files + "]");
        }
        this._onAddFileAll();
        return _retFiles;
    };
    Transfer.prototype.addFile = function (_file) {
        try {
            this.validate(_file);
        }
        catch (e) {
            console.log(e.message);
            this._onAddFileError(_file);
            return false;
        }
        var queue = this._queue$.getValue();
        if (this.options.uniqueFiles) {
            if (this.notInQueue(_file) === -1) {
                this._runHook(uploaderHook_core_1.hookType.beforeAddingFile, _file);
                queue.push(_file);
                this._queue$.next(queue);
                this._onAddFile(_file);
                this._runHook(uploaderHook_core_1.hookType.afterAddingFile, _file);
                (this.options.autoUpload) && _file.upload();
                return true;
            }
        }
        else {
            this._runHook(uploaderHook_core_1.hookType.beforeAddingFile, _file);
            queue.push(_file);
            this._queue$.next(queue);
            this._onAddFile(_file);
            this._runHook(uploaderHook_core_1.hookType.afterAddingFile, _file);
            (this.options.autoUpload) && _file.upload();
            return true;
        }
        this._onAddFileError(_file);
        return false;
    };
    Transfer.prototype.removeFile = function (_file) {
        var key = this.notInQueue(_file);
        var queue = this._queue$.getValue();
        if (key >= 0) {
            queue.splice(key, 1);
            this._queue$.next(queue);
            return true;
        }
        return false;
    };
    Transfer.prototype.notInQueue = function (_file) {
        var queue = this._queue$.getValue();
        for (var key in queue) {
            if (queue.hasOwnProperty(key)) {
                var obj = queue[key];
                if ((obj.id === _file.id) ||
                    ((obj.name + obj.type + obj.size) ===
                        (_file.name + _file.type + _file.size))) {
                    return +key;
                }
            }
        }
        return -1;
    };
    Transfer.prototype.addFilter = function (_filter) {
        if (this.filterExists(_filter) !== -1) {
            this.options.filters.push(_filter);
        }
    };
    Transfer.prototype.validate = function (_file) {
        for (var _i = 0, _a = this.options.filters; _i < _a.length; _i++) {
            var _filter = _a[_i];
            if (!_filter.validate(_file)) {
                throw new Error("File [" + _file.name + "] doesn't fit with filter [" + _filter.name + "]");
            }
        }
        return true;
    };
    Transfer.prototype._setProtocol = function (_protocol) {
        this._protocol = _protocol;
    };
    Transfer.prototype._getProtocol = function () {
        return this._protocol;
    };
    /**
     * Validate response status code.
     *
     * @param {number} status
     * @returns {boolean}
     *
     * @memberOf Protocol
     */
    Transfer.prototype._isSuccessCode = function (status) {
        return (status >= 200 && status < 300) || status === 304;
    };
    /**
     * Upload functions
     */
    Transfer.prototype.upload = function () {
        this._onBeforeUploadAll();
        for (var _i = 0, _a = this.queueObs; _i < _a.length; _i++) {
            var _file = _a[_i];
            this.uploadItem(_file);
        }
    };
    Transfer.prototype.cancel = function () {
        for (var _i = 0, _a = this.queueObs; _i < _a.length; _i++) {
            var _file = _a[_i];
            this.cancelUploadItem(_file);
        }
    };
    Transfer.prototype.remove = function () {
        for (var _i = 0, _a = this.queueObs; _i < _a.length; _i++) {
            var _file = _a[_i];
            this.removeFile(_file);
        }
    };
    Transfer.prototype.uploadItem = function (item) {
        if (this.notInQueue(item) === -1) {
            this.addFile(item);
        }
        this._onBeforeUpload(item);
        this._getProtocol().run(item);
    };
    Transfer.prototype.cancelUploadItem = function (item) {
        if (this.notInQueue(item) === -1) {
            return;
        }
        (item.isUploading) && this._getProtocol().cancel(item);
        (item.isUploading) && item._cancel();
    };
    /**
     * Overwrite functions
     */
    Transfer.prototype.onAddFileAll = function (_uploader) { return; };
    Transfer.prototype.onAddFile = function (_file) { return; };
    Transfer.prototype.onAddFileError = function (_file) { return; };
    Transfer.prototype.onBeforeUploadAll = function (_uploader) { return; };
    Transfer.prototype.onBeforeUpload = function (_file) { return; };
    Transfer.prototype.onProgress = function (_uploader, _progress) { return; };
    Transfer.prototype.onProgressFile = function (_file, _progress) { return; };
    Transfer.prototype.onProgressFileSpeed = function (_file, _progress) { return; };
    Transfer.prototype.onSuccess = function (_file, _response, _status, _headers) { return; };
    Transfer.prototype.onError = function (_file, _response, _status, _headers) { return; };
    Transfer.prototype.onComplete = function (_file, _response, _status, _headers) { return; };
    Transfer.prototype.onCompleteAll = function (_uploader) { return; };
    ;
    /**
     * Internal functions
     */
    /**
     *
     *
     * @param {FileManager} _file
     * @param {number} _progress
     * @returns {void}
     *
     * @memberOf FileManager
     */
    Transfer.prototype._onAddFileAll = function () {
        this.onAddFileAll(this);
    };
    Transfer.prototype._onAddFile = function (_file) {
        this.onAddFile(_file);
    };
    Transfer.prototype._onAddFileError = function (_file) {
        this._runHook(uploaderHook_core_1.hookType.errorAddingFile, _file);
        this.onAddFileError(_file);
    };
    Transfer.prototype._onBeforeUploadAll = function () {
        this._runHook(uploaderHook_core_1.hookType.prepareUploadAll, this);
        this.onBeforeUploadAll(this);
    };
    Transfer.prototype._onBeforeUpload = function (_file) {
        this._runHook(uploaderHook_core_1.hookType.prepareUploadFile, _file);
        _file._onBeforeUpload();
        this.onBeforeUpload(_file);
    };
    Transfer.prototype._onProgressFileSpeed = function (_file, _speed) {
        this._runHook(uploaderHook_core_1.hookType.prepareUploadFile, _file, _speed);
        _file._onProgressFileSpeed(_speed);
        this.onProgressFileSpeed(_file, _speed);
    };
    Transfer.prototype._onProgressFile = function (_file, _progress) {
        _file._onProgress(_progress);
        this.onProgressFile(_file, _progress);
        this._onProgress();
    };
    Transfer.prototype._onProgress = function () {
        var queue = this._queue$.getValue();
        if (queue.length > 0) {
            var percent = 0;
            for (var _i = 0, queue_1 = queue; _i < queue_1.length; _i++) {
                var file = queue_1[_i];
                if (file.success || file.error) {
                    percent += 100;
                }
                else if (file.isUploading) {
                    percent += file.progress;
                }
            }
            percent = Math.floor(percent / queue.length);
            this._runHook(uploaderHook_core_1.hookType.progressUploadAll, percent);
            this.onProgress(this, percent);
            (percent >= 100) && this._onCompleteAll();
            return;
        }
        this.onProgress(this, 100);
        this._onCompleteAll();
    };
    Transfer.prototype._onSuccessFile = function (_file, response, status, headers) {
        this._runHook(uploaderHook_core_1.hookType.successUploadFile, _file, response, status, headers);
        _file._onSuccess(response, status, headers);
        this.onSuccess(_file, response, status, headers);
    };
    Transfer.prototype._onErrorFile = function (_file, response, status, headers) {
        this._runHook(uploaderHook_core_1.hookType.failedUploadFile, _file, response, status, headers);
        this.onError(_file, response, status, headers);
    };
    Transfer.prototype._onCompleteFile = function (_file, response, status, headers) {
        this._runHook(uploaderHook_core_1.hookType.completeUploadFile, _file, response, status, headers);
        this._onProgress();
        this.onComplete(_file, response, status, headers);
    };
    Transfer.prototype._onCompleteAll = function () {
        this._runHook(uploaderHook_core_1.hookType.completeUploadAll, this);
        this.onCompleteAll(this);
    };
    Transfer.prototype._headersGetter = function (parsedHeaders) {
        return function (name) {
            if (name) {
                return parsedHeaders[name.toLowerCase()] || null;
            }
            return parsedHeaders;
        };
    };
    Transfer.prototype._parseHeaders = function (headers) {
        var parsed = {};
        var key, val, i;
        if (!headers) {
            return parsed;
        }
        var incomeHeaders = headers.split('\n');
        for (var _i = 0, incomeHeaders_1 = incomeHeaders; _i < incomeHeaders_1.length; _i++) {
            var line = incomeHeaders_1[_i];
            i = line.indexOf(':');
            key = line.slice(0, i).trim().toLowerCase();
            val = line.slice(i + 1).trim();
            if (key) {
                parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
            }
        }
        return parsed;
    };
    Transfer.prototype._transformResponse = function (response, headers) {
        headers = {};
        return response;
    };
    Transfer.prototype._runHook = function (type) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        for (var key in this._hooks) {
            if (this._hooks.hasOwnProperty(key)) {
                var obj = this._hooks[key];
                if (obj.type === type) {
                    switch (type) {
                        case uploaderHook_core_1.hookType.beforeAddingFile:
                        case uploaderHook_core_1.hookType.prepareUploadAll:
                        case uploaderHook_core_1.hookType.prepareUploadFile:
                        case uploaderHook_core_1.hookType.afterAddingFile:
                        case uploaderHook_core_1.hookType.errorAddingFile:
                        case uploaderHook_core_1.hookType.completeUploadAll:
                        case uploaderHook_core_1.hookType.progressUploadAll:
                            {
                                obj.callback(args[0]);
                            }
                            break;
                        case uploaderHook_core_1.hookType.progressUploadFile:
                            {
                                obj.callback(args[0], args[1]);
                            }
                            break;
                        case uploaderHook_core_1.hookType.cancelUploadFile:
                        case uploaderHook_core_1.hookType.successUploadFile:
                        case uploaderHook_core_1.hookType.failedUploadFile:
                        case uploaderHook_core_1.hookType.completeUploadFile:
                            {
                                obj.callback(args[0], args[1], args[2], args[3]);
                            }
                            break;
                        default: {
                            throw new Error("hookType unknown or not defined");
                        }
                    }
                }
            }
        }
    };
    /**
     *
     *
     * @private
     * @param {UploaderHook} hook
     * @returns {Boolean}
     *
     * @memberOf Transfer
     */
    Transfer.prototype.hookExists = function (hook) {
        for (var key in this._hooks) {
            if (this._hooks.hasOwnProperty(key)) {
                var obj = this._hooks[key];
                if ((obj.type === hook.type) && ('' + obj.callback === '' + hook.callback)) {
                    return +key;
                }
            }
        }
        return -1;
    };
    Transfer.prototype.filterExists = function (_filter) {
        var filters = this.options.filters;
        for (var key in filters) {
            if (filters.hasOwnProperty(key)) {
                var obj = filters[key];
                if (obj.name === _filter.name) {
                    return +key;
                }
            }
        }
        return -1;
    };
    return Transfer;
}());
exports.Transfer = Transfer;
//# sourceMappingURL=transfer.core.js.map