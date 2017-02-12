export default ({ includeTypes, excludeTypes }) => {
    if (includeTypes) {
        if (Array.isArray(includeTypes)) {
            return type => includeTypes.includes(type.name);
        }

        if (typeof includeTypes === 'function') {
            return type => includeTypes(type);
        }
    }

    const completeBlackList = ['Query', 'Mutation'].concat(Array.isArray(excludeTypes) ? excludeTypes : []);

    if (excludeTypes && typeof excludeTypes === 'function') {
        return type => !completeBlackList.includes(type.name) && !excludeTypes(type);
    }

    return type => !completeBlackList.includes(type.name);
};
