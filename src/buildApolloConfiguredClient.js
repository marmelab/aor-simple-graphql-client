import merge from 'lodash.merge';

import buildApolloParams from './buildApolloParams';
import getApolloPromise from './getApolloPromise';
import handleError from './handleError';
import parseApolloResponse from './parseApolloResponse';

export const buildQueryObserver = (type, resource, apolloParams, observer) => ({
    complete() {
        observer.complete();
    },
    error() {
        observer.error();
    },
    next(apolloQueryResult) {
        const parsedApolloQueryResult = parseApolloResponse(
            apolloQueryResult,
            type,
            resource,
            apolloParams,
        );

        observer.next(parsedApolloQueryResult);
    },
});

export const buildObservableQuery = (type, resource, apolloParams, observableQuery) => ({
    subscribe(observer) {
        const queryObserver = buildQueryObserver(type, resource, apolloParams, observer);
        const subscription = observableQuery.subscribe(queryObserver);

        return {
            unsubscribe() {
                subscription.unsubscribe();
            },
        };
    },
});

export const buildApolloConfiguredClientFactory = (
    buildApolloParamsImpl,
    getApolloPromiseImpl,
    parseApolloResponseImpl,
    handleErrorImpl,
) => (client, queries) => ({
    handleRequest(type, resource, params) {
        const apolloParams = buildApolloParamsImpl(queries, type, resource, params);

        return getApolloPromiseImpl(client)(type, apolloParams)
            .then(response => parseApolloResponseImpl(response, type, resource, apolloParams))
            .catch(handleErrorImpl);
    },

    watchRequest(type, resource, params, apolloWatchParameters) {
        const apolloParams = buildApolloParamsImpl(queries, type, resource, params);
        const observableQuery = client.watchQuery(merge({}, apolloParams, apolloWatchParameters));

        return buildObservableQuery(type, resource, apolloParams, observableQuery);
    },
});

export default buildApolloConfiguredClientFactory(
    buildApolloParams,
    getApolloPromise,
    parseApolloResponse,
    handleError,
);
