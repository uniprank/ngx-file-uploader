import { UploaderHook, HookTypeEnum } from '../uploader-hook.class';

describe('UploaderHook', () => {
    it(`should create a valid hook`, () => {
        let _changedValue = '';
        const _hooks1 = new UploaderHook(
            HookTypeEnum.afterAddingFile,
            (test) => {
                _changedValue = test;
            },
            1
        );
        expect(_hooks1.type).toBe(HookTypeEnum.afterAddingFile);
        expect(_hooks1.priority).toBe(1);
        _hooks1.callback('Works');
        expect(_changedValue).toBe('Works');
    });
});
