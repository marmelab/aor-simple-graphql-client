import expect, { createSpy } from 'expect';

import listMutationsFromSchema, { listMutationsFromSchemaFactory } from './listMutationsFromSchema';

describe('listMutationsFromSchema', () => {
    const includedField = { name: 'includedField', kind: 'OBJECT' };
    const excludedField = { name: 'excludedField', kind: 'OBJECT' };

    const types = [
        { name: 'Query', kind: 'OBJECT' },
        {
            name: 'Mutation',
            kind: 'OBJECT',
            fields: [
                includedField,
                excludedField,
            ],
        },
    ];

    it('returns the mutation fields', () => {
        expect(listMutationsFromSchema({ types })).toEqual([
            includedField,
            excludedField,
        ]);
    });

    it('calls filterWithIncludeExclude with correct options', () => {
        const filterWithIncludeExclude = createSpy().andReturn(() => true);
        const listMutationsFromSchemaTest = listMutationsFromSchemaFactory(filterWithIncludeExclude);
        listMutationsFromSchemaTest({ types }, { includeMutations: 'includeMutations', excludeMutations: 'excludeMutations' });

        expect(filterWithIncludeExclude).toHaveBeenCalledWith({ include: 'includeMutations', exclude: 'excludeMutations' });
    });
});
