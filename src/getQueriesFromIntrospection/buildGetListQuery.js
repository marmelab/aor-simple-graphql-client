import gql from 'graphql-tag';
import buildFieldList from './buildFieldList';
import { GET_LIST } from '../constants';

export default (resource, queries, options) => {
    const operationName = options.templates[GET_LIST](resource);
    if (!queries.some(q => q.name === operationName)) {
        return undefined;
    }

    const fields = buildFieldList(resource, GET_LIST, options);

    return gql`
    query ${operationName}($page: Int, $perPage: Int, $sortField: String, $sortOrder: String, $filter: String) {
        ${operationName}(page: $page, perPage: $perPage, sortField: $sortField, sortOrder: $sortOrder, filter: $filter) {
            items { ${fields} }
            totalCount
        }
    }`;
};
