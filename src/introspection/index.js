import merge from 'lodash.merge';
import pluralize from 'pluralize';

import fetchSchema from './fetchSchema';
import buildQueriesForResource from './buildQueriesForResource';
import listMutationsFromSchema from './listMutationsFromSchema';
import listResourcesFromSchema from './listResourcesFromSchema';
import listQueriesFromSchema from './listQueriesFromSchema';
import { GET_LIST, GET_ONE, CREATE, DELETE, UPDATE } from '../constants';

const REQUIRED_RESOURCE_KEYS = [GET_LIST, GET_ONE];

const isValidResource = (queries, templates) => resource => {
    const requiredQueries = REQUIRED_RESOURCE_KEYS.map(key => templates[key](resource));

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
    templates: {
        [GET_LIST]: resourceType => `getPageOf${pluralize(resourceType.name)}`,
        [GET_ONE]: resourceType => `get${resourceType.name}`,
        [CREATE]: resourceType => `create${resourceType.name}`,
        [UPDATE]: resourceType => `update${resourceType.name}`,
        [DELETE]: resourceType => `remove${resourceType.name}`,
    },
};

export const buildQueriesForResourceFactory = (
    fetchSchemaImpl,
    listResourcesFromSchemaImpl,
    listQueriesFromSchemaImpl,
    listMutationsFromSchemaImpl,
    buildQueriesForResourceImpl,
) => async (userOptions = defaultOptions) => {
    let options = defaultOptions;

    if (typeof userOptions === 'string') {
        options.url = userOptions;
    }

    if (typeof userOptions === 'object') {
        options = merge({}, defaultOptions, userOptions);
    }

    const schema = await fetchSchemaImpl(options.client);
    const queries = listQueriesFromSchemaImpl(schema, options);
    const mutations = listMutationsFromSchemaImpl(schema, options);
    const types = listResourcesFromSchemaImpl(schema, options);
    const resourceTypes = types.filter(isValidResource(queries, options.templates));

    return resourceTypes.reduce(
        (queriesByResource, resourceType) => ({
            ...queriesByResource,
            [resourceType.name]: buildQueriesForResourceImpl(
                resourceType,
                [...queries, ...mutations],
                resourceTypes,
                types,
                options,
            ),
        }),
        {},
    );
};

export default buildQueriesForResourceFactory(
    fetchSchema,
    listResourcesFromSchema,
    listQueriesFromSchema,
    listMutationsFromSchema,
    buildQueriesForResource,
);
