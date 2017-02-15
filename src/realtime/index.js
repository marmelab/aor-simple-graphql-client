import sagaFactory from './saga';

export default apolloConfiguredClient => sagaFactory(apolloConfiguredClient);
