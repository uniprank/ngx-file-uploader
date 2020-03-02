export enum HookTypeEnum {
    beforeAddingFile = 'beforeAddingFile',
    afterAddingFile = 'afterAddingFile',
    errorAddingFile = 'errorAddingFile',

    removeFile = 'removeFile',

    prepareUploadFile = 'prepareUploadFile',
    progressUploadFile = 'progressUploadFile',
    progressUploadSpeed = 'progressUploadSpeed',
    successUploadFile = 'successUploadFile',
    completeUploadFile = 'completeUploadFile',
    failedUploadFile = 'failedUploadFile',
    cancelUploadFile = 'cancelUploadFile', // not implemented right now

    prepareUploadAll = 'prepareUploadAll', // not implemented right now
    progressUploadAll = 'progressUploadAll', // not implemented right now
    completeUploadAll = 'completeUploadAll'
}

export class UploaderHook {
    public get type(): HookTypeEnum | null {
        return this._type;
    }

    public get priority(): number | null {
        return this._priority;
    }

    public get callback(): () => void | null {
        return this._callback;
    }

    private _type: HookTypeEnum | null = null;
    private _callback: (...args) => void | null = null;
    private _priority: number | null = null;

    constructor(_hookType: HookTypeEnum, _callback: (...args) => void, _priority = 0) {
        this._type = _hookType;
        this._callback = _callback;
        this._priority = +_priority;
    }
}
