import merge from 'lodash.merge';
import pickBy from 'lodash.pickby';
import pluralize from 'pluralize';

import { isNotGraphqlPrivateType, isObject } from './lib';

import fetchSchema from './fetchSchema';
import filterWithIncludeExclude from './filterWithIncludeExclude';
import buildGetListQuery from './buildGetListQuery';
import buildGetOneQuery from './buildGetOneQuery';
import buildCreateMutation from './buildCreateMutation';
import buildUpdateMutation from './buildUpdateMutation';
import buildRemoveMutation from './buildRemoveMutation';

export const listResourcesFromSchema = ({ types }, options) => types
    .filter(isNotGraphqlPrivateType)
    .filter(filterWithIncludeExclude({
        include: options.includeTypes,
        exclude: options.excludeTypes,
    }))
    .filter(isObject)
    .map(type => type);

export const listQueriesFromSchema = ({ types }, options) => types
    .find(type => type.name === 'Query')
    .fields
    .filter(filterWithIncludeExclude({
        include: options.includeQueries,
        exclude: options.excludeQueries,
    }));

export const listMutationsFromSchema = ({ types }, options) => types
    .find(type => type.name === 'Mutation')
    .fields
    .filter(filterWithIncludeExclude({
        include: options.includeMutations,
        exclude: options.excludeMutations,
    }));

export const buildQueriesForResource = (resource, queries, mutations, options) => {
    const [
        GET_LIST,
        GET_ONE,
        CREATE,
        UPDATE,
        DELETE,
    ] = [
        buildGetListQuery(resource, queries, options),
        buildGetOneQuery(resource, queries, options),
        buildCreateMutation(resource, mutations, options),
        buildUpdateMutation(resource, mutations, options),
        buildRemoveMutation(resource, mutations, options),
    ];

    return {
        GET_LIST,
        GET_ONE,
        CREATE,
        UPDATE,
        DELETE,
    };
};

export const isValidResource = value => Object.keys(value).every(key => !!value[key]);

export const defaultOptions = {
    url: 'http://localhost:3000/graphql',
    includeTypes: null,
    excludeTypes: null,
    includeQueries: null,
    excludeQueries: null,
    includeMutations: null,
    excludeMutations: null,
    excludeFields: null,
    templates: {
        GET_LIST: resource => `getPageOf${pluralize(resource.name)}`,
        GET_ONE: resource => `get${resource.name}`,
        CREATE: resource => `create${resource.name}`,
        UPDATE: resource => `update${resource.name}`,
        DELETE: resource => `remove${resource.name}`,
    },
};

export default async (userOptions = defaultOptions) => {
    let options = defaultOptions;

    if (typeof userOptions === 'string') {
        options.url = userOptions;
    }

    if (typeof userOptions === 'object') {
        options = merge({}, userOptions, defaultOptions);
    }

    const schema = await fetchSchema(options.url);
    const resourceTypes = listResourcesFromSchema(schema, options);
    const queries = listQueriesFromSchema(schema, options);
    const mutations = listMutationsFromSchema(schema, options);

    const resources = resourceTypes.reduce((queriesByResource, resourceType) => ({
        ...queriesByResource,
        [resourceType.name]: buildQueriesForResource(resourceType, queries, mutations, options),
    }), {});

    const result = pickBy(resources, isValidResource);

    return result;
};
