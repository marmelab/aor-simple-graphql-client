import isNotGraphqlPrivateType from './isNotGraphqlPrivateType';
import filterWithIncludeExclude from './filterWithIncludeExclude';

export const isObject = type => type.kind === 'OBJECT';

export const listResourcesFromSchemaFactory = filterWithIncludeExcludeImpl =>
    ({ types }, { includeTypes, excludeTypes } = {}) => types
        .filter(isNotGraphqlPrivateType)
        .filter(filterWithIncludeExcludeImpl({
            include: includeTypes,
            exclude: excludeTypes,
        }))
        .filter(isObject)
        .map(type => type);

export default listResourcesFromSchemaFactory(filterWithIncludeExclude);
