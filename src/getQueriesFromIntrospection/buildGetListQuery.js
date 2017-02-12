/* eslint max-len: off */
import gql from 'graphql-tag';
import buildFieldList from './buildFieldList';
import { GET_LIST } from '../constants';

export const buildGetListQueryFactory = buildFieldListImpl => (resource, queries, options) => {
    const operationName = options.templates[GET_LIST](resource);
    const query = queries.find(q => q.name === operationName);

    if (!query) {
        return undefined;
    }

    const fields = buildFieldListImpl(resource, query, GET_LIST, options);

    return gql`
    query ${operationName}($page: Int, $perPage: Int, $sortField: String, $sortOrder: String, $filter: String) {
        ${operationName}(page: $page, perPage: $perPage, sortField: $sortField, sortOrder: $sortOrder, filter: $filter) {
            items { ${fields} }
            totalCount
        }
    }`;
};

export default buildGetListQueryFactory(buildFieldList);
