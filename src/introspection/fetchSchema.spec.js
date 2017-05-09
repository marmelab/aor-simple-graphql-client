import expect, { createSpy } from 'expect';
import { introspectionQuery } from 'graphql';
import gql from 'graphql-tag';

import fetchSchema from './fetchSchema';

describe('fetchSchema', () => {
    const client = {
        query: createSpy().andReturn(Promise.resolve({ data: { __schema: 'a graphql schema' } })),
    };

    it('calls client.query', () => {
        fetchSchema(client);

        expect(client.query).toHaveBeenCalledWith({ query: gql`${introspectionQuery}` });
    });

    it('returns the schema from the response', () =>
        fetchSchema(client).then(schema => {
            expect(schema).toEqual('a graphql schema');
        }));
});
