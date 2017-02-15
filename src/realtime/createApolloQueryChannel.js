import { eventChannel } from 'redux-saga';
import queryObserver from './queryObserver';

export const queryWatcherFactory = queryObserverImpl => (watcher, emitter) => {
    const observer = queryObserverImpl(emitter);
    watcher.subscribe(observer);

    const unsubscribe = () => {
        observer.unsubscribe();
    };

    return unsubscribe;
};

export default watcher => eventChannel(emitter => queryWatcherFactory(queryObserver)(watcher, emitter));
