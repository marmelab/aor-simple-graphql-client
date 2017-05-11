import buildQuery from './buildQuery';

export const buildQueriesForResourceFactory = buildQueryImpl => queriesDefinitions => (
    resource,
    queriesAndMutations,
    resourceTypes,
    types,
    options,
) => {
    return Object.keys(queriesDefinitions).reduce(
        (result, verbType) => ({
            ...result,
            [verbType]: buildQueryImpl(
                queriesDefinitions[verbType],
                verbType,
                resource,
                queriesAndMutations,
                resourceTypes,
                types,
                options,
            ),
        }),
        {},
    );
};

export default queriesDefinitions => (resource, queriesAndMutations, resourceTypes, types, options) =>
    buildQueriesForResourceFactory(buildQuery)(queriesDefinitions)(
        resource,
        queriesAndMutations,
        resourceTypes,
        types,
        options,
    );
