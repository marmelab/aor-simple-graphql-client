import gql from 'graphql-tag';
import buildFieldList from './buildFieldList';
import { GET_ONE } from '../constants';

export const buildGetOneQueryFactory = buildFieldListImpl => (resource, queries, options) => {
    const operationName = options.templates[GET_ONE](resource);
    const query = queries.find(q => q.name === operationName);

    if (!query) {
        return undefined;
    }

    const fields = buildFieldListImpl(resource, query, GET_ONE, options);

    return gql`
    query ${operationName}($id: ID!) {
        ${operationName}(id: $id) {
            ${fields}
        }
    }`;
};

export default buildGetOneQueryFactory(buildFieldList);
