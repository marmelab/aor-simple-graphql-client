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
    switch (type) {
    case GET_LIST: {
        return {
            query: queries[resource].GET_LIST,
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
            query: queries[resource].GET_ONE,
            variables: {
                id: params.id,
            },
        };

    case GET_MANY:
        return {
            query: queries[resource].GET_LIST,
            variables: {
                filter: JSON.stringify({ ids: params.ids }),
                perPage: 1000,
            },
        };

    case GET_MANY_REFERENCE:
        return {
            query: queries[resource].GET_LIST,
            variables: {
                filter: JSON.stringify({ [params.target]: params.id }),
                perPage: 1000,
            },
        };

    case UPDATE:
        return {
            mutation: queries[resource].UPDATE,
            variables: { data: JSON.stringify(params.data) },
        };

    case CREATE:
        return {
            mutation: queries[resource].CREATE,
            variables: { data: JSON.stringify(params.data) },
        };

    case DELETE:
        return {
            mutation: queries[resource].DELETE,
            variables: {
                id: params.id,
            },
        };

    default:
        throw new Error(`Unsupported fetch action type ${type}`);
    }
};
