import merge from 'lodash.merge';
import pick from 'lodash.pick';
import getOrCall from '../getOrCall';

export const defaultWatchOptions = {
    fetchPolicy: 'network-only',
    pollInterval: 2000,
};

const knownApolloOptions = [
    'fetchPolicy',
    'metadata',
    'noFetch',
    'notifyOnNetworkStatusChange',
    'pollInterval',
    'query',
    'reducer',
    'returnPartialData',
    'variables',
];

/**
 * Get options for calling ApolloClient.watchQuery.
 * @param apolloWatchOptions {Object} Options supplied by user
 * @param fetchType {String} The fetch type from admin-on-rest (GET_LIST, GET_ONE, etc.)
 * @param resource {String} The resource from admin-on-rest
 * @param params {Object} The paremeters for the query from admin-on-rest
 */
export default (apolloWatchOptions, fetchType, resource, params) => {
    const options = [];
    let tmpOptions = getOrCall(apolloWatchOptions, resource, fetchType, params);
    options.push(tmpOptions);

    if (tmpOptions) {
        options.push(tmpOptions);
        tmpOptions = getOrCall(tmpOptions[resource], fetchType, params);

        if (tmpOptions) {
            options.push(tmpOptions);
            tmpOptions = getOrCall(tmpOptions[fetchType], params);

            if (tmpOptions) {
                options.push(tmpOptions);
            }
        }
    }

    return options.reduce((final, opts) => merge({}, final, pick(opts, knownApolloOptions)), defaultWatchOptions);
};
