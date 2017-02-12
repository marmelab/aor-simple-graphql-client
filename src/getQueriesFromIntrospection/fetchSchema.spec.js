import expect, { createSpy } from 'expect';
import { introspectionQuery } from 'graphql';

import { fetchSchemaFactory } from './fetchSchema';

describe('fetchSchema', () => {
    const json = createSpy().andReturn({ data: { __schema: 'a graphql schema' } });

    const response = {
        json,
    };
    const fetch = createSpy().andReturn(Promise.resolve(response));
    const fetchSchema = fetchSchemaFactory(fetch);

    it('calls fetch', () => {
        fetchSchema('a graphql endpoint');

        expect(fetch).toHaveBeenCalledWith('a graphql endpoint', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: introspectionQuery }),
        });
    });

    it('returns the schema from the response', () =>
        fetchSchema('a graphql endpoint').then((schema) => {
            expect(schema).toEqual('a graphql schema');
        }),
    );
});
