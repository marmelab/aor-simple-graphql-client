import expect, { createSpy } from 'expect';
import gql from 'graphql-tag';

import { buildCreateMutationFactory } from './buildCreateMutation';
import { CREATE } from '../constants';

describe('buildCreateMutation', () => {
    it('gets the operation name from options.templates.CREATE function', () => {
        const buildCreateMutation = buildCreateMutationFactory();
        const getCreateOperationName = createSpy().andReturn('createOperationName');
        const options = {
            templates: {
                [CREATE]: getCreateOperationName,
            },
        };

        buildCreateMutation('resource', [], options);

        expect(getCreateOperationName).toHaveBeenCalledWith('resource');
    });

    it('returns undefined if operationName is not found in the mutations list', () => {
        const buildCreateMutation = buildCreateMutationFactory();
        const getCreateOperationName = createSpy().andReturn('createOperationName');
        const options = {
            templates: {
                [CREATE]: getCreateOperationName,
            },
        };

        expect(buildCreateMutation('resource', [{ name: 'foo' }], options)).toNotExist();
    });

    it('calls buildFieldList with correct arguments', () => {
        const buildFieldList = createSpy();
        const buildCreateMutation = buildCreateMutationFactory(buildFieldList);
        const getCreateOperationName = createSpy().andReturn('createOperationName');
        const options = {
            templates: {
                [CREATE]: getCreateOperationName,
            },
        };

        const mutation = { name: 'createOperationName' };
        buildCreateMutation('resource', [mutation], options);

        expect(buildFieldList).toHaveBeenCalledWith('resource', mutation, CREATE, options);
    });

    it('returns the correct graphql query', () => {
        const buildFieldList = createSpy().andReturn('field1 field2');
        const buildCreateMutation = buildCreateMutationFactory(buildFieldList);
        const getCreateOperationName = createSpy().andReturn('createOperationName');
        const options = {
            templates: {
                [CREATE]: getCreateOperationName,
            },
        };

        const mutation = { name: 'createOperationName' };
        expect(buildCreateMutation('resource', [mutation], options)).toEqual(gql`
    mutation createOperationName($data: String!) {
        createOperationName(data: $data) {
            field1 field2
        }
    }`);
    });
});
