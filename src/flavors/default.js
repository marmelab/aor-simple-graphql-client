import gql from 'graphql-tag';
import pluralize from 'pluralize';

import { CREATE, DELETE, GET_LIST, GET_MANY, GET_MANY_REFERENCE, GET_ONE, UPDATE, QUERY_TYPES } from '../constants';

export const buildGetListErrorMessage = resource =>
    `The data returned by the graphql endpoint for the GET_LIST query on resource ${resource} does not contains a \`totalCount\` property which is needed to build the pagination. The query result must conform to this schema: \`{ totalCount: Int, items: [] }\``; // eslint-disable-line

const getApolloResultKey = (type, apolloParams) =>
    QUERY_TYPES.includes(type)
        ? apolloParams.query.definitions[0].selectionSet.selections[0].name.value
        : apolloParams.mutation.definitions[0].selectionSet.selections[0].name.value;

export default {
    [GET_LIST]: {
        operationName: resourceType => `getPageOf${pluralize(resourceType.name)}`,
        getParameters: params => ({
            filter: JSON.stringify(params.filter),
            page: params.pagination.page - 1,
            perPage: params.pagination.perPage,
            sortField: params.sort.field,
            sortOrder: params.sort.order,
        }),
        query: (operationName, fields) => gql`
            query ${operationName}($page: Int, $perPage: Int, $sortField: String, $sortOrder: String, $filter: String) {
                ${operationName}(page: $page, perPage: $perPage, sortField: $sortField, sortOrder: $sortOrder, filter: $filter) {
                    items { ${fields} }
                    totalCount
                }
            }
        `,
        parseResponse: (response, resource, apolloParams) => {
            const { data } = response;
            const dataKey = getApolloResultKey(GET_LIST, apolloParams);
            const dataForType = data[dataKey];

            if (typeof dataForType.totalCount !== 'number') {
                throw new Error(buildGetListErrorMessage(resource));
            }
            return {
                data: dataForType.items.map(x => x),
                total: dataForType.totalCount,
            };
        },
    },
    [GET_MANY]: {
        operationName: resourceType => `getPageOf${pluralize(resourceType.name)}`,
        getParameters: params => ({
            filter: JSON.stringify({ ids: params.ids }),
            perPage: 1000,
        }),
        query: (operationName, fields) => gql`
            query ${operationName}($page: Int, $perPage: Int, $sortField: String, $sortOrder: String, $filter: String) {
                ${operationName}(page: $page, perPage: $perPage, sortField: $sortField, sortOrder: $sortOrder, filter: $filter) {
                    items { ${fields} }
                    totalCount
                }
            }
        `,
        parseResponse: (response, resource, apolloParams) => {
            const { data } = response;
            const dataKey = getApolloResultKey(GET_MANY, apolloParams);
            const dataForType = data[dataKey];

            if (dataForType.totalCount) {
                return { data: dataForType.items.map(x => x) };
            }

            return { data: dataForType };
        },
    },
    [GET_MANY_REFERENCE]: {
        operationName: resourceType => `getPageOf${pluralize(resourceType.name)}`,
        getParameters: params => ({
            filter: JSON.stringify({ [params.target]: params.id }),
            perPage: 1000,
        }),
        query: (operationName, fields) => gql`
            query ${operationName}($page: Int, $perPage: Int, $sortField: String, $sortOrder: String, $filter: String) {
                ${operationName}(page: $page, perPage: $perPage, sortField: $sortField, sortOrder: $sortOrder, filter: $filter) {
                    items { ${fields} }
                    totalCount
                }
            }
        `,
        parseResponse: (response, resource, apolloParams) => {
            const { data } = response;
            const dataKey = getApolloResultKey(GET_MANY_REFERENCE, apolloParams);
            const dataForType = data[dataKey];

            if (dataForType.totalCount) {
                return { data: dataForType.items.map(x => x) };
            }

            return { data: dataForType };
        },
    },
    [GET_ONE]: {
        operationName: resourceType => `get${resourceType.name}`,
        getParameters: params => ({ id: params.id }),
        query: (operationName, fields) => gql`
            query ${operationName}($id: ID!) {
                ${operationName}(id: $id) {
                    ${fields}
                }
            }
        `,
        parseResponse: (response, resource, apolloParams) => {
            const { data } = response;
            const dataKey = getApolloResultKey(GET_ONE, apolloParams);

            return { data: data[dataKey] };
        },
    },
    [CREATE]: {
        operationName: resourceType => `create${resourceType.name}`,
        getParameters: params => ({ data: JSON.stringify(params.data) }),
        query: (operationName, fields) => gql`
            mutation ${operationName}($data: String!) {
                ${operationName}(data: $data) {
                    ${fields}
                }
            }
        `,
        parseResponse: (response, resource, apolloParams) => {
            const { data } = response;
            const dataKey = getApolloResultKey(CREATE, apolloParams);

            return { data: data[dataKey] };
        },
    },
    [UPDATE]: {
        operationName: resourceType => `update${resourceType.name}`,
        getParameters: params => ({ data: JSON.stringify(params.data) }),
        query: (operationName, fields) => gql`
            mutation ${operationName}($data: String!) {
                ${operationName}(data: $data) {
                    ${fields}
                }
            }
        `,
        parseResponse: (response, resource, apolloParams) => {
            const { data } = response;
            const dataKey = getApolloResultKey(UPDATE, apolloParams);

            return { data: data[dataKey] };
        },
    },
    [DELETE]: {
        operationName: resourceType => `remove${resourceType.name}`,
        getParameters: params => ({ id: params.id }),
        query: operationName => gql`
            mutation ${operationName}($id: ID!) {
                ${operationName}(id: $id)
            }
        `,
        parseResponse: (response, resource, apolloParams) => {
            const { data } = response;
            const dataKey = getApolloResultKey(DELETE, apolloParams);

            return { data: data[dataKey] };
        },
    },
};
