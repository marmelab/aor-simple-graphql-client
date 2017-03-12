import expect from 'expect';
import { createNetworkInterface } from 'apollo-client';

import { getClient, getQueries } from './buildApolloClient';

describe('buildApolloClient', () => {
    describe('getClient', () => {
        it('returns the supplied client', () => {
            const result = getClient({ client: 'client' });
            expect(result).toEqual('client');
        });

        it('returns a new client with the specified network interface', () => {
            const result = getClient({
                clientOptions: {
                    networkInterface: createNetworkInterface({ uri: 'http://localhost.dev/graphql' }),
                },
            });
            expect(result.networkInterface._uri).toEqual('http://localhost.dev/graphql'); // eslint-disable-line
        });

        it('returns a new client with a network interface built from the specified uri', () => {
            const result = getClient({
                clientOptions: {
                    uri: 'http://localhost.dev/graphql',
                },
            });
            expect(result.networkInterface._uri).toEqual('http://localhost.dev/graphql'); // eslint-disable-line
        });
    });

    describe('getQueries', () => {
        it('returns the supplied queries', () => {
            const result = getQueries({ queries: 'queries' });
            expect(result).toEqual('queries');
        });
    });
});
