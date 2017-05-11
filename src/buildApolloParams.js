import { GET_LIST, GET_ONE, GET_MANY, GET_MANY_REFERENCE, UPDATE, CREATE, DELETE } from './constants';

/**
 * @param {String} type The type of request (see https://marmelab.com/admin-on-rest/RestClients.html)
 * @param {String} resource Name of the resource to fetch, e.g. 'posts'
 * @param {Object} params The REST request params, depending on the type
 * @returns {Object} apolloParams An object passed to either apolloClient.query or apolloClient.mutate
 */
export default (flavor, queries, type, resource, params) => {
    const resourceQueries = queries[resource];

    if (!resourceQueries) {
        const knownResources = Object.keys(queries).map(key => `\r\n - ${key}`).join('');
        throw new Error(
            `Unable to find queries and/or mutations for the "${resource}" resource. Known resources are: ${knownResources}`,
        );
    }

    switch (type) {
        case GET_LIST: {
            return {
                query: resourceQueries[GET_LIST],
                variables: flavor[GET_LIST].getParameters(params, resource),
            };
        }

        case GET_ONE:
            return {
                query: resourceQueries[GET_ONE],
                variables: flavor[GET_ONE].getParameters(params, resource),
            };

        case GET_MANY: {
            return {
                query: resourceQueries[GET_MANY],
                variables: flavor[GET_MANY].getParameters(params, resource),
            };
        }

        case GET_MANY_REFERENCE: {
            return {
                query: resourceQueries[GET_MANY_REFERENCE],
                variables: flavor[GET_MANY_REFERENCE].getParameters(params, resource),
            };
        }

        case UPDATE:
            return {
                mutation: resourceQueries[UPDATE],
                variables: flavor[UPDATE].getParameters(params, resource),
            };

        case CREATE:
            return {
                mutation: resourceQueries[CREATE],
                variables: flavor[CREATE].getParameters(params, resource),
            };

        case DELETE:
            return {
                mutation: resourceQueries[DELETE],
                variables: flavor[DELETE].getParameters(params, resource),
            };

        default:
            throw new Error(`Unsupported fetch action type ${type}`);
    }
};
