import filterWithIncludeExclude from './filterWithIncludeExclude';

export const listQueriesFromSchemaFactory = filterWithIncludeExcludeImpl =>
    ({ types }, { includeQueries, excludeQueries } = {}) => types
        .find(type => type.name === 'Query')
        .fields
        .filter(filterWithIncludeExcludeImpl({
            include: includeQueries,
            exclude: excludeQueries,
        }));

export default listQueriesFromSchemaFactory(filterWithIncludeExclude);
