import { ApolloClient, createNetworkInterface } from 'apollo-client';
import merge from 'lodash.merge';

import buildApolloConfiguredClient from './buildApolloConfiguredClient';
import buildApolloSaga from './realtime';
import buildQueriesFromIntrospection from './introspection';

export const getClient = ({ client, clientOptions }) => {
    if (client) return client;

    if (clientOptions) {
        const { networkInterface, uri, ...options } = clientOptions;

        if (networkInterface) {
            if (networkInterface && uri) {
                console.error('Warning: You specified a networkInterface and an uri option. uri will be ignored.');
            }
            return new ApolloClient({ ...options, networkInterface });
        }

        if (!networkInterface && uri) {
            options.networkInterface = createNetworkInterface({ uri });
        }

        return new ApolloClient(options);
    }

    return new ApolloClient();
};

export const getQueries = buildQueriesFromIntrospectionImpl => async (options) => {
    if (options.queries && options.introspection === false) {
        return options.queries;
    }

    const queriesFromIntrospection = await buildQueriesFromIntrospectionImpl({
        client: options.client,
        ...options.introspection,
    });

    return merge({}, queriesFromIntrospection, options.queries);
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

    const queries = await getQueries(buildQueriesFromIntrospection)(finalOptions);

    const apolloConfiguredClient = buildApolloConfiguredClient(client, queries);
    /**
     * @param {string} type Request type, e.g GET_LIST
     * @param {string} resource Resource name, e.g. "posts"
     * @param {Object} payload Request parameters. Depends on the request type
     * @returns {Promise} the Promise for a REST response
     */
    const aorClient = (type, resource, params) => apolloConfiguredClient.handleRequest(type, resource, params);

    aorClient.saga = apolloWatchOptions => buildApolloSaga(apolloConfiguredClient, apolloWatchOptions);

    return aorClient;
};
