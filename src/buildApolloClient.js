import ApolloClient from 'apollo-client';

import buildApolloConfiguredClient from './buildApolloConfiguredClient';
import buildApolloSaga from './realtime';
import buildQueriesFromIntrospection from './introspection';

const getClient = (options) => {
    if (options.client) return options.client;

    return new ApolloClient(options.clientOptions);
};

const getQueries = async (options) => {
    if (options.queries) return options.queries;

    const url = options.client.networkInterface._uri; // eslint-disable-line
    return buildQueriesFromIntrospection({
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

    const apolloConfiguredClient = buildApolloConfiguredClient(client, queries);
    /**
     * @param {string} type Request type, e.g GET_LIST
     * @param {string} resource Resource name, e.g. "posts"
     * @param {Object} payload Request parameters. Depends on the request type
     * @returns {Promise} the Promise for a REST response
     */
    const aorClient = (type, resource, params) =>
        apolloConfiguredClient.handleRequest(type, resource, params);

    aorClient.saga = apolloWatchOptions =>
        buildApolloSaga(apolloConfiguredClient, apolloWatchOptions);

    return aorClient;
};
