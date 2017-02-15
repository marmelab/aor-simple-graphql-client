import expect, { createSpy } from 'expect';
import { queryWatcherFactory } from './createApolloQueryChannel';

describe('realtime', () => {
    describe('createApolloQueryChannel', () => {
        describe('queryWatcher', () => {
            const observerUnsubscribe = createSpy();
            const queryObserver = createSpy().andReturn({
                unsubscribe: observerUnsubscribe,
            });
            const emitter = 'the emitter';
            const watcher = {
                subscribe: createSpy(),
            };

            const unsubscribe = queryWatcherFactory(queryObserver)(watcher, 'the emitter');

            it('calls the queryObserver with the specified emitter', () => {
                expect(queryObserver).toHaveBeenCalledWith(emitter);
            });

            it('calls subscribe on the watcher', () => {
                expect(watcher.subscribe).toHaveBeenCalled();
            });

            it('returns an unsubscribe function which calls observer.unsubscribe when invoked', () => {
                unsubscribe();
                expect(observerUnsubscribe).toHaveBeenCalled();
            });
        });
    });
});
