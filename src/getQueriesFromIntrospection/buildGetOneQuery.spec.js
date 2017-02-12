import expect, { createSpy } from 'expect';
import gql from 'graphql-tag';

import { buildGetOneQueryFactory } from './buildGetOneQuery';
import { GET_ONE } from '../constants';

describe('buildGetOneQuery', () => {
    it('gets the operation name from options.templates.GET_ONE function', () => {
        const buildGetOneQuery = buildGetOneQueryFactory();
        const getGetOneOperationName = createSpy().andReturn('getOneOperationName');
        const options = {
            templates: {
                [GET_ONE]: getGetOneOperationName,
            },
        };

        buildGetOneQuery('resource', [], options);

        expect(getGetOneOperationName).toHaveBeenCalledWith('resource');
    });

    it('returns undefined if operationName is not found in the mutations list', () => {
        const buildGetOneQuery = buildGetOneQueryFactory();
        const getGetOneOperationName = createSpy().andReturn('getOneOperationName');
        const options = {
            templates: {
                [GET_ONE]: getGetOneOperationName,
            },
        };

        expect(buildGetOneQuery('resource', [{ name: 'foo' }], options)).toNotExist();
    });

    it('calls buildFieldList with correct arguments', () => {
        const buildFieldList = createSpy();
        const buildGetOneQuery = buildGetOneQueryFactory(buildFieldList);
        const getGetOneOperationName = createSpy().andReturn('getOneOperationName');
        const options = {
            templates: {
                [GET_ONE]: getGetOneOperationName,
            },
        };

        const query = { name: 'getOneOperationName' };
        buildGetOneQuery('resource', [query], options);

        expect(buildFieldList).toHaveBeenCalledWith('resource', query, GET_ONE, options);
    });

    it('returns the correct graphql query', () => {
        const buildFieldList = createSpy().andReturn('field1 field2');
        const buildGetOneQuery = buildGetOneQueryFactory(buildFieldList);
        const getGetOneOperationName = createSpy().andReturn('getOneOperationName');
        const options = {
            templates: {
                [GET_ONE]: getGetOneOperationName,
            },
        };

        const query = { name: 'getOneOperationName' };
        expect(buildGetOneQuery('resource', [query], options)).toEqual(gql`
    query getOneOperationName($id: ID!) {
        getOneOperationName(id: $id) {
            field1 field2
        }
    }`);
    });
});
