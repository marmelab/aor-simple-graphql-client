import ApolloClient from 'apollo-client';

import getQueriesFromIntrospection from './getQueriesFromIntrospection';
import getApolloPromise from './getApolloPromise';
import buildApolloParams from './buildApolloParams';
import parseApolloResponse from './parseApolloResponse';
import handleError from './handleError';

const getClient = (options) => {
    if (options.client) return options.client;

    return new ApolloClient(options.clientOptions);
};

const getQueries = async (options) => {
    if (options.queries) return options.queries;

    const url = options.client.networkInterface._uri; // eslint-disable-line
    return getQueriesFromIntrospection({
        url,
        ...options.introspection,
    });
};

/**
 * Maps admin-on-rest queries to an Apollo GraphQL endpoint
 * @param {Object} options
 */
export default async (options) => {
    let finalOptions = options;

    if (!options) {
        finalOptions = {};
    }
    const client = getClient(finalOptions);
    finalOptions.client = client;

    const queries = await getQueries(finalOptions);

    /**
     * @param {string} type Request type, e.g GET_LIST
     * @param {string} resource Resource name, e.g. "posts"
     * @param {Object} payload Request parameters. Depends on the request type
     * @returns {Promise} the Promise for a REST response
     */
    return (type, resource, params) => {
        const apolloParams = buildApolloParams(queries, type, resource, params);

        const promise = getApolloPromise(client)(type, apolloParams).catch(handleError);
        return promise.then(response => parseApolloResponse(response, type, resource, apolloParams));
    };
};
