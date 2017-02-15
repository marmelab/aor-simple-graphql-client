import { LOCATION_CHANGE } from 'react-router-redux';
import { takeLatest, call, put, take } from 'redux-saga/effects';
import { CRUD_GET_LIST, CRUD_GET_ONE, FETCH_START, FETCH_END } from 'admin-on-rest';
import omit from 'lodash.omit';

import buildAorAction from './buildAorAction';
import createApolloQueryChannel from './createApolloQueryChannel';
import getWatchParametersForQuery from './getWatchParametersForQuery';

export const watchCrudActionsFactory = (apolloConfiguredClient, apolloWatchParameters) =>
    function* watchCrudActions(action) {
        const watchParameters = yield call(getWatchParametersForQuery, apolloWatchParameters, action);
        const { payload: params, meta: { fetch: fetchType, resource } } = action;
        const watcher = yield call(apolloConfiguredClient.watchRequest, fetchType, resource, params, watchParameters);
        const apolloQueryChannel = yield call(createApolloQueryChannel, watcher);

        while (true) {
            const parsedApolloQueryResult = yield take(apolloQueryChannel);
            const { type, payload, meta } = action;

            yield [
                put({ type: `${type}_LOADING`, payload, meta: omit(meta, 'fetch') }),
                put({ type: FETCH_START }),
            ];

            const aorAction = yield call(buildAorAction, action, parsedApolloQueryResult);

            yield put(aorAction);

            yield put({ type: FETCH_END });
        }
    };

export const watchLocationChangeFactory = watchCrudActions => function* watchLocationChange() {
    yield takeLatest([CRUD_GET_LIST, CRUD_GET_ONE], watchCrudActions);
};

export default (apolloConfiguredClient, apolloWatchParameters) => function* aorGraphQlSaga() {
    const watchCrudActions = watchCrudActionsFactory(apolloConfiguredClient, apolloWatchParameters);
    yield takeLatest(LOCATION_CHANGE, watchLocationChangeFactory(watchCrudActions));
};
