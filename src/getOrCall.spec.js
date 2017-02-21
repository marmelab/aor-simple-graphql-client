import expect, { createSpy } from 'expect';
import getOrCall from './getOrCall';

describe('getOrCall', () => {
    it('returns the value directly if not a function', () => {
        const value = 'a value';
        expect(getOrCall(value)).toEqual(value);
    });

    const funcResult = 'a computed value';
    const func = createSpy().andReturn(funcResult);

    const args = ['arg1', 'arg2'];
    const result = getOrCall(func, ...args);

    it('calls the function with other arguments if a function', () => {
        expect(func).toHaveBeenCalledWith(...args);
    });

    it('returns the function result if a function', () => {
        expect(result).toEqual(funcResult);
    });
});
