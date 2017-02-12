import expect, { createSpy } from 'expect';

import buildFieldList from './buildFieldList';

describe('buildFieldList', () => {
    const resource = {
        fields: [
            { name: '__privateField' },
            { name: 'publicField1' },
            { name: 'publicField2' },
        ],
    };

    it('only filter private graphql fields without options.excludeFields', () => {
        expect(buildFieldList(resource, 'a_type', {}))
            .toEqual('publicField1 publicField2');
    });

    it('also filter excluded fields with options.excludeFields being an array', () => {
        expect(buildFieldList(resource, 'a_type', { excludeFields: ['publicField2'] }))
            .toEqual('publicField1');
    });

    it('calls options.excludeFields with correct arguments when it is a function and apply its filter', () => {
        const excludeFields = createSpy().andCall(field => field.name === 'publicField1');
        expect(buildFieldList(resource, 'a_type', { excludeFields }))
            .toEqual('publicField2');

        expect(excludeFields).toHaveBeenCalledWith({ name: 'publicField1' }, resource, 'a_type');
        expect(excludeFields).toHaveBeenCalledWith({ name: 'publicField2' }, resource, 'a_type');
        expect(excludeFields.calls.length).toEqual(2);
    });
});
