import expect from 'expect';

import handleError from './handleError';

describe('handleError', () => {
    const message = 'Run you fools!';

    it('throws an error for graphQLErrors', () => {
        expect(() => handleError({
            graphQLErrors: [{
                message,
            }],
        })).toThrow(message);
    });

    it('throws an error for networkError', () => {
        expect(() => handleError({
            networkError: {
                message,
            },
        })).toThrow(message);
    });

    it('throws other errors', () => {
        expect(() => handleError({
            message,
        })).toThrow(message);
    });
});
