import filterWithIncludeExclude from './filterWithIncludeExclude';

export const listMutationsFromSchemaFactory = filterWithIncludeExcludeImpl =>
    ({ types }, { includeMutations, excludeMutations } = {}) => types
        .find(type => type.name === 'Mutation')
        .fields
        .filter(filterWithIncludeExcludeImpl({
            include: includeMutations,
            exclude: excludeMutations,
        }));

export default listMutationsFromSchemaFactory(filterWithIncludeExclude);
