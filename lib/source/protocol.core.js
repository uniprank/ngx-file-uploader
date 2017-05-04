"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var utils_core_1 = require("./utils.core");
var fileSizePipe_pipe_1 = require("../pipe/fileSizePipe.pipe");
// tslint:disable:max-line-length
var FormData = window.FormData;
/**
 * Absractr proctol class if someone want to write his own protocol
 *
 * @export
 * @abstract
 * @class Protocol
 */
var Protocol = (function () {
    /**
     * Creates an instance of Protocol and for each protocol an own unique ID.
     *
     *
     * @memberOf Protocol
     */
    function Protocol() {
        this._id = utils_core_1.Utils.uniqueID();
        this._progress = new core_1.EventEmitter();
        this._load = new core_1.EventEmitter();
        this._error = new core_1.EventEmitter();
        this._abort = new core_1.EventEmitter();
        this._connections = [];
    }
    Object.defineProperty(Protocol.prototype, "connection", {
        set: function (obj) {
            var _file = obj._file, _connection = obj._connection;
            if (!this.isConnected(_file)) {
                this._connections.push({
                    id: _file.id,
                    connection: _connection
                });
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Call uploader method _onCompleteFile.
     *
     * @param {FileManager} _file
     * @param {any} response
     * @param {any} status
     * @param {any} headers
     *
     * @memberOf Protocol
     */
    Protocol.prototype._onLoad = function (_file, response, status, headers) {
        var uploader = _file.getUploader();
        var gist = this._isSuccessCode(status);
        var method = function (g, f, r, s, h) { if (g) {
            uploader._onSuccessFile(f, r, s, h);
        }
        else {
            uploader._onErrorFile(f, r, s, h);
        } };
        method(gist, _file, response, status, headers);
        uploader._onCompleteFile(_file, response, status, headers);
    };
    /**
     * Call uploader methodes _onErrorFile and _onCompleteFile.
     *
     * @param {FileManager} _file
     * @param {any} response
     * @param {any} status
     * @param {any} headers
     *
     * @memberOf Protocol
     */
    Protocol.prototype._onError = function (_file, response, status, headers) {
        var uploader = _file.getUploader();
        uploader._onErrorFile(_file, response, status, headers);
        uploader._onCompleteFile(_file, response, status, headers);
    };
    /**
     * Call uploader methodes _onErrorFile and _onCompleteFile.
     *
     * @param {FileManager} _file
     * @param {any} response
     * @param {any} status
     * @param {any} headers
     *
     * @memberOf Protocol
     */
    Protocol.prototype._onAbort = function (_file, response, status, headers) {
        var uploader = _file.getUploader();
        uploader._onErrorFile(_file, response, status, headers);
        uploader._onCompleteFile(_file, response, status, headers);
    };
    /**
     * Validate response status code.
     *
     * @param {number} status
     * @returns {boolean}
     *
     * @memberOf Protocol
     */
    Protocol.prototype._isSuccessCode = function (status) {
        return (status >= 200 && status < 300) || status === 304;
    };
    Protocol.prototype.isConnected = function (_file) {
        for (var _i = 0, _a = this._connections; _i < _a.length; _i++) {
            var _request = _a[_i];
            if (_request.id === _file.id) {
                return _request;
            }
        }
        return false;
    };
    Protocol.prototype.removeConnection = function (_file) {
        var _request = null;
        for (var _key in this._connections) {
            if (this._connections.hasOwnProperty(_key)) {
                _request = this._connections[_key];
                if (_file.id === _request.id) {
                    this._connections.splice(+_key, 1);
                }
            }
        }
    };
    return Protocol;
}());
exports.Protocol = Protocol;
/**
 * Standard protocol for server communication (file uploading)
 *
 * @export
 * @class ProtocolXHR
 * @extends {Protocol}
 */
var ProtocolXHR = (function (_super) {
    __extends(ProtocolXHR, _super);
    function ProtocolXHR() {
        return _super.call(this) || this;
    }
    /**
     * Implementation of the abstract.protocol method `run`
     *
     * @param {FileManager} _file
     *
     * @memberOf ProtocolXHR
     */
    ProtocolXHR.prototype.run = function (_file) {
        var _this = this;
        var _xhr;
        var sendable;
        var uploader = _file.getUploader();
        var _formData = utils_core_1.Utils.extendValue(uploader.options.formData, _file.options.formData);
        var _withCredentials = utils_core_1.Utils.extendValue(uploader.options.withCredentials, _file.options.withCredentials);
        var _method = utils_core_1.Utils.extendValue(uploader.options.method, _file.options.method);
        var _url = utils_core_1.Utils.extendValue(uploader.options.url, _file.options.url);
        var _alias = utils_core_1.Utils.extendValue(uploader.options.alias, _file.options.alias);
        var _headers = utils_core_1.Utils.extendValue(uploader.options.headers, _file.options.headers);
        var time = new Date().getTime();
        var load = 0;
        var speed = 0;
        var sppedToText = null;
        var $filesize = new fileSizePipe_pipe_1.FileSizePipe();
        _xhr = new XMLHttpRequest();
        this.connection = {
            _file: _file,
            _connection: _xhr
        };
        sendable = new FormData();
        if (typeof _formData !== 'undefined') {
            // Only allow Multipart
            for (var _i = 0, _formData_1 = _formData; _i < _formData_1.length; _i++) {
                var obj = _formData_1[_i];
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        var value = obj[key];
                        sendable.append(key, value);
                    }
                }
            }
        }
        sendable.append(_alias, _file.element, _file.name);
        if (typeof (_file.size) !== 'number') {
            throw new TypeError('We need the file size.');
        }
        _xhr.upload.addEventListener('progress', function (event) {
            if (event.lengthComputable) {
                var _time = new Date().getTime() - time;
                load = event.loaded - load;
                speed = load / _time * 1000;
                speed = parseInt(speed, 10);
                sppedToText = $filesize.transform(speed);
                var _obj = {
                    total: event.total,
                    loaded: event.loaded,
                    percent: Math.round(event.loaded / event.total * 100),
                    speed: speed,
                    speedToText: sppedToText
                };
                _this._progress.emit({ _file: _file, _data: _obj });
            }
        });
        _xhr.addEventListener('load', function () {
            var headers = uploader._parseHeaders(_xhr.getAllResponseHeaders());
            var response = uploader._transformResponse(_xhr.response, headers);
            console.log('File upload done');
            var status = _xhr.status;
            _this._load.emit({ _file: _file, response: response, status: status, headers: headers });
        });
        _xhr.addEventListener('error', function () {
            var headers = uploader._parseHeaders(_xhr.getAllResponseHeaders());
            var response = uploader._transformResponse(_xhr.response, headers);
            console.log('File upload error');
            var status = _xhr.status;
            _this._error.emit({ _file: _file, response: response, status: status, headers: headers });
        });
        _xhr.addEventListener('abort', function () {
            var headers = uploader._parseHeaders(_xhr.getAllResponseHeaders());
            var response = uploader._transformResponse(_xhr.response, headers);
            console.log('File upload abort');
            var status = _xhr.status;
            _this._abort.emit({ _file: _file, response: response, status: status, headers: headers });
        });
        _xhr.open(_method, _url, true);
        _xhr.withCredentials = _withCredentials;
        for (var name_1 in _headers) {
            if (_headers.hasOwnProperty(name_1)) {
                var value = _headers[name_1];
                _xhr.setRequestHeader(name_1, value);
            }
        }
        _xhr.send(sendable);
    };
    ProtocolXHR.prototype.cancel = function (_file) {
        var _request = this.isConnected(_file);
        if (!!_request) {
            _request.connection.abort();
            this.removeConnection(_file);
        }
    };
    return ProtocolXHR;
}(Protocol));
exports.ProtocolXHR = ProtocolXHR;
//# sourceMappingURL=protocol.core.js.map