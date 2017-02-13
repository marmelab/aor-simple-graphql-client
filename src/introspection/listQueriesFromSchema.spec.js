import expect, { createSpy } from 'expect';

import listQueriesFromSchema, { listQueriesFromSchemaFactory } from './listQueriesFromSchema';

describe('listQueriesFromSchema', () => {
    const includedField = { name: 'includedField', kind: 'OBJECT' };
    const excludedField = { name: 'excludedField', kind: 'OBJECT' };

    const types = [
        { name: 'Mutation', kind: 'OBJECT' },
        {
            name: 'Query',
            kind: 'OBJECT',
            fields: [
                includedField,
                excludedField,
            ],
        },
    ];

    it('returns the query fields', () => {
        expect(listQueriesFromSchema({ types })).toEqual([
            includedField,
            excludedField,
        ]);
    });

    it('calls filterWithIncludeExclude with correct options', () => {
        const filterWithIncludeExclude = createSpy().andReturn(() => true);
        const listQueriesFromSchemaTest = listQueriesFromSchemaFactory(filterWithIncludeExclude);
        listQueriesFromSchemaTest({ types }, { includeQueries: 'includeQueries', excludeQueries: 'excludeQueries' });

        expect(filterWithIncludeExclude).toHaveBeenCalledWith({ include: 'includeQueries', exclude: 'excludeQueries' });
    });
});
