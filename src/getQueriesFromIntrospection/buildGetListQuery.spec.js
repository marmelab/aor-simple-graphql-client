/* eslint max-len: off */
import expect, { createSpy } from 'expect';
import gql from 'graphql-tag';

import { buildGetListQueryFactory } from './buildGetListQuery';
import { GET_LIST } from '../constants';

describe('buildGetListQuery', () => {
    it('gets the operation name from options.templates.GET_LIST function', () => {
        const buildGetListQuery = buildGetListQueryFactory();
        const getGetListOperationName = createSpy().andReturn('getListOperationName');
        const options = {
            templates: {
                [GET_LIST]: getGetListOperationName,
            },
        };

        buildGetListQuery('resource', [], options);

        expect(getGetListOperationName).toHaveBeenCalledWith('resource');
    });

    it('returns undefined if operationName is not found in the mutations list', () => {
        const buildGetListQuery = buildGetListQueryFactory();
        const getGetListOperationName = createSpy().andReturn('getListOperationName');
        const options = {
            templates: {
                [GET_LIST]: getGetListOperationName,
            },
        };

        expect(buildGetListQuery('resource', [{ name: 'foo' }], options)).toNotExist();
    });

    it('calls buildFieldList with correct arguments', () => {
        const buildFieldList = createSpy();
        const buildGetListQuery = buildGetListQueryFactory(buildFieldList);
        const getGetListOperationName = createSpy().andReturn('getListOperationName');
        const options = {
            templates: {
                [GET_LIST]: getGetListOperationName,
            },
        };

        const query = { name: 'getListOperationName' };
        buildGetListQuery('resource', [query], options);

        expect(buildFieldList).toHaveBeenCalledWith('resource', query, GET_LIST, options);
    });

    it('returns the correct graphql query', () => {
        const buildFieldList = createSpy().andReturn('field1 field2');
        const buildGetListQuery = buildGetListQueryFactory(buildFieldList);
        const getGetListOperationName = createSpy().andReturn('getListOperationName');
        const options = {
            templates: {
                [GET_LIST]: getGetListOperationName,
            },
        };

        const query = { name: 'getListOperationName' };
        expect(buildGetListQuery('resource', [query], options)).toEqual(gql`
    query getListOperationName($page: Int, $perPage: Int, $sortField: String, $sortOrder: String, $filter: String) {
        getListOperationName(page: $page, perPage: $perPage, sortField: $sortField, sortOrder: $sortOrder, filter: $filter) {
            items { field1 field2 }
            totalCount
        }
    }`);
    });
});
