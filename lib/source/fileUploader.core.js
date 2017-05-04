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
var protocol_core_1 = require("./protocol.core");
var transfer_core_1 = require("./transfer.core");
var fileManager_core_1 = require("./fileManager.core");
// tslint:disable:max-line-length
var FileUploader = (function (_super) {
    __extends(FileUploader, _super);
    function FileUploader(_options, _protocol) {
        var _this = _super.call(this, 'FileUploader', _options) || this;
        _this._subs = [];
        if (typeof _protocol === 'undefined') {
            _this._setProtocol(new protocol_core_1.ProtocolXHR());
            var sub1 = _this._getProtocol()._progress.subscribe(function (obj) {
                var _file = obj._file, _data = obj._data;
                if (_file instanceof fileManager_core_1.FileManager) {
                    _this._onProgressFile(_file, _data.percent);
                    _this._onProgressFileSpeed(_file, _data);
                }
            }, function (error) {
                throw new Error(error);
            });
            _this._subs.push(sub1);
            var sub2 = _this._getProtocol()._load.subscribe(function (obj) {
                var _file = obj._file, response = obj.response, status = obj.status, headers = obj.headers;
                if (_file instanceof fileManager_core_1.FileManager) {
                    var uploader_1 = _file.getUploader();
                    var gist = _this._isSuccessCode(status);
                    var method = function (g, f, r, s, h) { if (g) {
                        uploader_1._onSuccessFile(f, r, s, h);
                    }
                    else {
                        uploader_1._onErrorFile(f, r, s, h);
                    } };
                    method(gist, _file, response, status, headers);
                    uploader_1._onCompleteFile(_file, response, status, headers);
                }
            }, function (error) {
                throw new Error(error);
            });
            _this._subs.push(sub2);
            var sub3 = _this._getProtocol()._error.subscribe(function (obj) {
                var _file = obj._file, response = obj.response, status = obj.status, headers = obj.headers;
                if (_file instanceof fileManager_core_1.FileManager) {
                    var uploader = _file.getUploader();
                    uploader._onErrorFile(_file, response, status, headers);
                    uploader._onCompleteFile(_file, response, status, headers);
                }
            }, function (error) {
                throw new Error(error);
            });
            _this._subs.push(sub3);
            var sub4 = _this._getProtocol()._abort.subscribe(function (obj) {
                var _file = obj._file, response = obj.response, status = obj.status, headers = obj.headers;
                if (_file instanceof fileManager_core_1.FileManager) {
                    var uploader = _file.getUploader();
                    uploader._onErrorFile(_file, response, status, headers);
                    uploader._onCompleteFile(_file, response, status, headers);
                }
            }, function (error) {
                throw new Error(error);
            });
            _this._subs.push(sub4);
        }
        return _this;
    }
    FileUploader.prototype.destroy = function () {
        for (var _i = 0, _a = this._subs; _i < _a.length; _i++) {
            var _sub = _a[_i];
            _sub.unsubscribe();
        }
        this._subs = [];
    };
    return FileUploader;
}(transfer_core_1.Transfer));
exports.FileUploader = FileUploader;
//# sourceMappingURL=fileUploader.core.js.map