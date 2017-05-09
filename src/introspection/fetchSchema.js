import { introspectionQuery } from 'graphql';
import gql from 'graphql-tag';

export default client => client.query({ query: gql`${introspectionQuery}` }).then(({ data: { __schema } }) => __schema);
