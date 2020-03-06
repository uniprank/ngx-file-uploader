import { DatePipe } from '@angular/common';
import { FileManagerInterface } from '../interfaces/file-manager.interface';

export enum filterType {
    regex = 'regex',
    callback = 'callback'
}

export type fileRegExpType = 'name' | 'type' | 'date';

export class FileFilter {
    public get name(): string {
        return this._name;
    }

    public get type(): filterType | null {
        return this._type;
    }

    private _name = '';
    private _regex: RegExp | null = null;
    private _regCheck: string | null = null;
    private _callback: (file: FileManagerInterface) => boolean | null = null;
    private _type: filterType | null = null;

    constructor(name: string, _data: RegExp | ((file: FileManagerInterface) => boolean), _regCheck: fileRegExpType = 'name') {
        this._name = name;
        if (_data instanceof RegExp) {
            this._type = filterType.regex;
            this._regex = _data;
            this._regCheck = _regCheck;
            return;
        } else if (_data instanceof Function) {
            this._type = filterType.callback;
            this._callback = _data;
            return;
        }
        throw new Error('FilterData is not defined.');
    }

    public validate(file: FileManagerInterface): boolean {
        let _valid = false;
        if (this._type === filterType.regex) {
            return this._regexpCheck(file);
        } else if (this._type === filterType.callback) {
            _valid = (<(file: FileManagerInterface) => boolean>this._callback)(file);
        } else {
            throw new Error('Filter type is not defined.');
        }
        return _valid;
    }

    private _regexpCheck(file: FileManagerInterface): boolean {
        let _valid = false;
        switch (this._regCheck) {
            case 'name':
                _valid = file.object.name.match(<RegExp>this._regex) != null;
                break;

            case 'type':
                _valid = file.object.type.match(<RegExp>this._regex) != null;
                break;

            case 'date':
                // Format for validation is `2017-01-01 10:10:10`
                const _checkDate: string | null = new DatePipe('en-US').transform(file.object.lastModifiedDate, 'yyyy-MM-dd hh:mm:ss');
                if (_checkDate && _checkDate.match(<RegExp>this._regex)) {
                    _valid = true;
                }
                break;

            default: {
                throw new Error('RegExp can only check on `name | type | date`.');
            }
        }
        return _valid;
    }
}
