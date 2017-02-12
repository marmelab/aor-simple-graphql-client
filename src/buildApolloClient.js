import getApolloPromise from './getApolloPromise';
import buildApolloParams from './buildApolloParams';
import parseApolloResponse from './parseApolloResponse';
import handleError from './handleError';
import getQueriesFromIntrospection from './getQueriesFromIntrospection';
/**
 * Maps admin-on-rest queries to an Apollo GraphQL endpoint
 * @param {Object} client The Apollo client
 * @returns {Object} queries An object with properties named according to each resource,
 *                           each one with properties named according to each request type
 */
export default async (client, userQueries) => {
    let queries = userQueries;

    if (!userQueries) {
        queries = await getQueriesFromIntrospection(client.networkInterface._uri); // eslint-disable-line
    }

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
}
