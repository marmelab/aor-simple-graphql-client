import expect, { createSpy } from 'expect';

import buildApolloParams from './buildApolloParams';

import { GET_LIST, GET_MANY, GET_MANY_REFERENCE, GET_ONE, CREATE, DELETE, UPDATE } from './constants';

describe('buildApolloParams', () => {
    const queries = {
        Post: {
            [GET_LIST]: 'GET_LIST post',
            [GET_ONE]: 'GET_ONE post',
            [GET_MANY]: 'GET_MANY post',
            [GET_MANY_REFERENCE]: 'GET_MANY_REFERENCE post',
            [DELETE]: 'DELETE post',
            [UPDATE]: 'UPDATE post',
            [CREATE]: 'CREATE post',
        },
    };
    const resource = 'Post';
    const flavor = {
        [GET_LIST]: {
            getParameters: createSpy().andReturn('GET_LIST parameters'),
        },
        [GET_MANY]: {
            getParameters: createSpy().andReturn('GET_MANY parameters'),
        },
        [GET_MANY_REFERENCE]: {
            getParameters: createSpy().andReturn('GET_MANY_REFERENCE parameters'),
        },
        [GET_ONE]: {
            getParameters: createSpy().andReturn('GET_ONE parameters'),
        },
        [CREATE]: {
            getParameters: createSpy().andReturn('CREATE parameters'),
        },
        [DELETE]: {
            getParameters: createSpy().andReturn('DELETE parameters'),
        },
        [UPDATE]: {
            getParameters: createSpy().andReturn('UPDATE parameters'),
        },
    };

    it('it returns params for GET_LIST', () => {
        const params = {
            filter: 'a filter',
            pagination: { page: 43, perPage: 100 },
            sort: { field: 'name', order: 'DESC' },
        };

        const apolloParams = buildApolloParams(flavor, queries, GET_LIST, resource, params);

        expect(flavor[GET_LIST].getParameters).toHaveBeenCalledWith(params, resource);

        expect(apolloParams).toEqual({
            query: queries[resource][GET_LIST],
            variables: 'GET_LIST parameters',
        });
    });

    it('it returns params for GET_MANY', () => {
        const params = {
            ids: ['comment1', 'comment2'],
        };

        const apolloParams = buildApolloParams(flavor, queries, GET_MANY, resource, params);

        expect(flavor[GET_MANY].getParameters).toHaveBeenCalledWith(params, resource);

        expect(apolloParams).toEqual({
            query: queries[resource][GET_MANY],
            variables: 'GET_MANY parameters',
        });
    });

    it('it returns params for GET_MANY_REFERENCE', () => {
        const params = {
            target: 'Post',
            id: 'post1',
        };

        const apolloParams = buildApolloParams(flavor, queries, GET_MANY_REFERENCE, resource, params);

        expect(flavor[GET_MANY_REFERENCE].getParameters).toHaveBeenCalledWith(params, resource);

        expect(apolloParams).toEqual({
            query: queries[resource][GET_MANY_REFERENCE],
            variables: 'GET_MANY_REFERENCE parameters',
        });
    });

    it('it returns params for GET_ONE', () => {
        const params = {
            id: 'post1',
        };

        const apolloParams = buildApolloParams(flavor, queries, GET_ONE, resource, params);

        expect(flavor[GET_ONE].getParameters).toHaveBeenCalledWith(params, resource);

        expect(apolloParams).toEqual({
            query: queries[resource][GET_ONE],
            variables: 'GET_ONE parameters',
        });
    });

    it('it returns params for CREATE', () => {
        const params = {
            data: {
                title: 'Hello world',
            },
        };

        const apolloParams = buildApolloParams(flavor, queries, CREATE, resource, params);

        expect(flavor[CREATE].getParameters).toHaveBeenCalledWith(params, resource);

        expect(apolloParams).toEqual({
            mutation: queries[resource][CREATE],
            variables: 'CREATE parameters',
        });
    });

    it('it returns params for UPDATE', () => {
        const params = {
            data: {
                id: 'post1',
                title: 'Hello world',
            },
        };

        const apolloParams = buildApolloParams(flavor, queries, UPDATE, resource, params);

        expect(flavor[UPDATE].getParameters).toHaveBeenCalledWith(params, resource);

        expect(apolloParams).toEqual({
            mutation: queries[resource][UPDATE],
            variables: 'UPDATE parameters',
        });
    });

    it('it returns params for DELETE', () => {
        const params = {
            id: 'post1',
        };

        const apolloParams = buildApolloParams(flavor, queries, DELETE, resource, params);

        expect(flavor[DELETE].getParameters).toHaveBeenCalledWith(params, resource);

        expect(apolloParams).toEqual({
            mutation: queries[resource][DELETE],
            variables: 'DELETE parameters',
        });
    });

    it('it throws an error for unknown types', () => {
        const params = {
            id: 'post1',
        };

        expect(() => buildApolloParams(flavor, queries, 'FOO', resource, params)).toThrow();
    });
});
