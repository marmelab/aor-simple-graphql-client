import merge from 'lodash.merge';

export const defaultWatchParameters = {
    forceFetch: true,
    pollInterval: 2000,
};

export default (apolloWatchParameters, action) => {
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
