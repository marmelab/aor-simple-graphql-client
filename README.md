# aor-simple-graphql-client

A simple GraphQL client for [admin-on-rest](https://github.com/marmelab/admin-on-rest/) built with [Apollo](http://www.apollodata.com/)

## Installation

Install with:

```sh
npm install --save aor-simple-graphql-client
```

or

```sh
yarn add aor-simple-graphql-client
```

## Usage

Let's create a file for our admin page `admin.js`:

```js
import React, { Component } from 'react';
import ApolloClient from 'apollo-client';
import { buildApolloClient } from 'aor-simple-graphql-client';

import { Admin, Resource } from 'admin-on-rest';
import { Delete } from 'admin-on-rest/lib/mui';

import createRestClient from '../lib/admin-on-rest/client';

import { PostCreate, PostEdit, PostList } from '../components/admin/posts';

const client = new ApolloClient();

class AdminPage extends Component {
    constructor() {
        super();
        this.state = { restClient: null };
    }
    componentDidMount() {
        buildApolloClient(client)
            .then(restClient => this.setState({ restClient }));
    }

    render() {
        const { restClient } = this.state;

        if (!restClient) {
            return <div>Loading</div>;
        }

        return (
            <Admin restClient={restClient}>
                <Resource name="Post" list={PostList} edit={PostEdit} create={PostCreate} remove={Delete} />
            </Admin>
        );
    }
}

export default AdminPage;
```