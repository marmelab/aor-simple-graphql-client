import { LOCATION_CHANGE } from 'react-router-redux';
import { takeLatest, call, put, take } from 'redux-saga/effects';
import { CRUD_GET_LIST, CRUD_GET_ONE, FETCH_START, FETCH_END } from 'admin-on-rest';
import omit from 'lodash.omit';

import buildAorAction from './buildAorAction';
import createApolloQueryChannel from './createApolloQueryChannel';
import getWatchOptionsForQuery from './getWatchOptionsForQuery';

export const watchCrudActionsFactory = (apolloConfiguredClient, apolloWatchOptions) =>
    function* watchCrudActions(action) {
        const watchOptions = yield call(getWatchOptionsForQuery, apolloWatchOptions, action);
        const { payload: params, meta: { fetch: fetchType, resource } } = action;
        const watcher = yield call(apolloConfiguredClient.watchRequest, fetchType, resource, params, watchOptions);
        const apolloQueryChannel = yield call(createApolloQueryChannel, watcher);

        while (true) { // eslint-disable-line
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

export default (apolloConfiguredClient, apolloWatchOptions) => function* aorGraphQlSaga() {
    const watchCrudActions = watchCrudActionsFactory(apolloConfiguredClient, apolloWatchOptions);
    yield takeLatest(LOCATION_CHANGE, watchLocationChangeFactory(watchCrudActions));
};
