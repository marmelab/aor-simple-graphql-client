import gql from 'graphql-tag';
import { DELETE } from '../constants';

export default (resource, mutations, options) => {
    const operationName = options.templates[DELETE](resource);

    if (!mutations.some(q => q.name === operationName)) {
        return undefined;
    }

    return gql`
    mutation ${operationName}($id: ID!) {
        ${operationName}(id: $id)
    }`;
};
