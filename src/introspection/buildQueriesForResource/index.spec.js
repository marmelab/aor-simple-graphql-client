import expect, { createSpy } from 'expect';
import gql from 'graphql-tag';

import { buildQueriesForResourceFactory, defaultTypes } from './';

import {
    CREATE,
    DELETE,
    GET_LIST,
    GET_ONE,
    UPDATE,
} from '../../constants';

describe('buildQueriesForResource', () => {
    const types = {
        GET_LIST: { GET_LIST: true },
        GET_ONE: { GET_ONE: true },
    };

    const buildQuery = createSpy().andReturn('A gql query');

    it('calls buildQuery for each request types', () => {
        const queriesAndMutations = 'queriesAndMutations';
        const resource = 'resource';
        const options = 'options';

        buildQueriesForResourceFactory(buildQuery)(types)(resource, queriesAndMutations, options);

        expect(buildQuery).toHaveBeenCalledWith(resource, types.GET_LIST, queriesAndMutations, options);
        expect(buildQuery).toHaveBeenCalledWith(resource, types.GET_ONE, queriesAndMutations, options);
    });

    it('returns an object mapping each request types to a graphql query', () => {
        expect(buildQueriesForResourceFactory(buildQuery)(types)()).toEqual({
            GET_LIST: 'A gql query',
            GET_ONE: 'A gql query',
        });
    });

    describe('defaultTypes', () => {
        it('GET_LIST is correct', () => {
            expect(defaultTypes[GET_LIST].name).toEqual(GET_LIST);
            expect(defaultTypes[GET_LIST].returnsFields).toEqual(true);
            expect(defaultTypes[GET_LIST].query('operationName', 'field')).toEqual(gql`
            query operationName($page: Int, $perPage: Int, $sortField: String, $sortOrder: String, $filter: String) {
                operationName(page: $page, perPage: $perPage, sortField: $sortField, sortOrder: $sortOrder, filter: $filter) {
                    items { field }
                    totalCount
                }
            }`);
        });
        it('GET_ONE is correct', () => {
            expect(defaultTypes[GET_ONE].name).toEqual(GET_ONE);
            expect(defaultTypes[GET_ONE].returnsFields).toEqual(true);
            expect(defaultTypes[GET_ONE].query('operationName', 'field')).toEqual(gql`
            query operationName($id: ID!) {
                operationName(id: $id) {
                    field
                }
            }`);
        });
        it('CREATE is correct', () => {
            expect(defaultTypes[CREATE].name).toEqual(CREATE);
            expect(defaultTypes[CREATE].returnsFields).toEqual(true);
            expect(defaultTypes[CREATE].query('operationName', 'field')).toEqual(gql`
            mutation operationName($data: String!) {
                operationName(data: $data) {
                    field
                }
            }`);
        });
        it('UPDATE is correct', () => {
            expect(defaultTypes[UPDATE].name).toEqual(UPDATE);
            expect(defaultTypes[UPDATE].returnsFields).toEqual(true);
            expect(defaultTypes[UPDATE].query('operationName', 'field')).toEqual(gql`
            mutation operationName($data: String!) {
                operationName(data: $data) {
                    field
                }
            }`);
        });
        it('DELETE is correct', () => {
            expect(defaultTypes[DELETE].name).toEqual(DELETE);
            expect(defaultTypes[DELETE].query('operationName', 'field')).toEqual(gql`
            mutation operationName($id: ID!) {
                operationName(id: $id)
            }`);
        });
    });
});
