import merge from 'lodash.merge';
import pickBy from 'lodash.pickby';
import pluralize from 'pluralize';

import fetchSchema from './fetchSchema';

import buildQueriesForResource from './buildQueriesForResource';
import listMutationsFromSchema from './listMutationsFromSchema';
import listResourcesFromSchema from './listResourcesFromSchema';
import listQueriesFromSchema from './listQueriesFromSchema';

import {
    GET_LIST,
    GET_ONE,
    CREATE,
    DELETE,
    UPDATE,
} from '../constants';

const REQUIRED_RESOURCE_KEYS = [
    GET_LIST,
    GET_ONE,
];

const isValidResource = value => REQUIRED_RESOURCE_KEYS
    .every(requiredKey => Object
        .keys(value)
        .some(resourceKey => resourceKey === requiredKey && !!value[resourceKey]),
    );

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
) =>
    async (userOptions = defaultOptions) => {
        let options = defaultOptions;

        if (typeof userOptions === 'string') {
            options.url = userOptions;
        }

        if (typeof userOptions === 'object') {
            options = merge({}, defaultOptions, userOptions);
        }

        const schema = await fetchSchemaImpl(options.url);
        const resourceTypes = listResourcesFromSchemaImpl(schema, options);
        const queries = listQueriesFromSchemaImpl(schema, options);
        const mutations = listMutationsFromSchemaImpl(schema, options);

        const resources = resourceTypes.reduce((queriesByResource, resourceType) => ({
            ...queriesByResource,
            [resourceType.name]: buildQueriesForResourceImpl(resourceType, [...queries, ...mutations], options),
        }), {});

        const result = pickBy(resources, isValidResource);

        return result;
    };

export default buildQueriesForResourceFactory(
    fetchSchema,
    listResourcesFromSchema,
    listQueriesFromSchema,
    listMutationsFromSchema,
    buildQueriesForResource,
);
