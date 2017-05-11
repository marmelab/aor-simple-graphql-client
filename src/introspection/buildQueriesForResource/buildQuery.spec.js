import expect, { createSpy } from 'expect';
import { buildQueryFactory } from './buildQuery';

describe('buildQuery', () => {
    const expectedFields = 'fields';
    const verbType = 'GET_LIST';
    const buildFieldList = createSpy().andReturn(expectedFields);
    const resource = 'Post';
    const expectedQuery = 'a graphql query';
    const queryDefinition = {
        operationName: createSpy().andReturn('listPosts'),
        query: createSpy().andReturn(expectedQuery),
    };
    const queryDefinitionWithFields = {
        operationName: createSpy().andReturn('listPosts'),
        query: createSpy().andReturn(expectedQuery),
        returnsFields: true,
    };

    it('gets the operation name from the queryDefinition for the specified type', () => {
        const queries = [{ name: 'listPosts' }, { name: 'createOrder' }];
        const options = {
            templates: {
                GET_LIST: createSpy().andReturn('listPosts'),
                GET_ONE: createSpy().andReturn('findPost'),
                CREATE: () => 'createPost',
            },
        };

        buildQueryFactory(buildFieldList)(queryDefinition, verbType, resource, queries, [], [], options);
        expect(queryDefinition.operationName).toHaveBeenCalledWith(resource);
    });

    it('returns undefined if operation does not exists', () => {
        const queries = [{ name: 'updatePosts' }, { name: 'createOrder' }];
        const options = {
            templates: {
                GET_LIST: () => 'listPosts',
                GET_ONE: createSpy().andReturn('findPost'),
                CREATE: () => 'createPost',
            },
        };

        const query = buildQueryFactory(buildFieldList)(queryDefinition, verbType, resource, queries, [], [], options);

        expect(query).toNotExist();
    });

    it('returns a query for specified type and resource', () => {
        const queries = [{ name: 'listPosts' }, { name: 'createOrder' }];
        const options = {
            templates: {
                GET_LIST: () => 'listPosts',
                GET_ONE: createSpy().andReturn('findPost'),
                CREATE: () => 'createPost',
            },
        };
        const query = buildQueryFactory(buildFieldList)(queryDefinition, verbType, resource, queries, [], [], options);

        expect(query).toEqual(expectedQuery);
    });

    it('calls buildFieldList if the query for specified type returns an object with fields', () => {
        const queries = [{ name: 'listPosts' }, { name: 'createOrder' }];
        const options = {
            templates: {
                GET_LIST: () => 'listPosts',
                GET_ONE: createSpy().andReturn('findPost'),
                CREATE: () => 'createPost',
            },
        };

        buildQueryFactory(buildFieldList)(queryDefinitionWithFields, verbType, resource, queries, [], [], options);
        expect(buildFieldList).toHaveBeenCalledWith(verbType, resource, [], [], options);
    });

    it('calls the specified type query function with built fields when its gql query returns an object with fields', () => {
        const queries = [{ name: 'listPosts' }, { name: 'createOrder' }];
        const options = {
            templates: {
                GET_LIST: () => 'listPosts',
                GET_ONE: createSpy().andReturn('findPost'),
                CREATE: () => 'createPost',
            },
        };

        buildQueryFactory(buildFieldList)(queryDefinitionWithFields, verbType, resource, queries, [], [], options);
        expect(queryDefinitionWithFields.query).toHaveBeenCalledWith('listPosts', expectedFields);
    });
});
