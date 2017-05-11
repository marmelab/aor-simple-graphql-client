import merge from 'lodash.merge';

import buildApolloParams from './buildApolloParams';
import getApolloPromise from './getApolloPromise';
import handleError from './handleError';

export const buildQueryObserver = (flavor, type, resource, apolloParams, observer) => ({
    complete() {
        observer.complete();
    },
    error() {
        observer.error();
    },
    next(apolloQueryResult) {
        const parsedQueryResult = flavor[type].parseResponse(apolloQueryResult, resource, apolloParams);

        observer.next(parsedQueryResult);
    },
});

export const buildObservableQuery = (flavor, type, resource, apolloParams, observableQuery) => ({
    subscribe(observer) {
        const queryObserver = buildQueryObserver(flavor, type, resource, apolloParams, observer);
        const subscription = observableQuery.subscribe(queryObserver);

        return {
            unsubscribe() {
                subscription.unsubscribe();
            },
        };
    },
});

export const buildApolloConfiguredClientFactory = (buildApolloParamsImpl, getApolloPromiseImpl, handleErrorImpl) => (
    client,
    flavor,
    queries,
) => ({
    handleRequest(type, resource, params) {
        const apolloParams = buildApolloParamsImpl(flavor, queries, type, resource, params);

        return getApolloPromiseImpl(client)(type, apolloParams)
            .then(response => flavor[type].parseResponse(response, resource, apolloParams))
            .catch(handleErrorImpl);
    },

    watchRequest(type, resource, params, apolloWatchParameters) {
        const apolloParams = buildApolloParamsImpl(flavor, queries, type, resource, params);
        const observableQuery = client.watchQuery(merge({}, apolloParams, apolloWatchParameters));

        return buildObservableQuery(flavor, type, resource, apolloParams, observableQuery);
    },
});

export default buildApolloConfiguredClientFactory(buildApolloParams, getApolloPromise, handleError);
