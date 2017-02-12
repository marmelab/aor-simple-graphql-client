import {
    GET_LIST,
    QUERY_TYPES,
} from './constants';

/**
 * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
 * @param {Object} apolloParams The apollo request params
 * @returns {Object} The key to look for in the response data, depending on the type
 *                   (this is the name of the operation defined in the graphql query or mutation)
 */
export const getApolloResultKey = (type, apolloParams) => (
    QUERY_TYPES.includes(type)
    ? apolloParams.query.definitions[0].name.value
    : apolloParams.mutation.definitions[0].selectionSet.selections[0].name.value
);

/**
 * @param {Object} response Apollo response
 * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
 * @param {String} resource Name of the resource to fetch, e.g. 'posts'
 * @param {Object} apolloParams The apollo request params, depending on the type
 * @returns {Object} REST response
 */
export default (response, type, resource, apolloParams) => {
    const { data } = response;
    const dataKey = getApolloResultKey(type, apolloParams);
    const dataForType = data[dataKey];

    switch (type) {
    case GET_LIST: {
        if (typeof dataForType.totalCount !== 'number') {
            throw new Error('The data returned by the graphql endpoint for the GET_LIST query does not contains a `totalCount` property which is needed to build the pagination. The query result must conform to this schema: `{ totalCount: Int, items: [] }`');
        }
        return {
            data: dataForType.items.map(x => x),
            total: dataForType.totalCount,
        };
    }

    default:
        return dataForType;
    }
};
