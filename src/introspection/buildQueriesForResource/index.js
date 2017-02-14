import gql from 'graphql-tag';
import {
    CREATE,
    DELETE,
    GET_LIST,
    GET_ONE,
    UPDATE,
} from '../../constants';

import buildQuery from './buildQuery';

export const defaultTypes = {
    [GET_LIST]: {
        name: GET_LIST,
        returnsFields: true,
        query: (operationName, fields) => gql`
        query ${operationName}($page: Int, $perPage: Int, $sortField: String, $sortOrder: String, $filter: String) {
            ${operationName}(page: $page, perPage: $perPage, sortField: $sortField, sortOrder: $sortOrder, filter: $filter) {
                items { ${fields} }
                totalCount
            }
        }`,
    },
    [GET_ONE]: {
        name: GET_ONE,
        returnsFields: true,
        query: (operationName, fields) => gql`
        query ${operationName}($id: ID!) {
            ${operationName}(id: $id) {
                ${fields}
            }
        }`,
    },
    [CREATE]: {
        name: CREATE,
        returnsFields: true,
        query: (operationName, fields) => gql`
        mutation ${operationName}($data: String!) {
            ${operationName}(data: $data) {
                ${fields}
            }
        }`,
    },
    [UPDATE]: {
        name: UPDATE,
        returnsFields: true,
        query: (operationName, fields) => gql`
        mutation ${operationName}($data: String!) {
            ${operationName}(data: $data) {
                ${fields}
            }
        }`,
    },
    [DELETE]: {
        name: DELETE,
        returnsFields: false,
        query: operationName => gql`
        mutation ${operationName}($id: ID!) {
            ${operationName}(id: $id)
        }`,
    },
};


export const buildQueriesForResourceFactory = buildQueryImpl => types =>
    (resource, queriesAndMutations, options) =>
        Object.keys(types).reduce((result, type) => ({
            ...result,
            [type]: buildQueryImpl(resource, types[type], queriesAndMutations, options),
        }), {});

export default (resource, queriesAndMutations, options) =>
    buildQueriesForResourceFactory(buildQuery)(defaultTypes)(resource, queriesAndMutations, options);
