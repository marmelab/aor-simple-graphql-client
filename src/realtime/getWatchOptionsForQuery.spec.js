import expect from 'expect';
import merge from 'lodash.merge';

import getWatchOptionsForQuery, { defaultWatchOptions } from './getWatchOptionsForQuery';

describe('getWatchOptionsForQuery', () => {
    const action = { meta: { resource: 'Post', fetch: 'GET_LIST' } };

    it('returns the default options when no options were specified', () => {
        const options = getWatchOptionsForQuery(undefined, action);

        expect(options).toEqual(defaultWatchOptions);
    });

    it('returns the options merged with default options when simple options were specified', () => {
        const userOptions = {
            pollInterval: 10000,
            noFetch: true,
        };
        const options = getWatchOptionsForQuery(userOptions, action);

        expect(options).toEqual(merge({}, defaultWatchOptions, userOptions));
    });

    it('returns the options merged with default options and root options when options for resource were specified', () => {
        const rootOptions = {
            pollInterval: 1000,
            noFetch: true,
        };

        const postOptions = {
            pollInterval: 10000,
        };
        const userOptions = {
            ...rootOptions,
            Post: postOptions,
        };
        const options = getWatchOptionsForQuery(userOptions, action);

        expect(options).toEqual(merge({}, defaultWatchOptions, rootOptions, postOptions));
    });

    it('returns the options merged with default options, root options and resource options when options for resource and verb were specified', () => {
        const rootOptions = {
            pollInterval: 100,
            noFetch: true,
        };

        const postOptions = {
            pollInterval: 1000,
        };

        const verbOptions = {
            pollInterval: 10000,
        };
        const userOptions = {
            ...rootOptions,
            Post: {
                ...postOptions,
                GET_LIST: verbOptions,
            },
        };
        const options = getWatchOptionsForQuery(userOptions, action);

        expect(options).toEqual(merge({}, defaultWatchOptions, rootOptions, postOptions, verbOptions));
    });
});
