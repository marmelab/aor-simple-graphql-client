import realtimeSaga from 'aor-realtime';
import { fork } from 'redux-saga/effects';

import getWatchOptionsForQuery from './getWatchOptionsForQuery';

export default (apolloConfiguredClient, apolloWatchOptions) =>
    function* aorGraphQlSaga() {
        const observeQuery = (fetchType, resource, params) => {
            const watchOptions = getWatchOptionsForQuery(apolloWatchOptions, fetchType, resource, params);
            return apolloConfiguredClient.watchRequest(fetchType, resource, params, watchOptions);
        };

        yield fork(realtimeSaga(observeQuery));
    };
