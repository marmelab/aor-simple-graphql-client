import expect, { createSpy } from 'expect';
import gql from 'graphql-tag';

import buildRemoveMutation from './buildRemoveMutation';
import { DELETE } from '../constants';

describe('buildRemoveMutation', () => {
    it('gets the operation name from options.templates.DELETE function', () => {
        const getDeleteOperationName = createSpy().andReturn('deleteOperationName');
        const options = {
            templates: {
                [DELETE]: getDeleteOperationName,
            },
        };

        buildRemoveMutation('resource', [], options);

        expect(getDeleteOperationName).toHaveBeenCalledWith('resource');
    });

    it('returns undefined if operationName is not found in the mutations list', () => {
        const getDeleteOperationName = createSpy().andReturn('deleteOperationName');
        const options = {
            templates: {
                [DELETE]: getDeleteOperationName,
            },
        };

        expect(buildRemoveMutation('resource', [{ name: 'foo' }], options)).toNotExist();
    });

    it('returns the correct graphql query', () => {
        const getDeleteOperationName = createSpy().andReturn('deleteOperationName');
        const options = {
            templates: {
                [DELETE]: getDeleteOperationName,
            },
        };

        const mutation = { name: 'deleteOperationName' };
        expect(buildRemoveMutation('resource', [mutation], options)).toEqual(gql`
    mutation deleteOperationName($id: ID!) {
        deleteOperationName(id: $id)
    }`);
    });
});
