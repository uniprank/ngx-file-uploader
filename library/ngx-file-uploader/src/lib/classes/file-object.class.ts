import { Utils } from './utils.class';

export class FileObject {
    lastModifiedDate: Date | null;
    size: number | null;
    type: string;
    name: string;

    constructor(fileOrInput: HTMLInputElement | File) {
        const isInput = Utils.isElement(fileOrInput);
        if (isInput) {
            this._createFromFakePath((fileOrInput as HTMLInputElement).value);
        } else {
            this._createFromObject(fileOrInput as File);
        }
    }

    private _createFromFakePath(path: string) {
        this.lastModifiedDate = null;
        this.size = null;
        this.type = 'like/' + path.slice(path.lastIndexOf('.') + 1).toLowerCase();
        this.name = path.split(/(\\|\/)/g).pop();
    }

    private _createFromObject(object: File) {
        this.lastModifiedDate = new Date(object.lastModified || (object as any).lastModifiedDate.getTime());
        this.size = object.size;
        this.type = object.type;
        this.name = object.name;
    }
}
