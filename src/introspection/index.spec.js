import expect, { createSpy } from 'expect';
import merge from 'lodash.merge';

import { buildQueriesForResourceFactory, defaultOptions } from './';
import { GET_LIST, GET_ONE, CREATE, DELETE, UPDATE } from '../constants';

describe('introspection', () => {
    const fetchSchema = createSpy().andReturn('schema');
    const listResourcesFromSchema = createSpy().andReturn([
        { name: 'Post' },
        { name: 'Order' },
        { name: 'PartiallyInvalidResource' },
        { name: 'InvalidResource' },
    ]);
    const listQueriesFromSchema = createSpy().andReturn([
        { name: 'getPageOfPosts' },
        { name: 'getPost' },
        { name: 'getPageOfOrders' },
        { name: 'getOrder' },
        { name: 'getPartiallyInvalidResource' },
    ]);
    const listMutationsFromSchema = createSpy().andReturn({ mutation: true });
    const buildQueriesForResource = createSpy().andReturn('built_queries');

    it('calls fetchSchema with the client', () => {
        buildQueriesForResourceFactory(
            fetchSchema,
            listResourcesFromSchema,
            listQueriesFromSchema,
            listMutationsFromSchema,
            buildQueriesForResource,
        )({ client: 'client' });

        expect(fetchSchema).toHaveBeenCalledWith('client');
    });

    it('calls listResourcesFromSchema with the schema and options', () => {
        const options = { client: 'client' };
        buildQueriesForResourceFactory(
            fetchSchema,
            listResourcesFromSchema,
            listQueriesFromSchema,
            listMutationsFromSchema,
            buildQueriesForResource,
        )(options);

        expect(listResourcesFromSchema).toHaveBeenCalledWith('schema', merge({}, defaultOptions, options));
    });

    it('calls listQueriesFromSchema with the schema and options', () => {
        const options = { client: 'client' };
        buildQueriesForResourceFactory(
            fetchSchema,
            listResourcesFromSchema,
            listQueriesFromSchema,
            listMutationsFromSchema,
            buildQueriesForResource,
        )(options);

        expect(listQueriesFromSchema).toHaveBeenCalledWith('schema', merge({}, defaultOptions, options));
    });

    it('calls listMutationsFromSchema with the schema and options', () => {
        const options = { client: 'client' };
        buildQueriesForResourceFactory(
            fetchSchema,
            listResourcesFromSchema,
            listQueriesFromSchema,
            listMutationsFromSchema,
            buildQueriesForResource,
        )(options);

        expect(listMutationsFromSchema).toHaveBeenCalledWith('schema', merge({}, defaultOptions, options));
    });

    it('builds an object with a key for each resource name, filtering invalid resources', async () => {
        const options = { client: 'client' };
        const queriesByResource = await buildQueriesForResourceFactory(
            fetchSchema,
            listResourcesFromSchema,
            listQueriesFromSchema,
            listMutationsFromSchema,
            buildQueriesForResource,
        )(options);

        expect(queriesByResource).toEqual({
            Post: 'built_queries',
            Order: 'built_queries',
        });
    });

    describe('default templates', () => {
        it('GET_LIST is ok', () => {
            expect(defaultOptions.templates[GET_LIST]({ name: 'Post' })).toEqual('getPageOfPosts');
        });
        it('GET_ONE is ok', () => {
            expect(defaultOptions.templates[GET_ONE]({ name: 'Post' })).toEqual('getPost');
        });
        it('CREATE is ok', () => {
            expect(defaultOptions.templates[CREATE]({ name: 'Post' })).toEqual('createPost');
        });
        it('UPDATE is ok', () => {
            expect(defaultOptions.templates[UPDATE]({ name: 'Post' })).toEqual('updatePost');
        });
        it('DELETE is ok', () => {
            expect(defaultOptions.templates[DELETE]({ name: 'Post' })).toEqual('removePost');
        });
    });
});
