import gql from 'graphql-tag';
import { CREATE, DELETE, GET_LIST, GET_ONE, UPDATE } from '../../constants';

import buildQuery from './buildQuery';

export const defaultVerbTypes = {
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

export const buildQueriesForResourceFactory = buildQueryImpl => verbTypes => (
    resource,
    queriesAndMutations,
    resourceTypes,
    types,
    options,
) =>
    Object.keys(verbTypes).reduce(
        (result, verbType) => ({
            ...result,
            [verbType]: buildQueryImpl(
                resource,
                verbTypes[verbType],
                queriesAndMutations,
                resourceTypes,
                types,
                options,
            ),
        }),
        {},
    );

export default (resource, queriesAndMutations, resourceTypes, types, options) =>
    buildQueriesForResourceFactory(buildQuery)(defaultVerbTypes)(
        resource,
        queriesAndMutations,
        resourceTypes,
        types,
        options,
    );
