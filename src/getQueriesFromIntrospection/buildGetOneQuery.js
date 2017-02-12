import gql from 'graphql-tag';
import buildFieldList from './buildFieldList';
import { GET_ONE } from '../constants';

export default (resource, queries, options) => {
    const operationName = options.templates[GET_ONE](resource);

    if (!queries.some(q => q.name === operationName)) {
        return undefined;
    }

    const fields = buildFieldList(resource, GET_ONE, options);

    return gql`
    query ${operationName}($id: ID!) {
        ${operationName}(id: $id) {
            ${fields}
        }
    }`;
};
