import expect, { createSpy } from 'expect';
import gql from 'graphql-tag';

import { buildUpdateMutationFactory } from './buildUpdateMutation';
import { UPDATE } from '../constants';

describe('buildUpdateMutation', () => {
    it('gets the operation name from options.templates.UPDATE function', () => {
        const buildUpdateMutation = buildUpdateMutationFactory();
        const getUpdateOperationName = createSpy().andReturn('updateOperationName');
        const options = {
            templates: {
                [UPDATE]: getUpdateOperationName,
            },
        };

        buildUpdateMutation('resource', [], options);

        expect(getUpdateOperationName).toHaveBeenCalledWith('resource');
    });

    it('returns undefined if operationName is not found in the mutations list', () => {
        const buildUpdateMutation = buildUpdateMutationFactory();
        const getUpdateOperationName = createSpy().andReturn('updateOperationName');
        const options = {
            templates: {
                [UPDATE]: getUpdateOperationName,
            },
        };

        expect(buildUpdateMutation('resource', [{ name: 'foo' }], options)).toNotExist();
    });

    it('calls buildFieldList with correct arguments', () => {
        const buildFieldList = createSpy();
        const buildUpdateMutation = buildUpdateMutationFactory(buildFieldList);
        const getUpdateOperationName = createSpy().andReturn('updateOperationName');
        const options = {
            templates: {
                [UPDATE]: getUpdateOperationName,
            },
        };

        const mutation = { name: 'updateOperationName' };
        buildUpdateMutation('resource', [mutation], options);

        expect(buildFieldList).toHaveBeenCalledWith('resource', mutation, UPDATE, options);
    });

    it('returns the correct graphql query', () => {
        const buildFieldList = createSpy().andReturn('field1 field2');
        const buildUpdateMutation = buildUpdateMutationFactory(buildFieldList);
        const getUpdateOperationName = createSpy().andReturn('updateOperationName');
        const options = {
            templates: {
                [UPDATE]: getUpdateOperationName,
            },
        };

        const mutation = { name: 'updateOperationName' };
        expect(buildUpdateMutation('resource', [mutation], options)).toEqual(gql`
    mutation updateOperationName($data: String!) {
        updateOperationName(data: $data) {
            field1 field2
        }
    }`);
    });
});
