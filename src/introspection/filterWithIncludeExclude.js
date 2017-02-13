export default ({ include, exclude }) => {
    const completeBlackList = ['Query', 'Mutation'].concat(Array.isArray(exclude) ? exclude : []);

    if (include) {
        if (Array.isArray(include)) {
            return type => include.includes(type.name);
        }

        if (typeof include === 'function') {
            return type => !completeBlackList.includes(type.name) && include(type);
        }
    }

    if (exclude && typeof exclude === 'function') {
        return type => !completeBlackList.includes(type.name) && !exclude(type);
    }

    return type => !completeBlackList.includes(type.name);
};
