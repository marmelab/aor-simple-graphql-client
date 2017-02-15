export default (valueOrFunction, ...args) => {
    if (typeof valueOrFunction === 'function') {
        return valueOrFunction(...args);
    }

    return valueOrFunction;
};
