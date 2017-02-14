import expect, { createSpy } from 'expect';
import merge from 'lodash.merge';

import { buildQueriesForResourceFactory, defaultOptions } from './';

import {
    GET_LIST,
    GET_ONE,
    CREATE,
    DELETE,
    UPDATE,
} from '../constants';

describe('buildQueriesForResource', () => {
    const fetchSchema = createSpy().andReturn('schema');
    const listResourcesFromSchema = createSpy().andReturn([
        { name: 'Post' },
        { name: 'Order' },
    ]);
    const listQueriesFromSchema = createSpy().andReturn({ query: true });
    const listMutationsFromSchema = createSpy().andReturn({ mutation: true });
    const buildQueriesForResource = createSpy().andCall(resource => (
        resource.name === 'Post'
        ? { [GET_LIST]: true, [GET_ONE]: true }
        : { [GET_LIST]: true }
    ));

    it('calls fetchSchema without any arguments when no options supplied', () => {
        buildQueriesForResourceFactory(
            fetchSchema,
            listResourcesFromSchema,
            listQueriesFromSchema,
            listMutationsFromSchema,
            buildQueriesForResource,
        )();

        expect(fetchSchema).toHaveBeenCalledWith(null);
    });

    it('calls fetchSchema with string when options is a string', () => {
        const options = 'http://localhost/';
        buildQueriesForResourceFactory(
            fetchSchema,
            listResourcesFromSchema,
            listQueriesFromSchema,
            listMutationsFromSchema,
            buildQueriesForResource,
        )(options);

        expect(fetchSchema).toHaveBeenCalledWith(options);
    });

    it('calls fetchSchema with string when options has an url key', () => {
        const url = 'http://localhost/';
        buildQueriesForResourceFactory(
            fetchSchema,
            listResourcesFromSchema,
            listQueriesFromSchema,
            listMutationsFromSchema,
            buildQueriesForResource,
        )({ url });

        expect(fetchSchema).toHaveBeenCalledWith(url);
    });

    it('calls listResourcesFromSchema with the schema and options', () => {
        const options = { url: 'http://localhost/' };
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
        const options = { url: 'http://localhost/' };
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
        const options = { url: 'http://localhost/' };
        buildQueriesForResourceFactory(
            fetchSchema,
            listResourcesFromSchema,
            listQueriesFromSchema,
            listMutationsFromSchema,
            buildQueriesForResource,
        )(options);

        expect(listMutationsFromSchema).toHaveBeenCalledWith('schema', merge({}, defaultOptions, options));
    });

    it('builds an object with a key for each resource name', async () => {
        const options = { url: 'http://localhost/' };
        const queriesByResource = await buildQueriesForResourceFactory(
            fetchSchema,
            listResourcesFromSchema,
            listQueriesFromSchema,
            listMutationsFromSchema,
            buildQueriesForResource,
        )(options);

        expect(queriesByResource).toEqual({
            Post: {
                [GET_LIST]: true,
                [GET_ONE]: true,
            },
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
