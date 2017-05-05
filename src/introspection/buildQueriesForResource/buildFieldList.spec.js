import expect, { createSpy } from 'expect';
import { TypeKind } from 'graphql';

import buildFieldList from './buildFieldList';

describe('buildFieldList', () => {
    const resource = {
        fields: [
            { name: '__privateField', type: { kind: TypeKind.SCALAR } },
            { name: 'publicField1', type: { kind: TypeKind.SCALAR } },
            { name: 'publicField2', type: { kind: TypeKind.ENUM } },
            { name: 'publicField3', type: { kind: TypeKind.NON_NULL, ofType: { kind: TypeKind.SCALAR } } },
            { name: 'publicField4', type: { kind: TypeKind.NON_NULL, ofType: { kind: TypeKind.ENUM } } },
        ],
    };

    it('only filter private graphql fields without options.excludeFields', () => {
        expect(buildFieldList(resource, 'a_type', [], [], {})).toEqual(
            'publicField1 publicField2 publicField3 publicField4',
        );
    });

    it('also filter excluded fields with options.excludeFields being an array', () => {
        expect(buildFieldList(resource, 'a_type', [], [], { excludeFields: ['publicField2'] })).toEqual(
            'publicField1 publicField3 publicField4',
        );
    });

    it('calls options.excludeFields with correct arguments when it is a function and apply its filter', () => {
        const excludeFields = createSpy().andCall(field => field.name === 'publicField1');
        expect(buildFieldList(resource, 'a_type', [], [], { excludeFields })).toEqual(
            'publicField2 publicField3 publicField4',
        );

        expect(excludeFields).toHaveBeenCalledWith(
            { name: 'publicField1', type: { kind: TypeKind.SCALAR } },
            resource,
            'a_type',
        );
        expect(excludeFields).toHaveBeenCalledWith(
            { name: 'publicField2', type: { kind: TypeKind.ENUM } },
            resource,
            'a_type',
        );
        expect(excludeFields).toHaveBeenCalledWith(
            { name: 'publicField3', type: { kind: TypeKind.NON_NULL, ofType: { kind: TypeKind.SCALAR } } },
            resource,
            'a_type',
        );
        expect(excludeFields).toHaveBeenCalledWith(
            { name: 'publicField4', type: { kind: TypeKind.NON_NULL, ofType: { kind: TypeKind.ENUM } } },
            resource,
            'a_type',
        );
        expect(excludeFields.calls.length).toEqual(4);
    });

    it('ignores sub objects if ignoreSubObjects option is true', () => {
        const resourceWithSubObject = {
            fields: [
                { name: '__privateField', type: { kind: TypeKind.SCALAR } },
                { name: 'publicField1', type: { kind: TypeKind.SCALAR } },
                { name: 'publicField2', type: { kind: TypeKind.OBJECT } },
                { name: 'publicField3', type: { kind: TypeKind.NON_NULL, ofType: { kind: TypeKind.SCALAR } } },
                { name: 'publicField4', type: { kind: TypeKind.NON_NULL, ofType: { kind: TypeKind.OBJECT } } },
                { name: 'publicField5', type: { kind: TypeKind.LIST, ofType: { kind: TypeKind.SCALAR } } },
                { name: 'publicField6', type: { kind: TypeKind.LIST, ofType: { kind: TypeKind.OBJECT } } },
            ],
        };

        expect(buildFieldList(resourceWithSubObject, 'a_type', [], [], { ignoreSubObjects: true })).toEqual(
            'publicField1 publicField3 publicField5',
        );
    });

    it('includes sub objects but not sub resources if ignoreSubObjects option is false and ignoreSubResources is true', () => {
        const types = [
            {
                name: 'ASubObject',
                fields: [
                    { name: 'publicSubField1', type: { kind: TypeKind.SCALAR } },
                    { name: 'publicSubField2', type: { kind: TypeKind.SCALAR } },
                ],
            },
        ];

        const resources = [
            {
                name: 'ASubResource',
            },
        ];

        const resourceWithSubObject = {
            fields: [
                { name: '__privateField', type: { kind: TypeKind.SCALAR } },
                { name: 'publicField1', type: { kind: TypeKind.SCALAR } },
                { name: 'publicField2', type: { kind: TypeKind.OBJECT } },
                { name: 'publicField4', type: { kind: TypeKind.OBJECT, name: 'ASubObject' } },
                { name: 'publicField5', type: { kind: TypeKind.OBJECT, name: 'ASubResource' } },
                { name: 'publicField6', type: { kind: TypeKind.NON_NULL, ofType: { kind: TypeKind.SCALAR } } },
                {
                    name: 'publicField7',
                    type: { kind: TypeKind.NON_NULL, ofType: { kind: TypeKind.OBJECT, name: 'ASubObject' } },
                },
                {
                    name: 'publicField8',
                    type: { kind: TypeKind.NON_NULL, ofType: { kind: TypeKind.OBJECT, name: 'ASubResource' } },
                },
                { name: 'publicField9', type: { kind: TypeKind.LIST, ofType: { kind: TypeKind.SCALAR } } },
                {
                    name: 'publicField10',
                    type: { kind: TypeKind.LIST, ofType: { kind: TypeKind.OBJECT, name: 'ASubObject' } },
                },
                {
                    name: 'publicField11',
                    type: { kind: TypeKind.LIST, ofType: { kind: TypeKind.OBJECT, name: 'ASubResource' } },
                },
            ],
        };

        expect(buildFieldList(resourceWithSubObject, 'a_type', resources, types, {})).toEqual(
            'publicField1 publicField4 { publicSubField1 publicSubField2 } publicField6 publicField7 { publicSubField1 publicSubField2 } publicField9 publicField10 { publicSubField1 publicSubField2 }',
        );
    });

    it('includes sub objects and sub resources if ignoreSubObjects option is false and ignoreSubResources is false', () => {
        const types = [
            {
                name: 'ASubObject',
                fields: [
                    { name: 'publicSubField1', type: { kind: TypeKind.SCALAR } },
                    { name: 'publicSubField2', type: { kind: TypeKind.SCALAR } },
                ],
            },
            {
                name: 'ASubResource',
                fields: [
                    { name: 'publicSubField1', type: { kind: TypeKind.SCALAR } },
                    { name: 'publicSubField2', type: { kind: TypeKind.SCALAR } },
                ],
            },
        ];

        const resources = [
            {
                name: 'ASubResource',
            },
        ];

        const resourceWithSubObject = {
            fields: [
                { name: '__privateField', type: { kind: TypeKind.SCALAR } },
                { name: 'publicField1', type: { kind: TypeKind.SCALAR } },
                { name: 'publicField2', type: { kind: TypeKind.OBJECT } },
                { name: 'publicField4', type: { kind: TypeKind.OBJECT, name: 'ASubObject' } },
                { name: 'publicField5', type: { kind: TypeKind.OBJECT, name: 'ASubResource' } },
                { name: 'publicField6', type: { kind: TypeKind.NON_NULL, ofType: { kind: TypeKind.SCALAR } } },
                {
                    name: 'publicField7',
                    type: { kind: TypeKind.NON_NULL, ofType: { kind: TypeKind.OBJECT, name: 'ASubObject' } },
                },
                {
                    name: 'publicField8',
                    type: { kind: TypeKind.NON_NULL, ofType: { kind: TypeKind.OBJECT, name: 'ASubResource' } },
                },
                { name: 'publicField9', type: { kind: TypeKind.LIST, ofType: { kind: TypeKind.SCALAR } } },
                {
                    name: 'publicField10',
                    type: { kind: TypeKind.LIST, ofType: { kind: TypeKind.OBJECT, name: 'ASubObject' } },
                },
                {
                    name: 'publicField11',
                    type: { kind: TypeKind.LIST, ofType: { kind: TypeKind.OBJECT, name: 'ASubResource' } },
                },
            ],
        };

        expect(buildFieldList(resourceWithSubObject, 'a_type', resources, types, {})).toEqual(
            'publicField1 publicField4 { publicSubField1 publicSubField2 } publicField5 { publicSubField1 publicSubField2 } publicField6 publicField7 { publicSubField1 publicSubField2 } publicField8 { publicSubField1 publicSubField2 } publicField9 publicField10 { publicSubField1 publicSubField2 } publicField11 { publicSubField1 publicSubField2 }',
        );
    });
});
