import expect, { createSpy } from 'expect';
import merge from 'lodash.merge';

import { buildQueriesForResourceFactory, defaultOptions } from './';
import { GET_LIST, GET_ONE } from '../constants';

describe('introspection', () => {
    const fetchSchema = createSpy().andReturn('schema');
    const listResourcesFromSchema = createSpy().andReturn([
        { name: 'Post' },
        { name: 'Order' },
        { name: 'PartiallyInvalidResource' },
        { name: 'InvalidResource' },
    ]);
    const listQueriesFromSchema = createSpy().andReturn([
        { name: 'getPageOfPost' },
        { name: 'getPost' },
        { name: 'getPageOfOrder' },
        { name: 'getOrder' },
        { name: 'getPartiallyInvalidResource' },
    ]);
    const listMutationsFromSchema = createSpy().andReturn({ mutation: true });
    const buildQueriesForResourceFromDefinitions = createSpy().andReturn('built_queries');
    const buildQueriesForResource = createSpy().andReturn(buildQueriesForResourceFromDefinitions);

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
        const options = {
            client: 'client',
            flavor: {
                [GET_LIST]: { operationName: resource => 'getPageOf' + resource.name },
                [GET_ONE]: { operationName: resource => 'get' + resource.name },
            },
        };
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
});
