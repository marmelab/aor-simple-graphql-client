import expect, { createSpy } from 'expect';

import getApolloPromise from './getApolloPromise';

import {
    GET_LIST,
    GET_MANY,
    GET_MANY_REFERENCE,
    GET_ONE,
    CREATE,
    DELETE,
    UPDATE,
} from './constants';

describe('getApolloPromise', () => {
    const queryPromise = 'queryPromise';
    const mutationPromise = 'mutationPromise';
    const client = {
        query: createSpy().andReturn(queryPromise),
        mutate: createSpy().andReturn(mutationPromise),
    };

    const params = { param1: true, param2: true };

    it('calls client.query if type is GET_LIST', () => {
        getApolloPromise(client)(GET_LIST, params);

        expect(client.query).toHaveBeenCalledWith({
            ...params,
            forceFetch: true,
        });
    });

    it('calls client.query if type is GET_ONE', () => {
        getApolloPromise(client)(GET_ONE, params);

        expect(client.query).toHaveBeenCalledWith({
            ...params,
            forceFetch: true,
        });
    });

    it('calls client.query if type is GET_MANY', () => {
        getApolloPromise(client)(GET_MANY, params);

        expect(client.query).toHaveBeenCalledWith({
            ...params,
            forceFetch: true,
        });
    });

    it('calls client.query if type is GET_MANY_REFERENCE', () => {
        getApolloPromise(client)(GET_MANY_REFERENCE, params);

        expect(client.query).toHaveBeenCalledWith({
            ...params,
            forceFetch: true,
        });
    });

    it('calls client.mutate if type is CREATE', () => {
        getApolloPromise(client)(CREATE, params);

        expect(client.mutate).toHaveBeenCalledWith(params);
    });

    it('calls client.mutate if type is UPDATE', () => {
        getApolloPromise(client)(UPDATE, params);

        expect(client.mutate).toHaveBeenCalledWith(params);
    });

    it('calls client.mutate if type is DELETE', () => {
        getApolloPromise(client)(DELETE, params);

        expect(client.mutate).toHaveBeenCalledWith(params);
    });

    it('it throws an error for unknown types', () => {
        expect(() => getApolloPromise(client)('FOO', params)).toThrow();
    });
});
