import gql from 'graphql-tag';
import {
    CREATE,
    DELETE,
    GET_LIST,
    GET_ONE,
    UPDATE,
} from '../../constants';

import buildQuery from './buildQuery';

const defaultTypes = {
    [GET_LIST]: {
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
        returnsFields: true,
        query: (operationName, fields) => gql`
        query ${operationName}($id: ID!) {
            ${operationName}(id: $id) {
                ${fields}
            }
        }`,
    },
    [CREATE]: {
        returnsFields: true,
        query: (operationName, fields) => gql`
        mutation ${operationName}($data: String!) {
            ${operationName}(data: $data) {
                ${fields}
            }
        }`,
    },
    [UPDATE]: {
        returnsFields: true,
        query: (operationName, fields) => gql`
        mutation ${operationName}($data: String!) {
            ${operationName}(data: $data) {
                ${fields}
            }
        }`,
    },
    [DELETE]: {
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
    buildQueriesForResourceFactory(defaultTypes, buildQuery)(resource, queriesAndMutations, options);
