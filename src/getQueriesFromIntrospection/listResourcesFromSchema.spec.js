import expect, { createSpy } from 'expect';

import listResourcesFromSchema, { listResourcesFromSchemaFactory, isObject } from './listResourcesFromSchema';

describe('listResourcesFromSchema', () => {
    describe('isObject', () => {
        it('returns true if type.kind is Object', () => {
            expect(isObject({ kind: 'OBJECT' })).toBe(true);
        });
        it('returns true if type.kind is not Object', () => {
            expect(isObject({ kind: 'SCALAR' })).toBe(false);
        });
    });

    const includedType = { name: 'includedType', kind: 'OBJECT' };
    const excludedType = { name: 'excludedType', kind: 'OBJECT' };

    const types = [
        { name: 'scalar', kind: 'SCALAR' },
        { name: '__aPrivateType', kind: 'OBJECT' },
        { name: 'Mutation', kind: 'OBJECT' },
        { name: 'Query', kind: 'OBJECT' },
        includedType,
        excludedType,
    ];

    it('filters out private types and GraphQL reserved types', () => {
        expect(listResourcesFromSchema({ types })).toEqual([
            includedType,
            excludedType,
        ]);
    });

    it('calls filterWithIncludeExclude with correct options', () => {
        const filterWithIncludeExclude = createSpy().andReturn(() => true);
        const listResourcesFromSchemaTest = listResourcesFromSchemaFactory(filterWithIncludeExclude);
        listResourcesFromSchemaTest({ types }, { includeTypes: 'includeTypes', excludeTypes: 'excludeTypes' });

        expect(filterWithIncludeExclude).toHaveBeenCalledWith({ include: 'includeTypes', exclude: 'excludeTypes' });
    });
});
