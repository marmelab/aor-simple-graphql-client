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
            anOption: true,
        };
        const options = getWatchOptionsForQuery(userOptions, action);

        expect(options).toEqual(merge({}, defaultWatchOptions, userOptions));
    });

    it('returns the options merged with default options when options for resource were specified', () => {
        const postOptions = {
            anOptionForPost: true,
        };
        const userOptions = {
            Post: postOptions,
        };
        const options = getWatchOptionsForQuery(userOptions, action);

        expect(options).toEqual(merge({}, defaultWatchOptions, postOptions));
    });

    it('returns the options merged with default options when options for resource and verb were specified', () => {
        const verbOptions = {
            anOptionForPost: true,
        };
        const userOptions = {
            Post: {
                GET_LIST: verbOptions,
            },
        };
        const options = getWatchOptionsForQuery(userOptions, action);

        expect(options).toEqual(merge({}, defaultWatchOptions, verbOptions));
    });
});
