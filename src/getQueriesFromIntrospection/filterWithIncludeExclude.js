export default ({ include, exclude }) => {
    if (include) {
        if (Array.isArray(include)) {
            return type => include.includes(type.name);
        }

        if (typeof include === 'function') {
            return type => include(type);
        }
    }

    const completeBlackList = ['Query', 'Mutation'].concat(Array.isArray(exclude) ? exclude : []);

    if (exclude && typeof exclude === 'function') {
        return type => !completeBlackList.includes(type.name) && !exclude(type);
    }

    return type => !completeBlackList.includes(type.name);
};
