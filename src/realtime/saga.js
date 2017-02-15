import { LOCATION_CHANGE } from 'react-router-redux';
import { takeLatest, call, put, take } from 'redux-saga/effects';
import { eventChannel, END } from 'redux-saga';
import merge from 'lodash.merge';

import { CRUD_GET_LIST, CRUD_GET_ONE, FETCH_START, FETCH_END } from 'admin-on-rest';

export const queryObserver = emitter => ({
    complete() {
        emitter(END);
    },
    error() {
        emitter(END);
    },
    next(apolloQueryResult) {
        emitter(apolloQueryResult);
    },
});

export const createApolloQueryChannel = watcher => eventChannel((emitter) => {
    const observer = queryObserver(emitter);
    watcher.subscribe(observer);

    const unsubscribe = () => {
        observer.unsubscribe();
    };

    return unsubscribe;
});

export const buildAorAction = ({ type, payload, meta: { fetch: restType, ...meta } }, parsedApolloQueryResult) => ({
    type: `${type}_SUCCESS`,
    payload: parsedApolloQueryResult,
    requestPayload: payload,
    meta: { ...meta, fetchResponse: restType, fetchStatus: FETCH_END },
});

export const defaultWatchParameters = {
    forceFetch: true,
    pollInterval: 2000,
};

export const getWatchParametersForQuery = (apolloWatchParameters, action) => {
    let parameters = apolloWatchParameters;

    if (apolloWatchParameters) {
        const resourceParameters = apolloWatchParameters[action.meta.resource];
        if (resourceParameters) {
            parameters = resourceParameters;
            const resourceVerbParameters = resourceParameters[action.meta.fetch];

            if (resourceVerbParameters) {
                parameters = resourceVerbParameters;
            }
        }
    }

    return merge({}, defaultWatchParameters, parameters);
};

export const watchCrudActionsFactory = (apolloConfiguredClient, apolloWatchParameters) =>
    function* watchCrudActions(action) {
        const watchParameters = yield call(getWatchParametersForQuery, apolloWatchParameters, action);
        const { payload: params, meta: { fetch: fetchType, resource } } = action;
        const watcher = yield call(apolloConfiguredClient.watchRequest, fetchType, resource, params, watchParameters);
        const apolloQueryChannel = yield call(createApolloQueryChannel, watcher);

        while (true) {
            const parsedApolloQueryResult = yield take(apolloQueryChannel);
            const { type, payload, meta: { fetch, ...meta } } = action;

            yield [
                put({ type: `${type}_LOADING`, payload, meta }),
                put({ type: FETCH_START }),
            ];

            const aorAction = yield call(buildAorAction, action, parsedApolloQueryResult);

            yield put(aorAction);

            yield put({ type: FETCH_END });
        }
    };

export const watchLocationChangeFactory = watchCrudActions => function* watchLocationChange(action) {
    yield takeLatest([CRUD_GET_LIST, CRUD_GET_ONE], watchCrudActions);
};

export default (apolloConfiguredClient, apolloWatchParameters) => function* aorGraphQlSaga() {
    const watchCrudActions = watchCrudActionsFactory(apolloConfiguredClient, apolloWatchParameters);
    yield takeLatest(LOCATION_CHANGE, watchLocationChangeFactory(watchCrudActions));
};
