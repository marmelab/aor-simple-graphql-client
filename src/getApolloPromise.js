import {
    GET_LIST,
    GET_MANY,
    GET_MANY_REFERENCE,
    GET_ONE,
    CREATE,
    DELETE,
    UPDATE,
} from './constants';

/**
 * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
 * @param {Object} apolloParams The apollo request params, depending on the type
 * @returns {Promise} promise A promise from a call to either apolloClient.query
 *                    or apolloClient.mutate, depending on the type
 */
export default client => (type, apolloParams) => {
    if ([GET_LIST, GET_MANY, GET_MANY_REFERENCE, GET_ONE].includes(type)) {
        return client.query({
            ...apolloParams,
            forceFetch: true,
        });
    }
    if ([CREATE, DELETE, UPDATE].includes(type)) {
        return client.mutate(apolloParams);
    }

    throw new Error(`Unsupported fetch action type ${type}`);
};
