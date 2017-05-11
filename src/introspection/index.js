import merge from 'lodash.merge';

import fetchSchema from './fetchSchema';
import buildQueriesForResource from './buildQueriesForResource';
import listMutationsFromSchema from './listMutationsFromSchema';
import listResourcesFromSchema from './listResourcesFromSchema';
import listQueriesFromSchema from './listQueriesFromSchema';
import { GET_LIST, GET_ONE } from '../constants';

const REQUIRED_RESOURCE_KEYS = [GET_LIST, GET_ONE];

const isValidResource = (queries, flavor) => resource => {
    const requiredQueries = REQUIRED_RESOURCE_KEYS.map(key => flavor[key].operationName(resource));

    return requiredQueries.every(requiredQuery => queries.some(query => query.name === requiredQuery));
};

export const defaultOptions = {
    includeTypes: null,
    excludeTypes: null,
    includeQueries: null,
    excludeQueries: null,
    includeMutations: null,
    excludeMutations: null,
    excludeFields: null,
    ignoreSubObjects: false,
};

export const buildQueriesForResourceFactory = (
    fetchSchemaImpl,
    listResourcesFromSchemaImpl,
    listQueriesFromSchemaImpl,
    listMutationsFromSchemaImpl,
    buildQueriesForResourceImpl,
) => async (userOptions = defaultOptions) => {
    const options = merge({}, defaultOptions, userOptions);
    const schema = await fetchSchemaImpl(options.client);
    const queries = listQueriesFromSchemaImpl(schema, options);
    const mutations = listMutationsFromSchemaImpl(schema, options);
    const types = listResourcesFromSchemaImpl(schema, options);
    const resourceTypes = types.filter(isValidResource(queries, options.flavor));
    const buildQueriesForResourceFromDefinitions = buildQueriesForResourceImpl(options.flavor);

    const introspectedQueries = resourceTypes.reduce(
        (queriesByResource, resourceType) => ({
            ...queriesByResource,
            [resourceType.name]: buildQueriesForResourceFromDefinitions(
                resourceType,
                [...queries, ...mutations],
                resourceTypes,
                types,
                options,
            ),
        }),
        {},
    );

    return introspectedQueries;
};

export default buildQueriesForResourceFactory(
    fetchSchema,
    listResourcesFromSchema,
    listQueriesFromSchema,
    listMutationsFromSchema,
    buildQueriesForResource,
);
