import { eventChannel } from 'redux-saga';
import queryObserver from './queryObserver';

export default watcher => eventChannel((emitter) => {
    const observer = queryObserver(emitter);
    watcher.subscribe(observer);

    const unsubscribe = () => {
        observer.unsubscribe();
    };

    return unsubscribe;
});
