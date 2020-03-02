import { Utils } from './utils.class';

export class FileObject {
    lastModifiedDate: Date | null;
    size: number | null;
    type: string;
    name: string;

    constructor(fileOrInput: any) {
        const isInput = Utils.isElement(fileOrInput);
        const fakePathOrObject = isInput ? fileOrInput.value : fileOrInput;
        const isFakePath = Utils.isString(fakePathOrObject) ? true : false;
        const method = (v: boolean, x: any) => {
            if (v) {
                this._createFromFakePath(x);
            } else {
                this._createFromObject(x);
            }
        };
        method(isFakePath, fakePathOrObject);
    }

    private _createFromFakePath(path: string) {
        this.lastModifiedDate = null;
        this.size = null;
        this.type = 'like/' + path.slice(path.lastIndexOf('.') + 1).toLowerCase();
        this.name = path.slice(path.lastIndexOf('/') + path.lastIndexOf('\\') + 2);
    }

    private _createFromObject(object: any) {
        this.lastModifiedDate = new Date(object.lastModifiedDate.getTime());
        this.size = object.size;
        this.type = object.type;
        this.name = object.name;
    }
}
