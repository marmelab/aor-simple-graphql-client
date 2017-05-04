import {
    GET_LIST,
    GET_ONE,
    GET_MANY,
    GET_MANY_REFERENCE,
    UPDATE,
    CREATE,
    DELETE,
} from './constants';

/**
 * @param {String} type The type of request (see https://marmelab.com/admin-on-rest/RestClients.html)
 * @param {String} resource Name of the resource to fetch, e.g. 'posts'
 * @param {Object} params The REST request params, depending on the type
 * @returns {Object} apolloParams An object passed to either apolloClient.query or apolloClient.mutate
 */
export default (queries, type, resource, params) => {
    const resourceQueries = queries[resource];

    if (!resourceQueries) {
        const knownResources = Object.keys(queries).map(key => `\r\n - ${key}`).join('');
        throw new Error(`Unable to find queries and/or mutations for the "${resource}" resource. Known resources are: ${knownResources}`);
    }

    switch (type) {
    case GET_LIST: {
        return {
            query: resourceQueries[GET_LIST],
            variables: {
                filter: JSON.stringify(params.filter),
                page: params.pagination.page - 1,
                perPage: params.pagination.perPage,
                sortField: params.sort.field,
                sortOrder: params.sort.order,
            },
        };
    }

    case GET_ONE:
        return {
            query: resourceQueries[GET_ONE],
            variables: {
                id: params.id,
            },
        };

    case GET_MANY: {
        let variables = {
            filter: JSON.stringify({ ids: params.ids }),
        };

        if (!resourceQueries[GET_MANY]) {
            variables = {
                ...variables,
                perPage: 1000,
            };
        }

        return {
            query: resourceQueries[GET_MANY] || resourceQueries[GET_LIST],
            variables,
        };
    }

    case GET_MANY_REFERENCE: {
        let variables = {
            filter: JSON.stringify({ [params.target]: params.id }),
        };

        if (!resourceQueries[GET_MANY_REFERENCE]) {
            variables = {
                ...variables,
                perPage: 1000,
            };
        }

        return {
            query: resourceQueries[GET_MANY_REFERENCE] || resourceQueries[GET_LIST],
            variables,
        };
    }

    case UPDATE:
        return {
            mutation: resourceQueries[UPDATE],
            variables: { data: JSON.stringify(params.data) },
        };

    case CREATE:
        return {
            mutation: resourceQueries[CREATE],
            variables: { data: JSON.stringify(params.data) },
        };

    case DELETE:
        return {
            mutation: resourceQueries[DELETE],
            variables: {
                id: params.id,
            },
        };

    default:
        throw new Error(`Unsupported fetch action type ${type}`);
    }
};
