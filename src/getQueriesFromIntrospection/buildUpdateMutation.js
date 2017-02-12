import gql from 'graphql-tag';
import buildFieldList from './buildFieldList';
import { UPDATE } from '../constants';

export const buildUpdateMutationFactory = buildFieldListImpl => (resource, mutations, options) => {
    const operationName = options.templates[UPDATE](resource);
    const mutation = mutations.find(q => q.name === operationName);

    if (!mutation) {
        return undefined;
    }

    const fields = buildFieldListImpl(resource, mutation, UPDATE, options);

    return gql`
    mutation ${operationName}($data: String!) {
        ${operationName}(data: $data) {
            ${fields}
        }
    }`;
};

export default buildUpdateMutationFactory(buildFieldList);
