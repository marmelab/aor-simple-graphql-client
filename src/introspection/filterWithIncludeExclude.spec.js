import expect, { createSpy } from 'expect';

import filterWithIncludeExclude from './filterWithIncludeExclude';

describe('filterWithIncludeExclude', () => {
    const includedType = { name: 'includedType' };
    const excludedType = { name: 'excludedType' };

    const types = [
        { name: 'Query' },
        { name: 'Mutation' },
        includedType,
        excludedType,
    ];

    it('returns correct filter when neither include and exclude are supplied', () => {
        expect(types.filter(filterWithIncludeExclude({})))
            .toEqual([includedType, excludedType]);
    });

    it('returns correct filter when include is an array', () => {
        expect(types.filter(filterWithIncludeExclude({ include: [includedType.name] })))
            .toEqual([includedType]);
    });

    it('returns correct filter when include is a function', () => {
        const include = createSpy().andCall(type => type.name !== 'excludedType');
        expect(types.filter(filterWithIncludeExclude({ include })))
            .toEqual([includedType]);
    });

    it('returns correct filter when exclude is an array', () => {
        expect(types.filter(filterWithIncludeExclude({ exclude: [excludedType.name] })))
            .toEqual([includedType]);
    });

    it('returns correct filter when exclude is a function', () => {
        const exclude = createSpy().andCall(type => type.name === 'excludedType');
        expect(types.filter(filterWithIncludeExclude({ exclude })))
            .toEqual([includedType]);
    });
});
