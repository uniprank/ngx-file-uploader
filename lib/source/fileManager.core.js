"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Rx_1 = require("rxjs/Rx");
var utils_core_1 = require("./utils.core");
var transfer_core_1 = require("./transfer.core");
// tslint:disable:no-unused-expression
var FileManagerOptionsDefault = {};
var speedObject = {
    total: 0,
    loaded: 0,
    percent: 0,
    speed: 0,
    speedToText: '0 bytes'
};
var FileObject = (function () {
    function FileObject(fileOrInput) {
        var _this = this;
        var isInput = utils_core_1.Utils.isElement(fileOrInput);
        var fakePathOrObject = isInput ? fileOrInput.value : fileOrInput;
        var isFakePath = utils_core_1.Utils.isString(fakePathOrObject) ? true : false;
        var method = function (v, x) { if (v) {
            _this._createFromFakePath(x);
        }
        else {
            _this._createFromObject(x);
        } };
        method(isFakePath, fakePathOrObject);
    }
    FileObject.prototype._createFromFakePath = function (path) {
        this.lastModifiedDate = null;
        this.size = null;
        this.type = 'like/' + path.slice(path.lastIndexOf('.') + 1).toLowerCase();
        this.name = path.slice(path.lastIndexOf('/') + path.lastIndexOf('\\') + 2);
    };
    FileObject.prototype._createFromObject = function (object) {
        this.lastModifiedDate = new Date(object.lastModifiedDate.getTime());
        this.size = object.size;
        this.type = object.type;
        this.name = object.name;
    };
    return FileObject;
}());
exports.FileObject = FileObject;
var FileManager = (function () {
    /**
     * Creates an instance of FileManager.
     *
     * @param {*} _file
     * @param {Transfer} [_uploader]
     * @param {FileManagerOptions} [_options]
     *
     * @memberOf FileManager
     */
    function FileManager(_file, _options, _uploader) {
        this._progress$ = new Rx_1.BehaviorSubject(0);
        this._speed$ = new Rx_1.BehaviorSubject(speedObject);
        this.options = Object.assign({}, FileManagerOptionsDefault, _options);
        this._speedDefault = {};
        this._id = utils_core_1.Utils.uniqueID();
        this._isUploading = false;
        this._isUploaded = false;
        this._isSuccess = false;
        this._isCancel = false;
        this._isError = false;
        var isInput = utils_core_1.Utils.isElement(_file);
        var file = isInput ? new FileObject(_file.files[0]) : new FileObject(_file);
        this._file = file;
        this._fileElement = isInput ? _file.files[0] : _file;
        this._fileActive = false;
        if (typeof _uploader !== 'undefined') {
            this.bindUploader(_uploader);
        }
    }
    Object.defineProperty(FileManager.prototype, "protocol", {
        set: function (_protocol) {
            this._protocol = _protocol;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FileManager.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FileManager.prototype, "progressPercent$", {
        get: function () {
            return utils_core_1.Utils.asObservable(this._progress$);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FileManager.prototype, "progress$", {
        get: function () {
            return utils_core_1.Utils.asObservable(this._speed$);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FileManager.prototype, "progress", {
        get: function () {
            return this._progress$.getValue();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FileManager.prototype, "element", {
        get: function () {
            return this._fileElement;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FileManager.prototype, "object", {
        get: function () {
            return this._file;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FileManager.prototype, "name", {
        get: function () {
            return this._file.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FileManager.prototype, "type", {
        get: function () {
            return this._file.type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FileManager.prototype, "date", {
        get: function () {
            return this._file.lastModifiedDate;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FileManager.prototype, "size", {
        get: function () {
            return this._file.size;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FileManager.prototype, "inQueue", {
        get: function () {
            return this._fileActive;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FileManager.prototype, "success", {
        get: function () {
            return this._isSuccess;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FileManager.prototype, "error", {
        get: function () {
            return this._isError;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Bind uploader to FileManager
     *
     * @param {Transfer} _uploader
     *
     * @memberOf FileManager
     */
    FileManager.prototype.bindUploader = function (_uploader) {
        if (this._uploader instanceof transfer_core_1.Transfer) {
            this._uploader.removeFile(this);
        }
        this._uploader = _uploader;
        var check = this._uploader.addFile(this);
        this._setFileActive(check);
    };
    /**
     * Bind options to FileManager
     *
     * @param {FileManagerOptions} _options
     *
     * @memberOf FileManager
     */
    FileManager.prototype.bindOptions = function (_options) {
        this.options = Object.assign({}, this.options, _options);
    };
    /**
     * Return uploader if exists else throw error
     *
     * @returns {Transfer}
     *
     * @memberOf FileManager
     */
    FileManager.prototype.getUploader = function () {
        if (this._uploader instanceof transfer_core_1.Transfer) {
            return this._uploader;
        }
        throw new Error('Not uploader for this file defined.');
    };
    /**
     * Start uploading this file
     *
     *
     * @memberOf FileManager
     */
    FileManager.prototype.upload = function () {
        var _uploader;
        try {
            _uploader = this.getUploader();
        }
        catch (e) {
            throw new Error('Couldn`t upload because uploader was not defined. ERR_MSG: ' + e.message);
        }
        this._isUploading = true;
        try {
            _uploader.uploadItem(this);
        }
        catch (e) {
            // TODO write error handling
        }
    };
    /**
     * Cancel upload process from this file
     *
     *
     * @memberOf FileManager
     */
    FileManager.prototype.cancel = function () {
        if (this._isUploading) {
            var uploader = this.getUploader();
            uploader.cancelUploadItem(this);
        }
    };
    FileManager.prototype._cancel = function () {
        if (this._isUploading) {
            this._isCancel = true;
            this._isUploaded = false;
            this._isUploading = false;
        }
    };
    /**
     * Remove this FileManger from uploader queue
     *
     *
     * @memberOf FileManager
     */
    FileManager.prototype.remove = function () {
        var _uploader;
        try {
            _uploader = this.getUploader();
        }
        catch (e) {
            throw new Error('Couldn`t remove because uploader was not defined. ERR_MSG: ' + e.message);
        }
        (this._isUploading) && this.cancel();
        _uploader.removeFile(this);
        this._setFileActive(false);
    };
    FileManager.prototype.isUploaded = function () {
        return this._isUploaded;
    };
    FileManager.prototype.isUploading = function () {
        return this._isUploading;
    };
    FileManager.prototype.canUpload = function () {
        return (!this._isUploaded && !this._isUploading && !this._isSuccess && !this._isError);
    };
    FileManager.prototype.handleImageLoad = function () {
        this._imageLoad = true;
    };
    /**
     * Overwrite functions
     */
    /**
     * Callback
     * @private
     */
    FileManager.prototype.onBeforeUpload = function () { return; };
    FileManager.prototype.onProgressSpeed = function (speed) { speed = speed; };
    /**
     * Callback
     * @param {Number} progress
     * @private
     */
    FileManager.prototype.onProgress = function (progress) { progress = progress; };
    /**
     * Callback
     * @param {any} response
     * @param {Number} status
     * @param {Object} headers
     */
    FileManager.prototype.onSuccess = function (response, status, headers) { response = response; status = status; headers = headers; };
    FileManager.prototype.onError = function (response, status, headers) { response = response; status = status; headers = headers; };
    /**
     *  Internal functions
     */
    FileManager.prototype._onBeforeUpload = function () {
        this._isUploading = true;
        this._isUploaded = false;
        this._isSuccess = false;
        this._isCancel = false;
        this._isError = false;
        this._progress$.next(0);
        this.onBeforeUpload();
    };
    FileManager.prototype._onProgressFileSpeed = function (speed) {
        this._speed$.next(speed);
        this.onProgressSpeed(speed);
    };
    FileManager.prototype._onProgress = function (_progress) {
        this._progress$.next(_progress);
        this.onProgress(_progress);
    };
    FileManager.prototype._onSuccess = function (response, status, headers) {
        if (this._uploader.options.removeBySuccess) {
            this.remove();
        }
        this._isUploading = false;
        this._isUploaded = true;
        this._isSuccess = true;
        this._isError = false;
        this.onSuccess(response, status, headers);
    };
    FileManager.prototype._onError = function (response, status, headers) {
        this._isUploading = false;
        this._isUploaded = false;
        this._isSuccess = false;
        this._isError = true;
        this.onError(response, status, headers);
    };
    FileManager.prototype._setFileActive = function (check) {
        this._fileActive = check;
    };
    return FileManager;
}());
exports.FileManager = FileManager;
//# sourceMappingURL=fileManager.core.js.map