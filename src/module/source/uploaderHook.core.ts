export enum hookType {
    beforeAddingFile,
    afterAddingFile,
    errorAddingFile,

    prepareUploadFile,
    progressUploadFile,
    successUploadFile,
    completeUploadFile,
    failedUploadFile,
    cancelUploadFile,   // not implemented right now

    prepareUploadAll,   // not implemented right now
    progressUploadAll,  // not implemented right now
    completeUploadAll
}

export class UploaderHook {
    public get type (): hookType | null {
        return this._type;
    }

    public get priority (): number | null {
        return this._priority;
    }

    public get callback(): Function | null {
        return this._callback;
    }

    private _type: hookType | null = null;
    private _callback: Function | null = null;
    private _priority: number | null = null;

    constructor (_hookType: hookType, _callback: Function, _priority = 0) {
        this._type = _hookType;
        this._callback = _callback;
        this._priority = +_priority;
    }
}
