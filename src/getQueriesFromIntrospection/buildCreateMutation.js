import gql from 'graphql-tag';
import buildFieldList from './buildFieldList';

import { CREATE } from '../constants';

export default (resource, mutations, options) => {
    const operationName = options.templates[CREATE](resource);
    if (!mutations.some(q => q.name === operationName)) {
        return undefined;
    }

    const fields = buildFieldList(resource, CREATE, options);

    return gql`
    mutation ${operationName}($data: String!) {
        ${operationName}(data: $data) {
            ${fields}
        }
    }`;
};
