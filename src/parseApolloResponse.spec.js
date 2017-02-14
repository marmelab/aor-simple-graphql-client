import expect from 'expect';

import parseApolloResponse, { buildGetListErrorMessage } from './parseApolloResponse';
import {
    GET_LIST,
    GET_MANY,
    GET_MANY_REFERENCE,
    GET_ONE,
    CREATE,
    DELETE,
    UPDATE,
} from './constants';

describe('parseApolloResponse', () => {
    it('returns an object with data and total keys for GET_LIST', () => {
        const items = [{ id: 1 }];
        const total = 42;
        const response = {
            data: {
                operationName: {
                    items,
                    totalCount: total,
                },
            },
        };
        const apolloParams = {
            query: {
                definitions: [{ name: { value: 'operationName' } }],
            },
        };

        const result = parseApolloResponse(response, GET_LIST, 'Post', apolloParams);

        expect(result).toEqual({
            data: items,
            total,
        });
    });

    it('throws an error when GET_LIST response data does not have a totalCount property', () => {
        const response = {
            data: {
                operationName: [],
            },
        };
        const apolloParams = {
            query: {
                definitions: [{ name: { value: 'operationName' } }],
            },
        };

        expect(() => parseApolloResponse(response, GET_LIST, 'Post', apolloParams))
            .toThrow(buildGetListErrorMessage('Post'));
    });

    it('returns the reponse data for GET_ONE', () => {
        const response = {
            data: {
                operationName: {
                    id: 'post1',
                },
            },
        };
        const apolloParams = {
            query: {
                definitions: [{ name: { value: 'operationName' } }],
            },
        };

        const result = parseApolloResponse(response, GET_ONE, 'Post', apolloParams);

        expect(result).toEqual({
            id: 'post1',
        });
    });

    it('returns the reponse data for GET_MANY', () => {
        const items = [{ id: 1 }];
        const response = {
            data: {
                operationName: items,
            },
        };
        const apolloParams = {
            query: {
                definitions: [{ name: { value: 'operationName' } }],
            },
        };

        const result = parseApolloResponse(response, GET_MANY, 'Post', apolloParams);

        expect(result).toEqual(items);
    });

    it('returns the reponse data for GET_MANY when it falled back to GET_LIST', () => {
        const items = [{ id: 1 }];
        const total = 42;
        const response = {
            data: {
                operationName: {
                    items,
                    totalCount: total,
                },
            },
        };
        const apolloParams = {
            query: {
                definitions: [{ name: { value: 'operationName' } }],
            },
        };

        const result = parseApolloResponse(response, GET_MANY, 'Post', apolloParams);

        expect(result).toEqual(items);
    });

    it('returns the reponse data for GET_MANY_REFERENCE', () => {
        const items = [{ id: 1 }];
        const response = {
            data: {
                operationName: items,
            },
        };
        const apolloParams = {
            query: {
                definitions: [{ name: { value: 'operationName' } }],
            },
        };

        const result = parseApolloResponse(response, GET_MANY_REFERENCE, 'Post', apolloParams);

        expect(result).toEqual(items);
    });

    it('returns the reponse data for GET_MANY_REFERENCE when it falled back to GET_LIST', () => {
        const items = [{ id: 1 }];
        const total = 42;
        const response = {
            data: {
                operationName: {
                    items,
                    totalCount: total,
                },
            },
        };
        const apolloParams = {
            query: {
                definitions: [{ name: { value: 'operationName' } }],
            },
        };

        const result = parseApolloResponse(response, GET_MANY_REFERENCE, 'Post', apolloParams);

        expect(result).toEqual(items);
    });

    it('returns the reponse data for CREATE', () => {
        const response = {
            data: {
                operationName: { id: 'post1' },
            },
        };
        const apolloParams = {
            mutation: {
                definitions: [{
                    selectionSet: {
                        selections: [{ name: { value: 'operationName' } }],
                    },
                }],
            },
        };

        const result = parseApolloResponse(response, CREATE, 'Post', apolloParams);

        expect(result).toEqual({ id: 'post1' });
    });

    it('returns the reponse data for UPDATE', () => {
        const response = {
            data: {
                operationName: { id: 'post1' },
            },
        };
        const apolloParams = {
            mutation: {
                definitions: [{
                    selectionSet: {
                        selections: [{ name: { value: 'operationName' } }],
                    },
                }],
            },
        };

        const result = parseApolloResponse(response, UPDATE, 'Post', apolloParams);

        expect(result).toEqual({ id: 'post1' });
    });

    it('returns the reponse data for DELETE', () => {
        const response = {
            data: {
                operationName: true,
            },
        };
        const apolloParams = {
            mutation: {
                definitions: [{
                    selectionSet: {
                        selections: [{ name: { value: 'operationName' } }],
                    },
                }],
            },
        };

        const result = parseApolloResponse(response, DELETE, 'Post', apolloParams);

        expect(result).toEqual(true);
    });
});
