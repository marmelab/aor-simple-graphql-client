import expect, { createSpy } from 'expect';

import { buildQueriesForResourceFactory } from './';

import { GET_LIST, GET_ONE } from '../../constants';

describe('buildQueriesForResource', () => {
    const types = {
        [GET_LIST]: { GET_LIST: true },
        [GET_ONE]: { GET_ONE: true },
    };

    const buildQuery = createSpy().andReturn('A gql query');

    it('calls buildQuery for each request types', () => {
        const queriesAndMutations = 'queriesAndMutations';
        const resource = 'resource';
        const options = 'options';

        buildQueriesForResourceFactory(buildQuery)(types)(resource, queriesAndMutations, [], [], options);

        expect(buildQuery).toHaveBeenCalledWith(
            types.GET_LIST,
            GET_LIST,
            resource,
            queriesAndMutations,
            [],
            [],
            options,
        );
        expect(buildQuery).toHaveBeenCalledWith(types.GET_ONE, GET_ONE, resource, queriesAndMutations, [], [], options);
    });

    it('returns an object mapping each request types to a graphql query', () => {
        expect(buildQueriesForResourceFactory(buildQuery)(types)()).toEqual({
            GET_LIST: 'A gql query',
            GET_ONE: 'A gql query',
        });
    });
});
