import expect from 'expect';

import buildApolloParams from './buildApolloParams';

import {
    GET_LIST,
    GET_MANY,
    GET_MANY_REFERENCE,
    GET_ONE,
    CREATE,
    DELETE,
    UPDATE,
} from './constants';

describe('buildApolloParams', () => {
    const queries = {
        Post: {
            [GET_LIST]: 'GET_LIST post',
            [GET_ONE]: 'GET_ONE post',
            [DELETE]: 'DELETE post',
            [UPDATE]: 'UPDATE post',
            [CREATE]: 'CREATE post',
        },
    };
    const resource = 'Post';

    it('it returns params for GET_LIST', () => {
        const params = {
            filter: 'a filter',
            pagination: { page: 43, perPage: 100 },
            sort: { field: 'name', order: 'DESC' },
        };

        const apolloParams = buildApolloParams(queries, GET_LIST, resource, params);

        expect(apolloParams).toEqual({
            query: queries[resource][GET_LIST],
            variables: {
                filter: JSON.stringify('a filter'),
                page: 42,
                perPage: 100,
                sortField: 'name',
                sortOrder: 'DESC',
            },
        });
    });

    it('it returns params for GET_MANY using query defined by GET_MANY', () => {
        const params = {
            ids: ['comment1', 'comment2'],
        };

        const apolloParams = buildApolloParams({
            Post: {
                ...queries.Post,
                [GET_MANY]: 'GET_MANY post',
            },
        }, GET_MANY, resource, params);

        expect(apolloParams).toEqual({
            query: 'GET_MANY post',
            variables: {
                filter: JSON.stringify({ ids: params.ids }),
            },
        });
    });

    it('it returns params for GET_MANY using query defined by GET_LIST if GET_MANY query is not defined', () => {
        const params = {
            ids: ['comment1', 'comment2'],
        };

        const apolloParams = buildApolloParams(queries, GET_MANY, resource, params);

        expect(apolloParams).toEqual({
            query: queries[resource][GET_LIST],
            variables: {
                filter: JSON.stringify({ ids: params.ids }),
                perPage: 1000,
            },
        });
    });

    it('it returns params for GET_MANY_REFERENCE using query defined by GET_MANY_REFERENCE', () => {
        const params = {
            target: 'Post',
            id: 'post1',
        };

        const apolloParams = buildApolloParams({
            Post: {
                ...queries.Post,
                [GET_MANY_REFERENCE]: 'GET_MANY_REFERENCE post',
            },
        }, GET_MANY_REFERENCE, resource, params);

        expect(apolloParams).toEqual({
            query: 'GET_MANY_REFERENCE post',
            variables: {
                filter: JSON.stringify({ Post: 'post1' }),
            },
        });
    });

    it('it returns params for GET_MANY_REFERENCE using query defined by GET_LIST if GET_MANY_REFERENCE query is not defined', () => {
        const params = {
            target: 'Post',
            id: 'post1',
        };

        const apolloParams = buildApolloParams(queries, GET_MANY_REFERENCE, resource, params);

        expect(apolloParams).toEqual({
            query: queries[resource][GET_LIST],
            variables: {
                filter: JSON.stringify({ Post: 'post1' }),
                perPage: 1000,
            },
        });
    });

    it('it returns params for GET_ONE', () => {
        const params = {
            id: 'post1',
        };

        const apolloParams = buildApolloParams(queries, GET_ONE, resource, params);

        expect(apolloParams).toEqual({
            query: queries[resource][GET_ONE],
            variables: {
                id: 'post1',
            },
        });
    });

    it('it returns params for CREATE', () => {
        const params = {
            data: {
                title: 'Hello world',
            },
        };

        const apolloParams = buildApolloParams(queries, CREATE, resource, params);

        expect(apolloParams).toEqual({
            mutation: queries[resource][CREATE],
            variables: {
                data: JSON.stringify({
                    title: 'Hello world',
                }),
            },
        });
    });

    it('it returns params for UPDATE', () => {
        const params = {
            data: {
                id: 'post1',
                title: 'Hello world',
            },
        };

        const apolloParams = buildApolloParams(queries, UPDATE, resource, params);

        expect(apolloParams).toEqual({
            mutation: queries[resource][UPDATE],
            variables: {
                data: JSON.stringify({
                    id: 'post1',
                    title: 'Hello world',
                }),
            },
        });
    });

    it('it returns params for DELETE', () => {
        const params = {
            id: 'post1',
        };

        const apolloParams = buildApolloParams(queries, DELETE, resource, params);

        expect(apolloParams).toEqual({
            mutation: queries[resource][DELETE],
            variables: {
                id: 'post1',
            },
        });
    });

    it('it throws an error for unknown types', () => {
        const params = {
            id: 'post1',
        };

        expect(() => buildApolloParams(queries, 'FOO', resource, params)).toThrow();
    });
});
