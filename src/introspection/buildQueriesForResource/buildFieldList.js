import isNotGraphqlPrivateType from '../isNotGraphqlPrivateType';

export default (resource, type, { excludeFields }) =>
    resource.fields
        .filter(isNotGraphqlPrivateType)
        .filter((field) => {
            if (excludeFields) {
                if (Array.isArray(excludeFields)) {
                    return !excludeFields.includes(field.name);
                }

                if (typeof excludeFields === 'function') {
                    return !excludeFields(field, resource, type);
                }
            }

            return true;
        })
        .map(f => f.name).join(' ');
