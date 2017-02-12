import gql from 'graphql-tag';
import buildFieldList from './buildFieldList';
import { UPDATE } from '../constants';

export default (resource, mutations, options) => {
    const operationName = options.templates[UPDATE](resource);

    if (!mutations.some(q => q.name === operationName)) {
        return undefined;
    }

    const fields = buildFieldList(resource, UPDATE, options);

    return gql`
    mutation ${operationName}($data: String!) {
        ${operationName}(data: $data) {
            ${fields}
        }
    }`;
};
