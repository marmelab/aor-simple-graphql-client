import merge from 'lodash.merge';
import pickBy from 'lodash.pickby';
import pluralize from 'pluralize';

import fetchSchema from './fetchSchema';

import buildQueriesForResource from './buildQueriesForResource';
import listMutationsFromSchema from './listMutationsFromSchema';
import listResourcesFromSchema from './listResourcesFromSchema';
import listQueriesFromSchema from './listQueriesFromSchema';

export const isValidResource = value => Object.keys(value).every(key => !!value[key]);

export const defaultOptions = {
    url: null,
    includeTypes: null,
    excludeTypes: null,
    includeQueries: null,
    excludeQueries: null,
    includeMutations: null,
    excludeMutations: null,
    excludeFields: null,
    templates: {
        GET_LIST: resourceType => `getPageOf${pluralize(resourceType.name)}`,
        GET_ONE: resourceType => `get${resourceType.name}`,
        CREATE: resourceType => `create${resourceType.name}`,
        UPDATE: resourceType => `update${resourceType.name}`,
        DELETE: resourceType => `remove${resourceType.name}`,
    },
};

export default async (userOptions = defaultOptions) => {
    let options = defaultOptions;

    if (typeof userOptions === 'string') {
        options.url = userOptions;
    }

    if (typeof userOptions === 'object') {
        options = merge({}, defaultOptions, userOptions);
    }

    const schema = await fetchSchema(options.url);
    const resourceTypes = listResourcesFromSchema(schema, options);
    const queries = listQueriesFromSchema(schema, options);
    const mutations = listMutationsFromSchema(schema, options);

    const resources = resourceTypes.reduce((queriesByResource, resourceType) => ({
        ...queriesByResource,
        [resourceType.name]: buildQueriesForResource(resourceType, { ...queries, ...mutations }, options),
    }), {});

    const result = pickBy(resources, isValidResource);

    return result;
};
