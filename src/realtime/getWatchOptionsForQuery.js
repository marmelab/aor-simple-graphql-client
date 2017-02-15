import merge from 'lodash.merge';
import getOrCall from '../getOrCall';

export const defaultWatchOptions = {
    forceFetch: true,
    pollInterval: 2000,
};

export default (apolloWatchParameters, action) => {
    let parameters = getOrCall(apolloWatchParameters, action.meta.resource, action.meta.fetch);

    if (apolloWatchParameters) {
        const resourceParameters = getOrCall(apolloWatchParameters[action.meta.resource], action.meta.fetch);

        if (resourceParameters) {
            parameters = resourceParameters;
            const resourceVerbParameters = getOrCall(resourceParameters[action.meta.fetch]);

            if (resourceVerbParameters) {
                parameters = resourceVerbParameters;
            }
        }
    }

    return merge({}, defaultWatchOptions, parameters);
};
