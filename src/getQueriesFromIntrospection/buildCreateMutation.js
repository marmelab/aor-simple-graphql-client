import gql from 'graphql-tag';
import buildFieldList from './buildFieldList';

import { CREATE } from '../constants';

export const buildCreateMutationFactory = buildFieldListImpl => (resource, mutations, options) => {
    const operationName = options.templates[CREATE](resource);
    const mutation = mutations.find(q => q.name === operationName);

    if (!mutation) {
        return undefined;
    }

    const fields = buildFieldListImpl(resource, mutation, CREATE, options);

    return gql`
    mutation ${operationName}($data: String!) {
        ${operationName}(data: $data) {
            ${fields}
        }
    }`;
};

export default buildCreateMutationFactory(buildFieldList);
