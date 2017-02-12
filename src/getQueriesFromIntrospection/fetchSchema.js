import { introspectionQuery } from 'graphql';
import fetch from 'isomorphic-fetch';

export default graphqlEndPoint => fetch(graphqlEndPoint, {
    method: 'POST',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: introspectionQuery }),
})
.then(res => res.json())
.then(({ data: { __schema } }) => __schema);
