import expect, { createSpy } from 'expect';
import { buildQueryFactory } from './buildQuery';

describe('buildQuery', () => {
    const expectedFields = 'fields';
    const buildFieldList = createSpy().andReturn(expectedFields);

    it('gets the operation name from the template defined in options for the specified type', () => {
        const resource = 'Post';
        const expectedQuery = 'a graphql query';
        const type = { name: 'GET_LIST', query: createSpy().andReturn(expectedQuery) };
        const queries = [{ name: 'listPosts' }, { name: 'createOrder' }];
        const options = {
            templates: {
                GET_LIST: createSpy().andReturn('listPosts'),
                CREATE: () => 'createPost',
            },
        };

        buildQueryFactory(buildFieldList)(resource, type, queries, options);
        expect(options.templates.GET_LIST).toHaveBeenCalledWith(resource);
    });

    it('returns undefined if operation does not exists', () => {
        const resource = 'Post';
        const expectedQuery = 'a graphql query';
        const type = { name: 'GET_LIST', query: createSpy().andReturn(expectedQuery) };
        const queries = [{ name: 'updatePosts' }, { name: 'createOrder' }];
        const options = {
            templates: {
                GET_LIST: () => 'listPosts',
                CREATE: () => 'createPost',
            },
        };

        const query = buildQueryFactory(buildFieldList)(resource, type, queries, options);

        expect(query).toNotExist();
    });

    it('returns a query for specified type and resource', () => {
        const resource = 'Post';
        const expectedQuery = 'a graphql query';
        const type = { name: 'GET_LIST', query: createSpy().andReturn(expectedQuery) };
        const queries = [{ name: 'listPosts' }, { name: 'createOrder' }];
        const options = {
            templates: {
                GET_LIST: () => 'listPosts',
                CREATE: () => 'createPost',
            },
        };
        const query = buildQueryFactory(buildFieldList)(resource, type, queries, options);

        expect(query).toEqual(expectedQuery);
    });

    it('calls buildFieldList if the query for specified type returns an object with fields', () => {
        const resource = 'Post';
        const expectedQuery = 'a graphql query';
        const type = { name: 'GET_LIST', returnsFields: true, query: createSpy().andReturn(expectedQuery) };
        const queries = [{ name: 'listPosts' }, { name: 'createOrder' }];
        const options = {
            templates: {
                GET_LIST: () => 'listPosts',
                CREATE: () => 'createPost',
            },
        };

        buildQueryFactory(buildFieldList)(resource, type, queries, options);
        expect(buildFieldList).toHaveBeenCalledWith(resource, { name: 'listPosts' }, type.name, options);
    });

    it('calls the specified type query function with built fields when its gql query returns an object with fields', () => {
        const resource = 'Post';
        const expectedQuery = 'a graphql query';
        const type = { name: 'GET_LIST', returnsFields: true, query: createSpy().andReturn(expectedQuery) };
        const queries = [{ name: 'listPosts' }, { name: 'createOrder' }];
        const options = {
            templates: {
                GET_LIST: () => 'listPosts',
                CREATE: () => 'createPost',
            },
        };

        buildQueryFactory(buildFieldList)(resource, type, queries, options);
        expect(type.query).toHaveBeenCalledWith('listPosts', expectedFields);
    });
});
